import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

function PublicServicesView() {
  const { workspaceId } = useParams()
  const { workspaces } = useWorkspaceStore()
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

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

  // Servicii demo - în viitor vor fi din store/API
  const services = [
    {
      id: "1",
      name: "Serviciu exemplu 1",
      description: "Descriere serviciu",
      price: "100 RON",
      duration: "30 min",
    },
    {
      id: "2",
      name: "Serviciu exemplu 2",
      description: "Descriere serviciu",
      price: "200 RON",
      duration: "60 min",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to={`/workspace/${workspaceId}/public`}>
              <Button variant="ghost" className="mb-4">
                ← Înapoi
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {workspaceConfig.labels.treatments || "Servicii"}
            </h1>
            <p className="text-muted-foreground">
              Explorează serviciile oferite de {workspace.name}
            </p>
          </div>

          {/* Lista servicii */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="border border-border">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Durată: {service.duration}</p>
                      <p className="text-lg font-semibold text-foreground">{service.price}</p>
                    </div>
                    <Button size="sm">Rezervă</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <Card className="border border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nu sunt disponibile servicii momentan.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicServicesView

