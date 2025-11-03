import { useEffect, useMemo, useRef, useState } from "react"
import {
  Calendar,
  GripVertical,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Bed,
} from "lucide-react"
import { gsap } from "gsap"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import useAppStore from "@/store/appStore"

const DAYS_TO_SHOW = 14 // 2 săptămâni
const SLOT_WIDTH = 120 // Lățime pentru fiecare zi
const ROW_HEIGHT = 120
const ROOM_COLUMN_WIDTH = 260

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const formatDate = (date) => {
  const d = new Date(date)
  const dayNames = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"]
  const dayName = dayNames[d.getDay() === 0 ? 6 : d.getDay() - 1]
  const day = d.getDate()
  const month = d.getMonth() + 1
  return { dayName, day, month, fullDate: d }
}

const getDaysInRange = (startDate, daysCount) => {
  const days = []
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push(formatDate(date))
  }
  
  return days
}

const statusStyles = {
  "confirmată": "bg-emerald-500/10 text-emerald-600",
  "în curs": "bg-amber-500/10 text-amber-600",
  "nouă": "bg-blue-500/10 text-blue-600",
  "ocupată": "bg-red-500/10 text-red-600",
  "disponibilă": "bg-emerald-500/10 text-emerald-600",
  "check-out": "bg-orange-500/10 text-orange-600",
}

// Mock rooms data pentru hotel
const initialRooms = [
  { id: "room-101", number: "101", type: "Single", floor: 1, status: "disponibilă" },
  { id: "room-102", number: "102", type: "Double", floor: 1, status: "disponibilă" },
  { id: "room-103", number: "103", type: "Single", floor: 1, status: "disponibilă" },
  { id: "room-104", number: "104", type: "Double", floor: 1, status: "disponibilă" },
  { id: "room-201", number: "201", type: "Suite", floor: 2, status: "disponibilă" },
  { id: "room-202", number: "202", type: "Double", floor: 2, status: "disponibilă" },
  { id: "room-203", number: "203", type: "Single", floor: 2, status: "disponibilă" },
  { id: "room-301", number: "301", type: "Suite", floor: 3, status: "disponibilă" },
]

