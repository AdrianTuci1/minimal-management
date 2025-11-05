import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, ExternalLink, Calendar, Clock } from "lucide-react"
import useWorkspaceStore from "../../../store/workspaceStore"

function ServicesView() {
  const navigate = useNavigate()
  const { currentUser, workspaces } = useWorkspaceStore()

  // Obține serviciile asociate utilizatorului din localStorage (abonamente)
  const userServices = useMemo(() => {
    try {
      // Obține sesiunea clientului
      const sessionData = localStorage.getItem('clientSession')
      if (!sessionData) return []

      const session = JSON.parse(sessionData)
      
      // Obține toți clienții din localStorage
      const clients = JSON.parse(localStorage.getItem('subscriptionClients') || '{}')
      
      // Filtrează clienții care aparțin utilizatorului curent
      const userClients = Object.values(clients).filter(client => {
        // Verifică dacă clientul este asociat cu email-ul utilizatorului sau cu sesiunea
        return client.formData?.email === currentUser.email || 
               client.formData?.email === session.email ||
               session.clientId === client.clientId
      })

      // Extrage serviciile din abonamentele utilizatorului
      const services = []
      userClients.forEach(client => {
        if (client.subscription) {
          services.push({
            id: client.clientId,
            name: client.subscription.name || 'Abonament',
            description: client.subscription.description || `${client.subscription.duration} - ${client.subscription.price} RON`,
            price: client.subscription.price,
            duration: client.subscription.duration,
            workspaceId: client.workspaceId,
            confirmed: client.confirmed,
            createdAt: client.createdAt,
            confirmedAt: client.confirmedAt,
          })
        }
      })

      return services
    } catch (error) {
      console.error('Error loading user services:', error)
      return []
    }
  }, [currentUser.email])

  const handleViewWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Servicii</h1>
        <p className="text-muted-foreground mt-2">
          Serviciile și abonamentele tale active
        </p>
      </div>

      {userServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nu ai servicii active</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Abonamentele și serviciile tale vor apărea aici când te vei înregistra pentru un abonament.
            </p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Explorează servicii
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userServices.map((service) => {
            const workspace = workspaces.find(ws => ws.id === service.workspaceId)
            
            return (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </div>
                    {service.confirmed ? (
                      <Badge variant="default" className="ml-2">
                        Activ
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2">
                        Neconfirmat
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="font-semibold text-foreground">
                      {service.price?.toLocaleString("ro-RO")} RON
                    </div>
                  </div>

                  {workspace && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="truncate">{workspace.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleViewWorkspace(service.workspaceId)}
                        >
                          Deschide
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {service.confirmedAt && (
                    <div className="pt-2 text-xs text-muted-foreground">
                      Confirmat pe {new Date(service.confirmedAt).toLocaleDateString("ro-RO")}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ServicesView

