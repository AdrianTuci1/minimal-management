import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, MapPin, Phone, Mail, CalendarDays, Package, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

function ClinicClientArea({ workspace, workspaceConfig, clientData, subscription }) {
  const navigate = useNavigate()
  
  const address = workspace.address || "Strada Exemplu nr. 123, București"
  const email = workspace.email || "contact@example.com"
  const phone = workspace.phone || "+40 123 456 789"

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
      <Card>
        <CardHeader>
          <CardTitle>Programările mele</CardTitle>
          <CardDescription>Vezi programările tale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Funcționalitatea va fi disponibilă în curând
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate(`/workspace/${workspace.id}/public/request-appointment`)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Programează o consultație
            </Button>
          </div>
        </CardContent>
      </Card>

    </>
  )
}

export default ClinicClientArea

