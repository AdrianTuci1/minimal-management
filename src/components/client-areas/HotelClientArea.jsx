import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, Mail, CalendarDays, Package, Bed } from "lucide-react"
import { useNavigate } from "react-router-dom"
import GanttChart from "@/components/GanttChart"
import { hotelReservationsData } from "@/config/demoGanttData"

function HotelClientArea({ workspace, workspaceConfig, clientData, subscription }) {
  const navigate = useNavigate()
  
  const address = workspace.address || "Strada Exemplu nr. 123, București"
  const email = workspace.email || "contact@example.com"
  const phone = workspace.phone || "+40 123 456 789"

  // Generate reservations data with current dates
  const reservationsData = useMemo(() => {
    return hotelReservationsData
  }, [])

  return (
    <>
      {/* Subscription Card */}
      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Serviciile mele</CardTitle>
                <CardDescription>
                  {subscription.name || "Serviciu activ"}
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
          <CardTitle>Informații hotel</CardTitle>
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

      {/* Rezervări */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Rezervările mele</h2>
            <p className="text-sm text-muted-foreground">Vezi și gestionează rezervările tale</p>
          </div>
          <Button 
            variant="default"
            onClick={() => navigate(`/workspace/${workspace.id}/public/book-reservation`)}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Rezervă
          </Button>
        </div>
        <div className="w-full h-[calc(100vh-400px)] min-h-[600px] overflow-hidden rounded-lg border border-border shadow-sm">
          <GanttChart data={reservationsData} />
        </div>
      </div>

    </>
  )
}

export default HotelClientArea

