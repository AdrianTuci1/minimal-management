import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getClientData, checkClientAuth } from "../../services/subscriptionService"

function ClientAccessView() {
  const { workspaceId, clientId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleClientAccess = async () => {
      if (!clientId) {
        navigate(`/workspace/${workspaceId}/public?error=missing_client_id`)
        return
      }

      // Verifică datele clientului
      const clientResult = await getClientData(clientId)
      
      if (!clientResult.success) {
        navigate(`/workspace/${workspaceId}/public?error=invalid_client`, {
          state: { error: clientResult.error }
        })
        return
      }

      // Verifică dacă utilizatorul este deja autentificat
      const authResult = await checkClientAuth()
      
      if (authResult.authenticated && authResult.session?.clientId === clientId) {
        // Utilizator autentificat - redirect la dashboard
        navigate(`/workspace/${workspaceId}/client/dashboard`)
      } else {
        // Utilizator neautentificat - redirect la login cu clientId
        navigate(`/workspace/${workspaceId}/client-login`, {
          state: {
            clientId,
            returnTo: `/workspace/${workspaceId}/${clientId}`,
            subscription: clientResult.data.subscription,
          }
        })
      }
      
      setLoading(false)
    }

    handleClientAccess()
  }, [clientId, workspaceId, navigate])

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
