import { useEffect, useMemo, useRef, useState } from "react"
import {
  Clock3,
  GripVertical,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { gsap } from "gsap"

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

const Whiteboard = ({ doctors, appointments, onAppointmentChange, onAppointmentDoubleClick }) => {
  const boardRef = useRef(null)
  const [transform, setTransform] = useState({ scale: 1, translate: { x: 24, y: 24 } })
  const [dragState, setDragState] = useState(null)
  const isMiddleButtonRef = useRef(false)
  const [isMiddleButton, setIsMiddleButton] = useState(false)
  const zoomControlsRef = useRef(null)
  const timelineHeaderRef = useRef(null)
  const timelineColumnRef = useRef(null)
  const doctorCardRefs = useRef({})
  const doctorColumnRefs = useRef({})
  const appointmentRefs = useRef({})
  const hasAnimatedRef = useRef(false)
  const clickStartRef = useRef(null)
  const clickAppointmentRef = useRef(null)
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

  // Animate elements with GSAP - only once per session
  useEffect(() => {
    // Skip if already animated in this session
    const animationKey = 'whiteboard-animated'
    if (sessionStorage.getItem(animationKey) === 'true') {
      return
    }

    let tl = null
    // Wait for DOM to be ready - increased timeout to ensure elements are rendered
    const timeoutId = setTimeout(() => {
      // Mark as animated before starting animations
      sessionStorage.setItem(animationKey, 'true')
      
      tl = gsap.timeline()

      // Zoom controls
      if (zoomControlsRef.current) {
        gsap.set(zoomControlsRef.current, { opacity: 0, y: 20, scale: 0.95 })
        tl.to(zoomControlsRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, 0.1)
      }

      // Timeline header
      if (timelineHeaderRef.current) {
        gsap.set(timelineHeaderRef.current, { opacity: 0, y: 20, scale: 0.95 })
        tl.to(timelineHeaderRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, 0.2)
      }

      // Timeline column
      if (timelineColumnRef.current) {
        gsap.set(timelineColumnRef.current, { opacity: 0, y: 20, scale: 0.95 })
        tl.to(timelineColumnRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, 0.3)
      }

      // Doctor cards and columns
      doctors.forEach((doctor, doctorIndex) => {
        const delay = 0.4 + doctorIndex * 0.2

        if (doctorCardRefs.current[doctor.id]) {
          gsap.set(doctorCardRefs.current[doctor.id], { opacity: 0, y: 30, scale: 0.9 })
          tl.to(doctorCardRefs.current[doctor.id], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
          }, delay)
        }

        if (doctorColumnRefs.current[doctor.id]) {
          gsap.set(doctorColumnRefs.current[doctor.id], { opacity: 0, y: 30, scale: 0.95 })
          tl.to(doctorColumnRefs.current[doctor.id], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
          }, delay + 0.1)
        }

        // Appointments for this doctor - use querySelector to find them
        const columnAppointments = appointmentsByDoctor[doctor.id] ?? []
        columnAppointments.forEach((appointment, appointmentIndex) => {
          const appointmentDelay = delay + 0.2 + appointmentIndex * 0.08
          const appointmentElement = document.querySelector(`[data-appointment-id="${appointment.id}"]`)
          if (appointmentElement) {
            gsap.set(appointmentElement, { opacity: 0, y: 20, scale: 0.95 })
            tl.to(appointmentElement, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            }, appointmentDelay)
          }
        })
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (tl) {
        tl.kill()
      }
    }
  }, [])

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

    const handleMouseDown = (event) => {
      // Prevenim selectarea când folosim scroll wheel click
      if (event.button === 1) {
        isMiddleButtonRef.current = true
        setIsMiddleButton(true)
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const handleMouseUp = (event) => {
      // Prevenim selectarea când se termină scroll wheel click
      if (event.button === 1) {
        event.preventDefault()
        event.stopPropagation()
        // Resetăm flag-ul după un mic delay pentru a preveni click-ul care urmează
        setTimeout(() => {
          isMiddleButtonRef.current = false
          setIsMiddleButton(false)
        }, 100)
      }
    }

    const handleClick = (event) => {
      // Prevenim click-ul stâng care poate fi declanșat de scroll wheel click
      if (isMiddleButtonRef.current || isMiddleButton || (dragState && dragState.pointerId !== null)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const handleSelectStart = (event) => {
      // Prevenim selectarea textului când suntem în drag cu scroll wheel
      if (isMiddleButtonRef.current || isMiddleButton || (dragState && dragState.pointerId !== null)) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    element.addEventListener("contextmenu", handleContextMenu)
    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("mouseup", handleMouseUp)
    element.addEventListener("click", handleClick)
    document.addEventListener("selectstart", handleSelectStart)

    return () => {
      element.removeEventListener("contextmenu", handleContextMenu)
      element.removeEventListener("mousedown", handleMouseDown)
      element.removeEventListener("mouseup", handleMouseUp)
      element.removeEventListener("click", handleClick)
      document.removeEventListener("selectstart", handleSelectStart)
    }
  }, [dragState, isMiddleButton])

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

    // Scroll wheel click (button === 1) = doar pan (nu permite drag & drop pentru programări)
    if (event.button === 1) {
      // Setăm flag-ul pentru a preveni selectarea
      isMiddleButtonRef.current = true
      setIsMiddleButton(true)

      element.setPointerCapture(event.pointerId)
      event.preventDefault()
      event.stopPropagation()

      // Doar pan, nu permitem drag & drop pentru programări
      setDragState({
        type: "pan",
        pointerId: event.pointerId,
        origin: { x: event.clientX, y: event.clientY },
        start: { ...transform.translate },
      })
      return
    }

    // Click stâng (button === 0) = drag & drop pentru programări sau pan
    if (event.button !== 0) return

    const appointmentElement = event.target.closest("[data-appointment-id]")

    element.setPointerCapture(event.pointerId)
    event.preventDefault()

    if (appointmentElement) {
      const appointmentId = appointmentElement.dataset.appointmentId
      const appointment = appointments.find((item) => item.id === appointmentId)
      if (!appointment) {
        return
      }

      // Track click start position and appointment for potential click detection
      clickStartRef.current = { x: event.clientX, y: event.clientY }
      clickAppointmentRef.current = appointmentId

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
      clickStartRef.current = null
      clickAppointmentRef.current = null
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

    // If mouse moved significantly, it's a drag, not a click
    if (clickStartRef.current) {
      const deltaX = Math.abs(event.clientX - clickStartRef.current.x)
      const deltaY = Math.abs(event.clientY - clickStartRef.current.y)
      if (deltaX > 5 || deltaY > 5) {
        clickAppointmentRef.current = null // Clear appointment ref if dragging
      }
    }

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
    
    // Check if this was a click (not a drag) on an appointment
    if (event && clickAppointmentRef.current && dragState?.type === "appointment") {
      const appointmentId = clickAppointmentRef.current
      const appointment = appointments.find((item) => item.id === appointmentId)
      
      // Check if mouse moved significantly
      const moved = clickStartRef.current && (
        Math.abs(event.clientX - clickStartRef.current.x) > 5 ||
        Math.abs(event.clientY - clickStartRef.current.y) > 5
      )
      
      // If mouse didn't move much, it was a click - open drawer
      if (!moved && onAppointmentDoubleClick && appointment) {
        // Use setTimeout to ensure this happens after drag state is cleared
        setTimeout(() => {
          onAppointmentDoubleClick(appointment)
        }, 0)
      }
    }
    
    if (event) {
      element.releasePointerCapture(event.pointerId)
    }
    setDragState(null)
    clickStartRef.current = null
    clickAppointmentRef.current = null
    // Resetăm flag-ul după un mic delay pentru a preveni click-ul care urmează
    setTimeout(() => {
      isMiddleButtonRef.current = false
      setIsMiddleButton(false)
    }, 100)
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
      <div className="height-[calc(100vh-64px)] bg-grid-dots">
      <TooltipProvider delayDuration={100}>
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div className="pointer-events-none absolute right-4 top-4 z-20 flex flex-col gap-2">
            <div
              ref={zoomControlsRef}
              className="pointer-events-auto flex items-center gap-2 rounded-md border border-border/70 bg-white px-2 py-1 shadow-sm"
            >
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
              className={cn(
                "relative h-full touch-none",
                (dragState || isMiddleButton) && "select-none"
              )}
              style={{
                userSelect: (dragState || isMiddleButton) ? "none" : "auto",
                WebkitUserSelect: (dragState || isMiddleButton) ? "none" : "auto",
                MozUserSelect: (dragState || isMiddleButton) ? "none" : "auto",
                msUserSelect: (dragState || isMiddleButton) ? "none" : "auto",
              }}
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
                    <div
                      ref={timelineHeaderRef}
                      className="mb-9 flex items-center justify-between rounded-lg border-2 border-dashed border-border/80 bg-white shadow-sm px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground"
                    >
                      <span>Timp</span>
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div
                      ref={timelineColumnRef}
                      className="relative rounded-lg border-2 border-dashed border-border/80 bg-white"
                      style={{ height: boardHeight }}
                    >
                      {timelineMarks.map(({ minutes, top, isHour }) => (
                        <div
                          key={`timeline-${minutes}`}
                          className={cn(
                            "absolute left-0 right-0 border-b border-border/50",
                            isHour && "border-border",
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

                  {doctors.map((doctor, doctorIndex) => {
                    const columnAppointments = appointmentsByDoctor[doctor.id] ?? []

                    return (
                      <div key={doctor.id} className="relative">
                        <div
                          ref={(el) => {
                            if (el) doctorCardRefs.current[doctor.id] = el
                          }}
                          className="mb-3 flex flex-col gap-1 rounded-lg border-2 border-border/80 bg-white px-3 py-2 shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                              {doctor.name}
                            </span>
                            <span
                              className="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm"
                              style={{ backgroundColor: doctor.color }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {doctor.specialty}
                          </span>
                        </div>

                        <div
                          ref={(el) => {
                            if (el) doctorColumnRefs.current[doctor.id] = el
                          }}
                          className={cn(
                            "relative rounded-lg border-2 border-border/70 bg-white transition",
                            draggingAppointmentId && columnAppointments.some((item) => item.id === draggingAppointmentId)
                              ? "ring-2 ring-primary/40 border-primary/60"
                              : "hover:border-primary/50"
                          )}
                          style={{ height: boardHeight }}
                        >

                          {columnAppointments.map((appointment, appointmentIndex) => {
                            const top = ((appointment.start - DAY_START) / SLOT_INTERVAL) * SLOT_HEIGHT
                            const height = (appointment.duration / SLOT_INTERVAL) * SLOT_HEIGHT - 12
                            const nextStatusStyle = statusStyles[appointment.status] ?? "bg-muted text-foreground"
                            const isShortDuration = appointment.duration <= 15

                            return (
                              <Tooltip key={appointment.id} delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div
                                    ref={(el) => {
                                      if (el) appointmentRefs.current[appointment.id] = el
                                    }}
                                    data-appointment-id={appointment.id}
                                    className={cn(
                                      "absolute left-2 right-2 z-10 flex h-full min-h-[60px] flex-col rounded-lg border-2 border-border/80 bg-white shadow-md transition-all overflow-hidden",
                                      isShortDuration ? "gap-1 px-2 py-1.5" : "gap-2 px-3 py-2",
                                      draggingAppointmentId === appointment.id
                                        ? "ring-2 ring-primary/60 shadow-xl border-primary"
                                        : "hover:shadow-lg hover:border-primary/60"
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
                                    apasa si gliseaza pentru a reprograma
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