const HotelWhiteboard = ({ rooms = initialRooms, reservations = [], onReservationChange }) => {
  const boardRef = useRef(null)
  const [transform, setTransform] = useState({ scale: 1, translate: { x: 24, y: 24 } })
  const [dragState, setDragState] = useState(null)
  const isMiddleButtonRef = useRef(false)
  const [isMiddleButton, setIsMiddleButton] = useState(false)
  const zoomControlsRef = useRef(null)
  const roomsHeaderRef = useRef(null)
  const timelineHeaderRef = useRef(null)
  const roomCardRefs = useRef({})
  const roomColumnRefs = useRef({})
  const { selectedDateRange } = useAppStore()
  
  // Folosește date range-ul din store sau fallback la săptămâna curentă
  const startDate = useMemo(() => {
    if (selectedDateRange?.from) {
      const date = new Date(selectedDateRange.from)
      date.setHours(0, 0, 0, 0)
      return date
    }
    // Fallback: începe de luni săptămâna curentă
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Ajustare pentru luni
    const monday = new Date(today)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    return monday
  }, [selectedDateRange])
  
  // Calculează numărul de zile din range sau folosește default
  const daysToShow = useMemo(() => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      const diffTime = selectedDateRange.to - selectedDateRange.from
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return Math.max(diffDays, DAYS_TO_SHOW) // Minimum DAYS_TO_SHOW zile
    }
    return DAYS_TO_SHOW
  }, [selectedDateRange])
  
  const days = useMemo(() => getDaysInRange(startDate, daysToShow), [startDate, daysToShow])
  const boardWidth = daysToShow * SLOT_WIDTH
  const draggingReservationId = dragState?.type === "reservation" ? dragState.id : null

  const reservationsByRoom = useMemo(() => {
    const map = Object.fromEntries(rooms.map((room) => [room.id, []]))

    for (const reservation of reservations) {
      if (!map[reservation.roomId]) continue
      map[reservation.roomId].push(reservation)
    }

    for (const roomId of Object.keys(map)) {
      map[roomId].sort((a, b) => {
        const dateA = new Date(a.startDate || a.date || a.start)
        const dateB = new Date(b.startDate || b.date || b.start)
        return dateA - dateB
      })
    }

    return map
  }, [reservations, rooms])

  // Animate elements with GSAP - only once per session
  useEffect(() => {
    const animationKey = 'hotel-whiteboard-animated'
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

      // Rooms header
      if (roomsHeaderRef.current) {
        gsap.set(roomsHeaderRef.current, { opacity: 0, y: 20, scale: 0.95 })
        tl.to(roomsHeaderRef.current, {
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

      // Room cards and columns
      rooms.forEach((room, roomIndex) => {
        const delay = 0.4 + roomIndex * 0.2

        if (roomCardRefs.current[room.id]) {
          gsap.set(roomCardRefs.current[room.id], { opacity: 0, y: 30, scale: 0.9 })
          tl.to(roomCardRefs.current[room.id], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
          }, delay)
        }

        if (roomColumnRefs.current[room.id]) {
          gsap.set(roomColumnRefs.current[room.id], { opacity: 0, y: 30, scale: 0.95 })
          tl.to(roomColumnRefs.current[room.id], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
          }, delay + 0.1)
        }

        // Reservations for this room
        const rowReservations = reservationsByRoom[room.id] ?? []
        rowReservations.forEach((reservation, reservationIndex) => {
          const reservationDelay = delay + 0.2 + reservationIndex * 0.08
          const reservationElement = document.querySelector(`[data-reservation-id="${reservation.id}"]`)
          if (reservationElement) {
            gsap.set(reservationElement, { opacity: 0, y: 20, scale: 0.95 })
            tl.to(reservationElement, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            }, reservationDelay)
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
  }, [rooms, reservations, reservationsByRoom])

  const getDayIndex = (dateString) => {
    const date = new Date(dateString)
    const dayStart = new Date(startDate)
    dayStart.setHours(0, 0, 0, 0)
    const diffTime = date - dayStart
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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

    // Scroll wheel click (button === 1) = doar pan (nu permite drag & drop pentru rezervări)
    if (event.button === 1) {
      // Setăm flag-ul pentru a preveni selectarea
      isMiddleButtonRef.current = true
      setIsMiddleButton(true)

      element.setPointerCapture(event.pointerId)
      event.preventDefault()
      event.stopPropagation()

      // Doar pan, nu permitem drag & drop pentru rezervări
      setDragState({
        type: "pan",
        pointerId: event.pointerId,
        origin: { x: event.clientX, y: event.clientY },
        start: { ...transform.translate },
      })
      return
    }

    // Click stâng (button === 0) = drag & drop pentru rezervări sau pan
    if (event.button !== 0) return

    const reservationElement = event.target.closest("[data-reservation-id]")

    element.setPointerCapture(event.pointerId)
    event.preventDefault()

    if (reservationElement) {
      const reservationId = reservationElement.dataset.reservationId
      const reservation = reservations.find((item) => item.id === reservationId)
      if (!reservation) {
        return
      }

      const { x, y } = toBoardCoords(event.clientX, event.clientY)
      const roomIndex = rooms.findIndex((room) => room.id === reservation.roomId)
      const reservationStartDate = reservation.startDate || reservation.date || reservation.start
      const dayIndex = getDayIndex(reservationStartDate)
      const offsetX = x - (ROOM_COLUMN_WIDTH + dayIndex * SLOT_WIDTH)
      const offsetY = y - (48 + roomIndex * ROW_HEIGHT)

      setDragState({
        type: "reservation",
        pointerId: event.pointerId,
        id: reservationId,
        offsetX,
        offsetY,
        duration: reservation.duration || reservation.durationDays || 1,
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

    if (dragState.type === "reservation") {
      const reservation = reservations.find((item) => item.id === dragState.id)
      if (!reservation) return

      const { x, y } = toBoardCoords(event.clientX, event.clientY)
      const rawX = x - dragState.offsetX - ROOM_COLUMN_WIDTH
      const rawY = y - dragState.offsetY - 48
      const rowIndex = clamp(
        Math.floor(rawY / ROW_HEIGHT),
        0,
        Math.max(0, rooms.length - 1),
      )
      const snappedDayIndex = clamp(
        Math.round(rawX / SLOT_WIDTH),
        0,
        daysToShow - dragState.duration,
      )

      const nextRoomId = rooms[rowIndex]?.id ?? reservation.roomId
      const newStartDate = new Date(startDate)
      newStartDate.setDate(startDate.getDate() + snappedDayIndex)
      const newStartDateString = newStartDate.toISOString().split('T')[0]

      const currentStartDate = reservation.startDate || reservation.date || reservation.start
      const currentStartDateString = currentStartDate instanceof Date 
        ? currentStartDate.toISOString().split('T')[0] 
        : currentStartDate

      if (currentStartDateString !== newStartDateString || reservation.roomId !== nextRoomId) {
        onReservationChange?.(reservation.id, {
          startDate: newStartDateString,
          date: newStartDateString,
          roomId: nextRoomId,
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
    () => `${ROOM_COLUMN_WIDTH}px repeat(${daysToShow}, ${SLOT_WIDTH}px)`,
    [daysToShow],
  )

  const gridTemplateRows = useMemo(
    () => `48px repeat(${rooms.length}, ${ROW_HEIGHT}px)`,
    [rooms.length],
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
                  {/* Prima coloană - Header pentru camere */}
                  <div className="relative">
                    <div
                      ref={roomsHeaderRef}
                      className="mb-9 flex items-center justify-between rounded-lg border-2 border-dashed border-border/80 bg-white shadow-sm px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground"
                    >
                      <span>Camere</span>
                      <Bed className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Header row - Timeline cu zile */}
                  <div className="relative" style={{ gridColumn: `2 / -1` }}>
                    <div
                      ref={timelineHeaderRef}
                      className="relative rounded-lg border-2 border-dashed border-border/80 bg-white"
                      style={{ width: boardWidth, height: "100%" }}
                    >
                      {days.map((dayInfo, index) => {
                        const left = index * SLOT_WIDTH
                        const isWeekend = dayInfo.dayName === "Sâmbătă" || dayInfo.dayName === "Duminică"
                        return (
                          <div
                            key={`day-${index}`}
                            className={cn(
                              "absolute top-0 bottom-0 border-l border-border/50",
                              isWeekend && "bg-muted/30",
                            )}
                            style={{ left }}
                          >
                            <div className="absolute -top-9 left-0 w-full flex flex-col items-center">
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {dayInfo.dayName}
                              </span>
                              <span className="text-[11px] font-bold text-foreground">
                                {dayInfo.day}/{dayInfo.month}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Room rows */}
                  {rooms.map((room, roomIndex) => {
                    const rowReservations = reservationsByRoom[room.id] ?? []

                    return (
                      <div key={`room-row-${room.id}`} style={{ display: 'contents' }}>
                        {/* Coloana camerei */}
                        <div className="relative">
                          <div
                            ref={(el) => {
                              if (el) roomCardRefs.current[room.id] = el
                            }}
                            className="flex flex-col gap-1 rounded-lg border-2 border-border/80 bg-white px-3 py-2 shadow-md h-full"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-foreground">
                                  Camera {room.number}
                                </span>
                              </div>
                              <span className={cn(
                                "h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm",
                                room.status === "disponibilă" ? "bg-emerald-500" :
                                room.status === "ocupată" ? "bg-red-500" :
                                "bg-amber-500"
                              )} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {room.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Etaj {room.floor}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Coloana cu rezervări */}
                        <div
                          ref={(el) => {
                            if (el) roomColumnRefs.current[room.id] = el
                          }}
                          className={cn(
                            "relative rounded-lg border-2 border-border/70 bg-white transition",
                            draggingReservationId && rowReservations.some((item) => item.id === draggingReservationId)
                              ? "ring-2 ring-primary/40 border-primary/60"
                              : "hover:border-primary/50"
                          )}
                          style={{ 
                            gridColumn: `2 / -1`,
                            height: ROW_HEIGHT 
                          }}
                        >

                          {rowReservations.map((reservation) => {
                            const reservationStartDate = reservation.startDate || reservation.date || reservation.start
                            const dayIndex = getDayIndex(reservationStartDate)
                            const duration = reservation.duration || reservation.durationDays || 1
                            
                            if (dayIndex < 0 || dayIndex >= daysToShow) return null
                            
                            const left = dayIndex * SLOT_WIDTH
                            const width = duration * SLOT_WIDTH - 12
                            const nextStatusStyle = statusStyles[reservation.status] ?? "bg-muted text-foreground"
                            const isShortDuration = duration <= 1

                            const startDate = new Date(reservationStartDate)
                            const endDate = new Date(startDate)
                            endDate.setDate(startDate.getDate() + duration)

                            return (
                              <Tooltip key={reservation.id} delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div
                                    data-reservation-id={reservation.id}
                                    className={cn(
                                      "absolute z-10 flex h-full min-w-[100px] flex-col rounded-lg border-2 border-border/80 bg-white shadow-md transition-all overflow-hidden",
                                      isShortDuration ? "gap-1 px-2 py-1.5" : "gap-2 px-3 py-2",
                                      draggingReservationId === reservation.id
                                        ? "ring-2 ring-primary/60 shadow-xl border-primary"
                                        : "hover:shadow-lg hover:border-primary/60",
                                    )}
                                    style={{ left, width }}
                                  >
                                    <div className={cn(
                                      "flex items-center justify-between font-medium text-muted-foreground",
                                      isShortDuration ? "text-[10px] leading-tight" : "text-xs"
                                    )}>
                                      <span>{`${startDate.getDate()}/${startDate.getMonth() + 1} – ${endDate.getDate()}/${endDate.getMonth() + 1}`}</span>
                                      <span className={cn(
                                        "rounded-full px-1.5 py-0.5 font-semibold uppercase shrink-0",
                                        isShortDuration ? "text-[9px]" : "text-[10px] px-2",
                                        nextStatusStyle
                                      )}>
                                        {reservation.status}
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
                                        {reservation.guest
                                          ?.split(" ")
                                          .map((part) => part[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase() || "GU"}
                                      </span>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className={cn(
                                          "font-semibold leading-tight text-foreground truncate",
                                          isShortDuration ? "text-xs" : "text-sm"
                                        )}>
                                          {reservation.guest || "Rezervare"}
                                        </span>
                                        {reservation.roomId && (() => {
                                          const room = rooms.find(r => r.id === reservation.roomId)
                                          return room && (
                                            <span className={cn(
                                              "text-muted-foreground truncate",
                                              isShortDuration ? "text-[10px] leading-tight" : "text-xs"
                                            )}>
                                              Camera {room.number}
                                            </span>
                                          )
                                        })()}
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

export default HotelWhiteboard

