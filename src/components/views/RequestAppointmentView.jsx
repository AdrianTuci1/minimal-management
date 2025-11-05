import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Calendar } from "../ui/calendar"

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to={`/workspace/${workspaceId}/public`}>
              <Button variant="ghost" className="mb-4">
                ← Înapoi
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Solicită o programare
            </h1>
            <p className="text-muted-foreground">
              Completează formularul de mai jos pentru a solicita o programare la {workspace.name}
            </p>
          </div>

          {/* Formular */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Detalii programare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nume complet</label>
                  <Input placeholder="Introduceți numele complet" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Telefon</label>
                  <Input type="tel" placeholder="+40 123 456 789" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="email@example.com" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Selectați data</label>
                <Calendar
                  mode="single"
                  className="rounded-md border"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Observații</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Adăugați orice informații relevante..."
                />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1" size="lg">
                  Trimite solicitarea
                </Button>
                <Link to={`/workspace/${workspaceId}/public`}>
                  <Button variant="outline" size="lg">
                    Anulează
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RequestAppointmentView

