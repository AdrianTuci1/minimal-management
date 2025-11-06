import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { FitnessClientArea, HotelClientArea, ClinicClientArea } from "../client-areas"

function ClientAreaView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { workspaces, currentUser } = useWorkspaceStore()
  
  const [clientData, setClientData] = useState(null)

  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  useEffect(() => {
    // Încarcă datele clientului pentru acest workspace
    try {
      const clients = JSON.parse(localStorage.getItem('subscriptionClients') || '{}')
      
      // Găsește clientul asociat cu workspace-ul curent și email-ul utilizatorului
      const clientEntry = Object.values(clients).find(client => {
        const matchesWorkspace = client.workspaceId === workspaceId
        const matchesEmail = currentUser.email && client.formData?.email === currentUser.email
        
        return matchesWorkspace && matchesEmail
      })

      if (clientEntry) {
        setClientData(clientEntry)
      }
    } catch (error) {
      console.error('Error loading client data:', error)
    }
  }, [workspaceId, currentUser.email])

  if (!workspace || !workspaceConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-xl">Eroare</CardTitle>
            <CardDescription>Workspace-ul nu a fost găsit</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi la servicii
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const subscription = clientData?.subscription

  // Render componentele specifice pentru tipul de workspace
  const renderClientArea = () => {
    const commonProps = {
      workspace,
      workspaceConfig,
      clientData,
      subscription,
    }

    switch (workspaceConfig.id) {
      case "fitness":
        return <FitnessClientArea {...commonProps} />
      case "hotel":
        return <HotelClientArea {...commonProps} />
      case "clinic":
        return <ClinicClientArea {...commonProps} />
      default:
        return <ClinicClientArea {...commonProps} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderClientArea()}
      </div>
    </div>
  )
}

export default ClientAreaView

