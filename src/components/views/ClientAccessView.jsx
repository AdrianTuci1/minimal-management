import { useEffect, useMemo, useSyncExternalStore } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ClientAccessController } from "../../models/ClientAccessController"

function ClientAccessView() {
  const { workspaceId, clientId } = useParams()
  const navigate = useNavigate()
  
  // Initialize controller
  const controller = useMemo(() => {
    return new ClientAccessController(workspaceId, clientId, navigate);
  }, [workspaceId, clientId, navigate]);

  // Sync state from controller
  const loading = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.loading
  )
  const error = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.error
  )

  useEffect(() => {
    controller.handleClientAccess();
  }, [controller]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Se verifică accesul...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Eroare</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    )
  }

  return null
}

export default ClientAccessView
