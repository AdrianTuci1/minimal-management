import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, Mail, CalendarDays, Package, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Calendar from "@/components/Calendar"
import { clinicAppointmentsData } from "@/config/demoCalendarData"
import useAppStore from "@/store/appStore"

function ClinicClientArea({ workspace, workspaceConfig, clientData, subscription }) {
  const navigate = useNavigate()
  const { selectedDate, calendarView } = useAppStore()
  
  const address = workspace.address || "Strada Exemplu nr. 123, București"
  const email = workspace.email || "contact@example.com"
  const phone = workspace.phone || "+40 123 456 789"

  // Generate appointments data with current dates
  const appointmentsData = useMemo(() => {
    return clinicAppointmentsData
  }, [])

  const handleEventClick = (event) => {
    console.log('Appointment clicked:', event)
    // TODO: Open appointment details
  }

  const handleEventCreate = (date, hour) => {
    console.log('Create appointment at:', date, hour)
    // TODO: Open create appointment form
    navigate(`/workspace/${workspace.id}/public/request-appointment`)
  }

  return (
    <>
      {/* Subscription Card */}
      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Abonamentul meu</CardTitle>
                <CardDescription>
                  {subscription.name || "Abonament activ"}
                </CardDescription>
              </div>
              {clientData?.confirmed ? (
                <Badge variant="default">Activ</Badge>
              ) : (
                <Badge variant="outline">Neconfirmat</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription.description && (
              <p className="text-sm text-muted-foreground">
                {subscription.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Durată</div>
                <div className="font-semibold">{subscription.duration}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Preț</div>
                <div className="font-semibold">
                  {subscription.price?.toLocaleString("ro-RO")} RON
                </div>
              </div>
            </div>
            {clientData?.confirmedAt && (
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Confirmat pe {new Date(clientData.confirmedAt).toLocaleDateString("ro-RO")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Workspace Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informații clinică</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">{workspace.name}</div>
              <div className="text-sm text-muted-foreground">{address}</div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2">
              <img 
                src="/ro_flag.webp" 
                alt="România" 
                className="w-4 h-3 object-contain"
              />
              <span className="text-sm">{phone}</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
            <span className="text-sm">{email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Programări */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Programările mele</h2>
            <p className="text-sm text-muted-foreground">Vezi și gestionează programările tale</p>
          </div>
          <Button 
            variant="default"
            onClick={() => navigate(`/workspace/${workspace.id}/public/request-appointment`)}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Programează
          </Button>
        </div>
        <div className="w-full h-[calc(100vh-400px)] min-h-[600px] overflow-hidden rounded-lg border border-border shadow-sm bg-white">
          <Calendar
            events={appointmentsData}
            currentView={calendarView}
            currentDate={selectedDate}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
          />
        </div>
      </div>

    </>
  )
}

export default ClinicClientArea

