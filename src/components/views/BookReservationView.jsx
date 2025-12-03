import { useMemo, useEffect, useSyncExternalStore } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon, Bed, Users, Wifi, Coffee, ArrowRight, ArrowLeft, Tv, Wind, Bath, Home, Car, UtensilsCrossed, Waves, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { BookReservationController } from "../../models/BookReservationController"

function BookReservationView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { workspaces } = useWorkspaceStore()
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  // Initialize controller
  const controller = useMemo(() => {
    if (!workspace || !workspaceConfig) return null;
    return new BookReservationController(workspace, workspaceConfig);
  }, [workspace, workspaceConfig]);

  // Sync state from controller
  const checkIn = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.checkIn || null
  )
  const checkOut = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.checkOut || null
  )
  const selectedRooms = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.selectedRooms || {}
  )
  const isMobile = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.isMobile || false
  )
  const nights = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.nights || 0
  )
  const total = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.total || 0
  )
  const hasSelectedRooms = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.hasSelectedRooms || false
  )
  const buttonText = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.buttonText || "Detalii si plata"
  )

  // Get room types from controller
  const roomTypes = controller?.roomTypes || []

  useEffect(() => {
    if (!controller) return;
    
    const checkMobile = () => {
      controller.setMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [controller])

  if (!workspace || !workspaceConfig || !controller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Workspace-ul nu a fost găsit</h1>
          <p className="text-muted-foreground">Workspace-ul cu ID-ul {workspaceId} nu există.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
            <Link to={`/workspace/${workspaceId}/public`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Check-in Date Picker */}
              <div className="flex-1 min-w-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className={cn(
                      "relative flex h-9 w-full rounded-none border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      "flex flex-col justify-center items-start"
                    )}>
                      <div className="flex items-center justify-between w-full pr-8 sm:pr-10">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-medium text-muted-foreground leading-tight">Check-in</span>
                          {checkIn ? (
                            <span className="text-xs sm:text-sm text-foreground leading-tight truncate">
                              {format(checkIn, "dd MMM yyyy", { locale: ro })}
                            </span>
                          ) : (
                            <span className="text-xs sm:text-sm text-muted-foreground leading-tight">Selectează data</span>
                          )}
                        </div>
                        <CalendarIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none shrink-0" />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => controller.setCheckIn(date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date Picker */}
              <div className="flex-1 min-w-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className={cn(
                      "relative flex h-9 w-full rounded-none border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      "flex flex-col justify-center items-start",
                      !checkIn && "opacity-50"
                    )}>
                      <div className="flex items-center justify-between w-full pr-8 sm:pr-10">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-medium text-muted-foreground leading-tight">Check-out</span>
                          {checkOut ? (
                            <span className="text-xs sm:text-sm text-foreground leading-tight truncate">
                              {format(checkOut, "dd MMM yyyy", { locale: ro })}
                            </span>
                          ) : (
                            <span className="text-xs sm:text-sm text-muted-foreground leading-tight">Selectează data</span>
                          )}
                        </div>
                        <CalendarIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none shrink-0" />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => controller.setCheckOut(date)}
                      disabled={(date) => 
                        !checkIn || date <= checkIn || date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Middle Section - Room Types List */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto">

          {nights === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Selectează o perioadă validă
              </p>
              <p className="text-muted-foreground">
                Check-out trebuie să fie după check-in
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {roomTypes.map((roomType) => {
                const quantity = selectedRooms[roomType.id] || 0
                const isAvailable = roomType.available > 0

                return (
                  <Card key={roomType.id} className="border border-border rounded-none">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Room Image Placeholder */}
                        <div
                          className="relative w-full md:w-64 bg-muted rounded-none overflow-hidden shrink-0"
                          style={{ aspectRatio: "4 / 3" }}
                        >
                          <img src={roomType.image} alt={roomType.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>

                        {/* Room Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                                {roomType.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {roomType.description}
                              </p>
                            </div>
                            <div className="text-left md:text-right">
                              <div className="text-xl md:text-2xl font-bold text-foreground">
                                {roomType.price} RON
                              </div>
                              <div className="text-sm text-muted-foreground">
                                pe noapte
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{roomType.capacity} persoane</span>
                            </div>
                            {roomType.amenities.slice(0, 3).map((amenity, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                {amenity === "WiFi" && <Wifi className="h-4 w-4" />}
                                {amenity === "Minibar" && <Coffee className="h-4 w-4" />}
                                <span>{amenity}</span>
                              </div>
                            ))}
                            {roomType.amenities.length > 3 && (
                              <span className="text-sm text-muted-foreground">
                                +{roomType.amenities.length - 3} mai multe
                              </span>
                            )}
                          </div>

                          {/* Availability and Quantity Selector */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                              {isAvailable ? (
                                <span className="text-emerald-600 font-medium">
                                  {roomType.available} {roomType.available === 1 ? "unitate disponibilă" : "unitati disponibile"}
                                </span>
                              ) : (
                                <span className="text-red-600 font-medium">
                                  Nu sunt disponibile
                                </span>
                              )}
                            </div>

                            {isAvailable && (
                              <div className="flex items-center gap-3 w-fit">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => controller.handleRoomQuantityChange(roomType.id, -1)}
                                  disabled={quantity === 0}
                                  className="h-9 w-9 rounded-none"
                                >
                                  <span className="text-lg">−</span>
                                </Button>
                                <span className="w-12 text-center font-semibold text-foreground">
                                  {quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => controller.handleRoomQuantityChange(roomType.id, 1)}
                                  disabled={quantity >= roomType.available}
                                  className="h-9 w-9 rounded-none"
                                >
                                  <span className="text-lg">+</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
            <div className="flex-1 min-w-0">
              {hasSelectedRooms && nights > 0 ? (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1">
                    Total pentru {nights} {nights === 1 ? "noapte" : "nopți"}
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
                    {total.toLocaleString("ro-RO")} RON
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Selectează camere pentru a vedea totalul
                  </div>
                </div>
              )}
            </div>
            <Button
              size="lg"
              className="shrink-0 px-4 sm:px-8 min-w-[140px] sm:min-w-[180px]"
              disabled={!hasSelectedRooms || !checkIn || !checkOut}
              onClick={() => {
                if (hasSelectedRooms) {
                  const reservationData = controller.submitReservation();
                  if (reservationData) {
                    navigate(`/workspace/${workspaceId}/public/payment-details`, {
                      state: reservationData
                    })
                  }
                }
              }}
            >
              <span className="hidden sm:inline">{buttonText}</span>
              <span className="sm:hidden">Continuă</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BookReservationView
