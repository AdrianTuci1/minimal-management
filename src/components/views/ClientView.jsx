import { useMemo } from "react"
import { useParams } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"

function ClientView() {
  const { workspaceId } = useParams()
  const { workspaces } = useWorkspaceStore()
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  if (!workspace) {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">{workspace.name}</h1>
            <p className="text-muted-foreground">Pagina client pentru workspace-ul tău</p>
          </div>

          {/* Content */}
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground">
              Această este pagina publică pentru clientul workspace-ului <strong>{workspace.name}</strong>.
            </p>
            <p className="text-muted-foreground mt-4">
              Aici poți adăuga informații despre serviciile oferite, programări, contact, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientView

