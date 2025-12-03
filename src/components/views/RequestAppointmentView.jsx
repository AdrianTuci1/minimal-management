import { useMemo, useSyncExternalStore } from "react"
import { useParams, Link } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { getDemoTreatments } from "../../config/demoData"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { MiniCalendar } from "../ui/mini-calendar"
import { ArrowLeft, ArrowRight, Check, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { RequestAppointmentController } from "../../models/RequestAppointmentController"

function RequestAppointmentView() {
  const { workspaceId } = useParams()
  const { workspaces } = useWorkspaceStore()

  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  // Initialize Controller
  const controller = useMemo(() => new RequestAppointmentController(), [])

  // Sync state from controller
  const currentStep = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.currentStep
  )
  const selectedService = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.selectedService
  )
  const isCustomService = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.isCustomService
  )
  const selectedDate = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.selectedDate
  )
  const selectedTime = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.selectedTime
  )
  const formData = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.formData
  )

  // Get available services/treatments
  const services = useMemo(() => {
    if (!workspace) return []
    return getDemoTreatments(workspace.type).filter(s => s.status === "Disponibil" || s.status === "Promovat")
  }, [workspace])

  const timeSlots = useMemo(() => controller.generateTimeSlots(), [controller])

  const availableSlots = useMemo(() => {
    if (!selectedDate) return []
    return timeSlots.filter(slot => controller.isSlotAvailable(selectedDate, slot.timeInMinutes))
  }, [selectedDate, timeSlots, controller])

  const handleServiceSelect = (service) => {
    controller.selectService(service)
  }

  const handleCustomServiceToggle = () => {
    controller.toggleCustomService()
  }

  const handleContinueToDateTime = () => {
    const hasService = selectedService || isCustomService
    if (hasService) {
      controller.setStep(2)
    }
  }

  const handleContinueToContact = () => {
    if (selectedDate && selectedTime) {
      controller.setStep(3)
    }
  }

  const handleBackToService = () => {
    controller.setStep(1)
  }

  const handleBackToDateTime = () => {
    controller.setStep(2)
  }

  const handleDateSelect = (date) => {
    controller.selectDate(date)
  }

  const handleTimeSelect = (timeInMinutes) => {
    controller.selectTime(timeInMinutes)
  }

  const handleInputChange = (field, value) => {
    controller.updateFormData(field, value)
  }

  const handleSubmit = () => {
    controller.submitRequest()
  }

  if (!workspace || !workspaceConfig) {
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
            <Link to={`/workspace/${workspaceId}/public`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                Solicită o programare
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {workspace.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-32", currentStep === 2 ? "overflow-hidden" : "overflow-auto")}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>

              {services.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {services.map((service) => (
                    <Card
                      key={service.code}
                      className={cn(
                        "border border-border rounded-none cursor-pointer transition-colors",
                        selectedService?.code === service.code
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-base font-semibold text-foreground">
                                {service.name}
                              </h3>
                              {selectedService?.code === service.code && (
                                <Check className="h-4 w-4 text-primary shrink-0" />
                              )}
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{service.duration}</span>
                              </div>
                              {service.price && (
                                <div className="flex items-center gap-1.5">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  <span>{service.price}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Custom Service Option */}
              <Card
                className={cn(
                  "border border-border rounded-none cursor-pointer transition-colors",
                  isCustomService
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                )}
                onClick={handleCustomServiceToggle}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-semibold text-foreground">
                          Altceva - nu se află în listă
                        </h3>
                        {isCustomService && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Descrieți problema sau serviciul dorit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-0 -mx-4 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
              <div className="shrink-0">
                <MiniCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  disabledDates={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="flex-1 min-h-0 flex flex-col">
                  {availableSlots.length > 0 ? (
                    <div className="border-t-0 border border-border rounded-none overflow-hidden flex-1 flex flex-col">
                      <ScrollArea className="flex-1">
                        <div className="flex flex-col gap-2 p-2">
                          {availableSlots.map((slot) => {
                            const isSelected = selectedTime === slot.timeInMinutes
                            return (
                              <Button
                                key={slot.timeInMinutes}
                                variant={isSelected ? "default" : "outline"}
                                className={cn(
                                  "rounded-none h-10 w-full justify-start",
                                  isSelected && "bg-primary text-primary-foreground"
                                )}
                                onClick={() => handleTimeSelect(slot.timeInMinutes)}
                              >
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                {slot.display}
                              </Button>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-t-0 border border-border rounded-none">
                      <p className="text-muted-foreground">
                        Nu sunt disponibile sloturi pentru această dată. Vă rugăm să selectați o altă dată.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Contact Details */}
          {currentStep === 3 && (
            <div>

              {/* Selected Service, Date & Time Summary */}
              <Card className="border border-border rounded-none mb-6 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 space-y-4">
                    {/* Service */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Serviciu selectat
                      </p>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-base font-semibold text-foreground">
                          {selectedService?.name || "Altceva - nu se află în listă"}
                        </p>
                        {selectedService?.price && (
                          <p className="text-base font-semibold text-primary shrink-0">
                            {selectedService.price}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/50" />

                    {/* Date & Time */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Programare selectată
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="text-base font-semibold text-foreground">
                          {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: ro })}
                        </p>
                        <span className="hidden sm:inline text-muted-foreground">•</span>
                        <p className="text-base font-semibold text-foreground">
                          {timeSlots.find(s => s.timeInMinutes === selectedTime)?.display}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Nume complet
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Introduceți numele complet"
                    className="rounded-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+40 123 456 789"
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="email@example.com"
                      className="rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Observații (opțional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="w-full min-h-[100px] rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Adăugați orice informații relevante..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Solicitarea a fost trimisă!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Vă vom contacta în curând pentru a confirma programarea.
                </p>
              </div>

              <div className="border border-border rounded-none p-6 bg-muted/30 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-foreground mb-4">Detalii programare</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Serviciu: </span>
                    <span className="font-medium text-foreground">
                      {selectedService?.name || "Altceva - nu se află în listă"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data și ora: </span>
                    <span className="font-medium text-foreground">
                      {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: ro })}, {timeSlots.find(s => s.timeInMinutes === selectedTime)?.display}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nume: </span>
                    <span className="font-medium text-foreground">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefon: </span>
                    <span className="font-medium text-foreground">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {currentStep === 1 && (
              <>
                <Link to={`/workspace/${workspaceId}/public`}>
                  <Button variant="outline" size="lg" className="rounded-none">
                    Anulează
                  </Button>
                </Link>
                <Button
                  size="lg"
                  className="shrink-0 px-6 md:px-8 rounded-none"
                  disabled={!selectedService && !isCustomService}
                  onClick={handleContinueToDateTime}
                >
                  <span className="hidden sm:inline">Alege data și ora</span>
                  <span className="sm:hidden">Continuă</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none"
                  onClick={handleBackToService}
                >
                  Înapoi
                </Button>
                <Button
                  size="lg"
                  className="shrink-0 px-6 md:px-8 rounded-none"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleContinueToContact}
                >
                  <span className="hidden sm:inline">Detalii de contact</span>
                  <span className="sm:hidden">Continuă</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none"
                  onClick={handleBackToDateTime}
                >
                  Înapoi
                </Button>
                <Button
                  size="lg"
                  className="shrink-0 px-6 md:px-8 rounded-none"
                  disabled={!controller.isFormValid()}
                  onClick={handleSubmit}
                >
                  <span className="hidden sm:inline">Trimite solicitarea</span>
                  <span className="sm:hidden">Trimite</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {currentStep === 4 && (
              <div className="w-full flex justify-center">
                <Link to={`/workspace/${workspaceId}/public`}>
                  <Button size="lg" className="rounded-none px-8">
                    Înapoi la pagina principală
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RequestAppointmentView
