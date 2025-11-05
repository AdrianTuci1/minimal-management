import { useEffect, useMemo, useRef, useState } from "react"
import {
  Clock3,
  GripVertical,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Users,
} from "lucide-react"
import { gsap } from "gsap"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const DAY_START = 8 * 60 // 8:00 în minute
const DAY_END = 20 * 60 // 20:00 în minute
const SLOT_INTERVAL = 30 // 30 minute per slot
const SLOT_WIDTH = 80 // Lățime pentru fiecare slot de 30 minute
const ROW_HEIGHT = 120
const CLIENT_COLUMN_WIDTH = 260

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

const getTimeSlots = () => {
  const slots = []
  for (let minutes = DAY_START; minutes <= DAY_END; minutes += SLOT_INTERVAL) {
    slots.push({
      minutes,
      left: ((minutes - DAY_START) / SLOT_INTERVAL) * SLOT_WIDTH,
      isHour: minutes % 60 === 0,
    })
  }
  return slots
}

const statusStyles = {
  "confirmată": "bg-emerald-500/10 text-emerald-600",
  "în curs": "bg-amber-500/10 text-amber-600",
  "nouă": "bg-blue-500/10 text-blue-600",
  "prezent": "bg-emerald-500/10 text-emerald-600",
  "absent": "bg-red-500/10 text-red-600",
}

const FitnessWhiteboard = ({ clients = [], appointments = [], onAppointmentChange, onAppointmentDoubleClick }) => {
  const boardRef = useRef(null)
  const [transform, setTransform] = useState({ scale: 1, translate: { x: 24, y: 24 } })
  const [dragState, setDragState] = useState(null)
  const isMiddleButtonRef = useRef(false)
  const [isMiddleButton, setIsMiddleButton] = useState(false)
  const clickStartRef = useRef(null)
  const clickAppointmentRef = useRef(null)
  const zoomControlsRef = useRef(null)
  const clientsHeaderRef = useRef(null)
  const timelineHeaderRef = useRef(null)
  const clientCardRefs = useRef({})
  const clientColumnRefs = useRef({})
  const draggingAppointmentId = dragState?.type === "appointment" ? dragState.id : null

  const timeSlots = useMemo(() => getTimeSlots(), [])
  const boardWidth = timeSlots.length * SLOT_WIDTH

  // Debug: log pentru a vedea ce primește componenta
  console.log("FitnessWhiteboard - clients:", clients)
  console.log("FitnessWhiteboard - appointments:", appointments)

  const appointmentsByClient = useMemo(() => {
    const map = Object.fromEntries(clients.map((client) => [client.id, []]))

    for (const appointment of appointments) {
      if (!map[appointment.clientId]) continue
      map[appointment.clientId].push(appointment)
    }

    for (const clientId of Object.keys(map)) {
      map[clientId].sort((a, b) => {
        const startA = a.start || a.startMinutes || 0
        const startB = b.start || b.startMinutes || 0
        return startA - startB
      })
    }

    return map
  }, [appointments, clients])

  // Animate elements with GSAP - only once per session
  useEffect(() => {
    const animationKey = 'fitness-whiteboard-animated'
    if (sessionStorage.getItem(animationKey) === 'true') {
      return
    }

    let tl = null
    const timeoutId = setTimeout(() => {
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

      // Clients header
      if (clientsHeaderRef.current) {
        gsap.set(clientsHeaderRef.current, { opacity: 0, y: 20, scale: 0.95 })
        tl.to(clientsHeaderRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, 0.2)
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
        }, 0.3)
      }

      // Client cards and columns
      clients.forEach((client, clientIndex) => {
        const delay = 0.4 + clientIndex * 0.2

        if (clientCardRefs.current[client.id]) {
          gsap.set(clientCardRefs.current[client.id], { opacity: 0, y: 30, scale: 0.9 })
          tl.to(clientCardRefs.current[client.id], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
          }, delay)
        }

        if (clientColumnRefs.current[client.id]) {
          gsap.set(clientColumnRefs.current[client.id], { opacity: 0, y: 30, scale: 0.95 })
          tl.to(clientColumnRefs.current[client.id], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
          }, delay + 0.1)
        }

        // Appointments for this client
        const rowAppointments = appointmentsByClient[client.id] ?? []
        rowAppointments.forEach((appointment, appointmentIndex) => {
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
  }, [clients, appointments, appointmentsByClient])

  const getSlotIndex = (minutes) => {
    if (minutes < DAY_START || minutes > DAY_END) return -1
    return Math.floor((minutes - DAY_START) / SLOT_INTERVAL)
  }

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
      const clientIndex = clients.findIndex((client) => client.id === appointment.clientId)
      const startMinutes = appointment.start || appointment.startMinutes || DAY_START
      const slotIndex = getSlotIndex(startMinutes)
      const offsetX = x - (CLIENT_COLUMN_WIDTH + slotIndex * SLOT_WIDTH)
      const offsetY = y - (48 + clientIndex * ROW_HEIGHT)

      setDragState({
        type: "appointment",
        pointerId: event.pointerId,
        id: appointmentId,
        offsetX,
        offsetY,
        duration: appointment.duration || 60, // durata în minute
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
      const rawX = x - dragState.offsetX - CLIENT_COLUMN_WIDTH
      const rawY = y - dragState.offsetY - 48
      const rowIndex = clamp(
        Math.floor(rawY / ROW_HEIGHT),
        0,
        Math.max(0, clients.length - 1),
      )
      const snappedSlotIndex = clamp(
        Math.round(rawX / SLOT_WIDTH),
        0,
        timeSlots.length - Math.ceil(dragState.duration / SLOT_INTERVAL),
      )

      const nextClientId = clients[rowIndex]?.id ?? appointment.clientId
      const snappedMinutes = DAY_START + snappedSlotIndex * SLOT_INTERVAL
      const snappedMinutesClamped = clamp(
        snappedMinutes,
        DAY_START,
        DAY_END - dragState.duration,
      )

      const currentStart = appointment.start || appointment.startMinutes || 0

      if (currentStart !== snappedMinutesClamped || appointment.clientId !== nextClientId) {
        onAppointmentChange?.(appointment.id, {
          start: snappedMinutesClamped,
          startMinutes: snappedMinutesClamped,
          clientId: nextClientId,
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
    () => `${CLIENT_COLUMN_WIDTH}px repeat(${timeSlots.length}, ${SLOT_WIDTH}px)`,
    [timeSlots.length],
  )

  const gridTemplateRows = useMemo(
    () => `48px repeat(${clients.length}, ${ROW_HEIGHT}px)`,
    [clients.length],
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
                  className="grid gap-x-4 gap-y-4"
                  style={{ gridTemplateColumns, gridTemplateRows }}
                >
                  {/* Prima coloană - Header pentru clienți */}
                  <div className="relative">
                    <div
                      ref={clientsHeaderRef}
                      className="mb-9 flex items-center justify-between rounded-lg border-2 border-dashed border-border/80 bg-white shadow-sm px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground"
                    >
                      <span>Clienți</span>
                      <Users className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Header row - Timeline cu ore */}
                  <div className="relative" style={{ gridColumn: `2 / -1` }}>
                    <div
                      ref={timelineHeaderRef}
                      className="relative rounded-lg border-2 border-dashed border-border/80 bg-white"
                      style={{ width: boardWidth, height: "100%" }}
                    >
                      {timeSlots.map((slot, index) => {
                        const isWeekend = false // Nu avem weekend pentru ore
                        return (
                          <div
                            key={`slot-${index}`}
                            className={cn(
                              "absolute top-0 bottom-0 border-l border-border/50",
                              slot.isHour && "border-border",
                            )}
                            style={{ left: slot.left }}
                          >
                            {slot.isHour && (
                              <div className="absolute -top-9 left-0 w-full flex flex-col items-center">
                                <span className="text-[10px] font-semibold text-muted-foreground">
                                  {formatMinutes(slot.minutes)}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Client rows */}
                  {clients.length > 0 ? clients.map((client, clientIndex) => {
                    const rowAppointments = appointmentsByClient[client.id] ?? []

                    return (
                      <div key={`client-row-${client.id}`} style={{ display: 'contents' }}>
                        {/* Coloana clientului */}
                        <div className="relative">
                          <div
                            ref={(el) => {
                              if (el) clientCardRefs.current[client.id] = el
                            }}
                            className="flex flex-col gap-1 rounded-lg border-2 border-border/80 bg-white px-3 py-2 shadow-md h-full"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-foreground">
                                  {client.name}
                                </span>
                              </div>
                              {client.color && (
                                <span
                                  className="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm"
                                  style={{ backgroundColor: client.color }}
                                />
                              )}
                            </div>
                            {client.package && (
                              <span className="text-xs text-muted-foreground">
                                {client.package}
                              </span>
                            )}
                            {client.phone && (
                              <span className="text-xs text-muted-foreground">
                                {client.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Coloana cu programări */}
                        <div
                          ref={(el) => {
                            if (el) clientColumnRefs.current[client.id] = el
                          }}
                          className={cn(
                            "relative rounded-lg border-2 border-border/70 bg-white transition",
                            draggingAppointmentId && rowAppointments.some((item) => item.id === draggingAppointmentId)
                              ? "ring-2 ring-primary/40 border-primary/60"
                              : "hover:border-primary/50"
                          )}
                          style={{ 
                            gridColumn: `2 / -1`,
                            height: ROW_HEIGHT 
                          }}
                        >
                          {rowAppointments.map((appointment) => {
                            const startMinutes = appointment.start || appointment.startMinutes || DAY_START
                            const slotIndex = getSlotIndex(startMinutes)
                            const duration = appointment.duration || 60 // durata în minute
                            
                            if (slotIndex < 0 || slotIndex >= timeSlots.length) return null
                            
                            const left = slotIndex * SLOT_WIDTH
                            const widthSlots = Math.ceil(duration / SLOT_INTERVAL)
                            const width = widthSlots * SLOT_WIDTH - 12
                            const nextStatusStyle = statusStyles[appointment.status] ?? "bg-muted text-foreground"
                            const isShortDuration = duration <= 30

                            const endMinutes = startMinutes + duration

                            return (
                              <Tooltip key={appointment.id} delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div
                                    data-appointment-id={appointment.id}
                                    className={cn(
                                      "absolute z-10 flex h-full min-w-[100px] flex-col rounded-lg border-2 border-border/80 bg-white shadow-md transition-all overflow-hidden",
                                      isShortDuration ? "gap-1 px-2 py-1.5" : "gap-2 px-3 py-2",
                                      draggingAppointmentId === appointment.id
                                        ? "ring-2 ring-primary/60 shadow-xl border-primary"
                                        : "hover:shadow-lg hover:border-primary/60",
                                    )}
                                    style={{ left, width }}
                                  >
                                    <div className={cn(
                                      "flex items-center justify-between font-medium text-muted-foreground",
                                      isShortDuration ? "text-[10px] leading-tight" : "text-xs"
                                    )}>
                                      <span>{`${formatMinutes(startMinutes)} – ${formatMinutes(endMinutes)}`}</span>
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
                                        {appointment.clientName
                                          ?.split(" ")
                                          .map((part) => part[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase() || client.name
                                          ?.split(" ")
                                          .map((part) => part[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase() || "CL"}
                                      </span>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className={cn(
                                          "font-semibold leading-tight text-foreground truncate",
                                          isShortDuration ? "text-xs" : "text-sm"
                                        )}>
                                          {appointment.clientName || client.name || "Client"}
                                        </span>
                                        {appointment.training && (
                                          <span className={cn(
                                            "text-muted-foreground truncate",
                                            isShortDuration ? "text-[10px] leading-tight" : "text-xs"
                                          )}>
                                            {appointment.training || appointment.treatment || appointment.service || "Programare"}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="rounded-md border-border/70 bg-white/95 shadow-lg">
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
                  }) : (
                    <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                      <span>Nu există clienți de afișat</span>
                    </div>
                  )}
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

export default FitnessWhiteboard
