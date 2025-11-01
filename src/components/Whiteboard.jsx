import { useEffect, useMemo, useRef, useState } from "react"
import {
  Clock3,
  GripVertical,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const DAY_START = 8 * 60
const DAY_END = 20 * 60
const SLOT_INTERVAL = 15
const SLOT_HEIGHT = 48
const COLUMN_WIDTH = 260

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

const statusStyles = {
  "confirmată": "bg-emerald-500/10 text-emerald-600",
  "în curs": "bg-amber-500/10 text-amber-600",
  "nouă": "bg-blue-500/10 text-blue-600",
}

const Whiteboard = ({ doctors, appointments, onAppointmentChange }) => {
  const boardRef = useRef(null)
  const [transform, setTransform] = useState({ scale: 1, translate: { x: 24, y: 24 } })
  const [dragState, setDragState] = useState(null)
  const totalSlots = useMemo(() => (DAY_END - DAY_START) / SLOT_INTERVAL, [])
  const boardHeight = totalSlots * SLOT_HEIGHT
  const draggingAppointmentId = dragState?.type === "appointment" ? dragState.id : null

  const appointmentsByDoctor = useMemo(() => {
    const map = Object.fromEntries(doctors.map((doctor) => [doctor.id, []]))

    for (const appointment of appointments) {
      if (!map[appointment.doctorId]) continue
      map[appointment.doctorId].push(appointment)
    }

    for (const doctorId of Object.keys(map)) {
      map[doctorId].sort((a, b) => a.start - b.start)
    }

    return map
  }, [appointments, doctors])

  const timelineMarks = useMemo(() => {
    const marks = []
    for (let minutes = DAY_START; minutes <= DAY_END; minutes += SLOT_INTERVAL) {
      const top = ((minutes - DAY_START) / SLOT_INTERVAL) * SLOT_HEIGHT
      const isHour = minutes % 60 === 0
      marks.push({ minutes, top, isHour })
    }
    return marks
  }, [])

  useEffect(() => {
    const element = boardRef.current
    if (!element) return

    const handleContextMenu = (event) => {
      event.preventDefault()
    }

    element.addEventListener("contextmenu", handleContextMenu)

    return () => {
      element.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  const toBoardCoords = (clientX, clientY) => {
    const element = boardRef.current
    if (!element) return { x: 0, y: 0 }
    const rect = element.getBoundingClientRect()
    const x = (clientX - rect.left - transform.translate.x) / transform.scale
    const y = (clientY - rect.top - transform.translate.y) / transform.scale
    return { x, y }
  }

  const handlePointerDown = (event) => {
    const element = boardRef.current
    if (!element) return

    const appointmentElement = event.target.closest("[data-appointment-id]")

    element.setPointerCapture(event.pointerId)
    event.preventDefault()

    if (appointmentElement) {
      const appointmentId = appointmentElement.dataset.appointmentId
      const appointment = appointments.find((item) => item.id === appointmentId)
      if (!appointment) {
        return
      }

      const { x, y } = toBoardCoords(event.clientX, event.clientY)
      const doctorIndex = doctors.findIndex((doctor) => doctor.id === appointment.doctorId)
      const offsetX = x - doctorIndex * COLUMN_WIDTH
      const offsetY =
        y - ((appointment.start - DAY_START) / SLOT_INTERVAL) * SLOT_HEIGHT

      setDragState({
        type: "appointment",
        pointerId: event.pointerId,
        id: appointmentId,
        offsetX,
        offsetY,
        duration: appointment.duration,
      })
    } else {
      setDragState({
        type: "pan",
        pointerId: event.pointerId,
        origin: { x: event.clientX, y: event.clientY },
        start: { ...transform.translate },
      })
    }
  }

  const handlePointerMove = (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return

    event.preventDefault()

    if (dragState.type === "pan") {
      const deltaX = event.clientX - dragState.origin.x
      const deltaY = event.clientY - dragState.origin.y
      setTransform((current) => ({
        ...current,
        translate: {
          x: dragState.start.x + deltaX,
          y: dragState.start.y + deltaY,
        },
      }))
      return
    }

    if (dragState.type === "appointment") {
      const appointment = appointments.find((item) => item.id === dragState.id)
      if (!appointment) return

      const { x, y } = toBoardCoords(event.clientX, event.clientY)
      const rawY = y - dragState.offsetY
      const rawX = x - dragState.offsetX
      const columnIndex = clamp(
        Math.floor(rawX / COLUMN_WIDTH),
        0,
        Math.max(0, doctors.length - 1),
      )
      const snappedMinutes = clamp(
        Math.round(rawY / SLOT_HEIGHT) * SLOT_INTERVAL + DAY_START,
        DAY_START,
        DAY_END - dragState.duration,
      )

      const nextDoctorId = doctors[columnIndex]?.id ?? appointment.doctorId

      if (appointment.start !== snappedMinutes || appointment.doctorId !== nextDoctorId) {
        onAppointmentChange?.(appointment.id, {
          start: snappedMinutes,
          doctorId: nextDoctorId,
        })
      }
    }
  }

  const endDrag = (event) => {
    const element = boardRef.current
    if (!element) return
    if (event) {
      element.releasePointerCapture(event.pointerId)
    }
    setDragState(null)
  }

  const handleWheel = (event) => {
    if (!boardRef.current) return

    const isZoomGesture = event.ctrlKey || event.metaKey

    if (!isZoomGesture) {
      return
    }

    event.preventDefault()

    const zoomDelta = -event.deltaY * 0.0015

    setTransform((current) => {
      const nextScale = clamp(current.scale * (1 + zoomDelta), 0.65, 1.8)
      const rect = boardRef.current.getBoundingClientRect()
      const originX = (event.clientX - rect.left - current.translate.x) / current.scale
      const originY = (event.clientY - rect.top - current.translate.y) / current.scale

      return {
        scale: nextScale,
        translate: {
          x: event.clientX - rect.left - originX * nextScale,
          y: event.clientY - rect.top - originY * nextScale,
        },
      }
    })
  }

  const handleZoomStep = (direction) => {
    setTransform((current) => {
      const nextScale = clamp(current.scale + direction * 0.1, 0.65, 1.8)
      return { ...current, scale: nextScale }
    })
  }

  const handleResetView = () => {
    setTransform({ scale: 1, translate: { x: 24, y: 24 } })
  }

  const gridTemplateColumns = useMemo(
    () => `96px repeat(${doctors.length}, ${COLUMN_WIDTH}px)`,
    [doctors.length],
  )

  return (
    <section className="relative flex flex-1 min-h-0 flex-col overflow-hidden bg-white height-[calc(100vh-200px)]">
      <div className="height-[calc(100vh-64px)]">
      <TooltipProvider delayDuration={100}>
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div className="pointer-events-none absolute right-4 top-4 z-20 flex flex-col gap-2">
            <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-border/70 bg-white px-2 py-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleZoomStep(-1)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(transform.scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleZoomStep(1)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleResetView}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-full w-full" type="always">
            <div
              ref={boardRef}
              className="relative h-full touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onWheel={handleWheel}
            >
              <div
                className="relative w-fit min-w-full select-none pb-16"
                style={{
                  transform: `translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})`,
                  transformOrigin: "0 0",
                }}
              >
                <div
                  className="grid gap-x-4"
                  style={{ gridTemplateColumns }}
                >
                  <div className="relative">
                    <div className="mb-9 flex items-center justify-between rounded-lg border border-dashed border-muted/70 bg-white/80 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <span>Timp</span>
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div
                      className="relative rounded-lg border border-dashed border-muted/60 bg-white"
                      style={{ height: boardHeight }}
                    >
                      <div className="absolute inset-0 rounded-lg bg-grid-dots opacity-30" />
                      {timelineMarks.map(({ minutes, top, isHour }) => (
                        <div
                          key={`timeline-${minutes}`}
                          className={cn(
                            "absolute left-0 right-0 border-b border-border/30",
                            isHour && "border-border/70",
                          )}
                          style={{ top }}
                        >
                          {isHour ? (
                            <span className="absolute -left-3 -translate-y-1/2 rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-sm">
                              {formatMinutes(minutes)}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  {doctors.map((doctor) => {
                    const columnAppointments = appointmentsByDoctor[doctor.id] ?? []

                    return (
                      <div key={doctor.id} className="relative">
                        <div className="mb-3 flex flex-col gap-1 rounded-lg border border-border/70 bg-white px-3 py-2 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                              {doctor.name}
                            </span>
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: doctor.color }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {doctor.specialty}
                          </span>
                        </div>

                        <div
                          className={cn(
                            "relative rounded-lg border border-border/60 bg-white transition",
                            draggingAppointmentId && columnAppointments.some((item) => item.id === draggingAppointmentId)
                              ? "ring-2 ring-primary/25"
                              : "hover:border-primary/35",
                          )}
                          style={{ height: boardHeight }}
                        >
                          <div className="pointer-events-none absolute inset-0 rounded-md bg-grid-dots opacity-30" />

                          {columnAppointments.map((appointment) => {
                            const top = ((appointment.start - DAY_START) / SLOT_INTERVAL) * SLOT_HEIGHT
                            const height = (appointment.duration / SLOT_INTERVAL) * SLOT_HEIGHT - 12
                            const nextStatusStyle = statusStyles[appointment.status] ?? "bg-muted text-foreground"
                            const isShortDuration = appointment.duration <= 15

                            return (
                              <Tooltip key={appointment.id} delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div
                                    data-appointment-id={appointment.id}
                                    className={cn(
                                      "absolute left-2 right-2 z-10 flex h-full min-h-[60px] flex-col rounded-lg border border-border/60 bg-white/95 shadow-sm transition-all overflow-hidden",
                                      isShortDuration ? "gap-1 px-2 py-1.5" : "gap-2 px-3 py-2",
                                      draggingAppointmentId === appointment.id
                                        ? "ring-2 ring-primary/40 shadow-xl"
                                        : "hover:shadow-lg",
                                    )}
                                    style={{ top, height }}
                                  >
                                    <div className={cn(
                                      "flex items-center justify-between font-medium text-muted-foreground",
                                      isShortDuration ? "text-[10px] leading-tight" : "text-xs"
                                    )}>
                                      <span>{`${formatMinutes(appointment.start)} – ${formatMinutes(
                                        appointment.start + appointment.duration,
                                      )}`}</span>
                                      <span className={cn(
                                        "rounded-full px-1.5 py-0.5 font-semibold uppercase shrink-0",
                                        isShortDuration ? "text-[9px]" : "text-[10px] px-2",
                                        nextStatusStyle
                                      )}>
                                        {appointment.status}
                                      </span>
                                    </div>
                                    <div className={cn(
                                      "flex items-start",
                                      isShortDuration ? "gap-1.5" : "gap-2"
                                    )}>
                                      <span className={cn(
                                        "inline-flex shrink-0 items-center justify-center rounded-md bg-primary/10 font-bold text-primary",
                                        isShortDuration ? "h-5 w-5 text-[10px] mt-0" : "h-6 w-6 text-[11px] mt-0.5"
                                      )}>
                                        {appointment.patient
                                          .split(" ")
                                          .map((part) => part[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase()}
                                      </span>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className={cn(
                                          "font-semibold leading-tight text-foreground truncate",
                                          isShortDuration ? "text-xs" : "text-sm"
                                        )}>
                                          {appointment.patient}
                                        </span>
                                        <span className={cn(
                                          "text-muted-foreground truncate",
                                          isShortDuration ? "text-[10px] leading-tight" : "text-xs"
                                        )}>
                                          {appointment.treatment}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="rounded-md border-border/70 bg-white/95 shadow-lg">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <GripVertical className="h-3.5 w-3.5" />
                                    Glisează pentru a reprograma (pas de 15 minute)
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </TooltipProvider>
      </div>
    </section>
  )
}

export default Whiteboard

