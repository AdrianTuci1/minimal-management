import { useMemo, useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArrowLeft, ArrowRight, Calendar, Users, Dumbbell, Heart, TrendingUp, Star } from "lucide-react"

// Mock subscription/packages data pentru fitness
const mockSubscriptions = [
  {
    id: "standard",
    name: "Abonament Standard",
    description: "Acces nelimitat la sală, inclusiv toate zonele de antrenament și echipamentele.",
    price: 250,
    duration: "1 lună",
    features: ["Acces nelimitat", "Toate echipamentele", "Consultatii antrenori", "Program grup"],
    popular: false,
    available: true,
  },
  {
    id: "premium",
    name: "Abonament Premium",
    description: "Tot ce include Standard, plus antrenament personal și consultații nutriționale.",
    price: 450,
    duration: "1 lună",
    features: ["Tot din Standard", "Antrenament personal", "Consultatii nutriție", "Prioritate programare"],
    popular: true,
    available: true,
  },
  {
    id: "personal",
    name: "Pachet Antrenament Personal",
    description: "10 ședințe de antrenament personal cu un antrenor dedicat.",
    price: 1200,
    duration: "10 ședințe",
    features: ["10 ședințe personalizate", "Plan de antrenament", "Suport nutrițional", "Flexibilitate programare"],
    popular: false,
    available: true,
  },
  {
    id: "nutrition",
    name: "Consult Nutriție",
    description: "Consultație individuală cu nutriționist pentru plan alimentar personalizat.",
    price: 300,
    duration: "1 consultație",
    features: ["Plan alimentar", "Evaluare corp", "Consultatii follow-up", "Suport online"],
    popular: false,
    available: true,
  },
]

function BecomeClientView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { workspaces } = useWorkspaceStore()
  
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  // Normalize workspace type
  const normalizedWorkspaceType = workspaceConfig?.id || workspace?.type

  // Check if fitness workspace
  const isFitness = normalizedWorkspaceType === "fitness"

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

  // If not fitness, show old form (for backward compatibility)
  if (!isFitness) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link to={`/workspace/${workspaceId}/public`}>
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Înapoi
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Devin-o client
              </h1>
              <p className="text-muted-foreground">
                Completează formularul de mai jos pentru a deveni client la {workspace.name}
              </p>
            </div>

            {/* Formular */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Informații personale</CardTitle>
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
                  <label className="text-sm font-medium mb-2 block">Data nașterii</label>
                  <Input type="date" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Obiective</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Descrieți obiectivele dvs. de fitness..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" size="lg">
                    Devin client
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
            <Link to={`/workspace/${workspaceId}/public`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                Devin-o client
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Alege abonamentul potrivit pentru tine
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section - Subscriptions List */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {mockSubscriptions.map((subscription) => {
              const isSelected = selectedSubscription?.id === subscription.id

              return (
                <Card 
                  key={subscription.id} 
                  className={`
                    border rounded-none cursor-pointer transition-all
                    ${isSelected 
                      ? "border-primary ring-2 ring-primary/20 shadow-md" 
                      : "border-border hover:border-primary/50"
                    }
                    ${subscription.popular ? "relative" : ""}
                  `}
                  onClick={() => setSelectedSubscription(subscription)}
                >
                  {subscription.popular && (
                    <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </div>
                  )}
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* Subscription Icon/Image Placeholder */}
                      <div className="w-full md:w-48 h-48 md:h-32 bg-muted rounded-none flex items-center justify-center shrink-0">
                        <Dumbbell className="h-8 w-8 text-muted-foreground" />
                      </div>

                      {/* Subscription Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                              {subscription.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {subscription.description}
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <div className="text-xl md:text-2xl font-bold text-foreground">
                              {subscription.price} RON
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {subscription.duration}
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          {subscription.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <TrendingUp className="h-4 w-4" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {subscription.features.length > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{subscription.features.length - 3} mai multe
                            </span>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        <div className="flex items-center gap-2">
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${isSelected 
                              ? "border-primary bg-primary" 
                              : "border-border"
                            }
                          `}>
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {isSelected ? "Selectat" : "Selectează"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
            <div className="flex-1 min-w-0">
              {selectedSubscription ? (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1">
                    Abonament selectat
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
                    {selectedSubscription.price.toLocaleString("ro-RO")} RON
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedSubscription.duration}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Selectează un abonament pentru a continua
                  </div>
                </div>
              )}
            </div>
            <Button
              size="lg"
              className="shrink-0 px-4 sm:px-8 min-w-[140px] sm:min-w-[180px]"
              disabled={!selectedSubscription}
              onClick={() => {
                if (selectedSubscription) {
                  navigate(`/workspace/${workspaceId}/public/subscription-payment`, {
                    state: {
                      subscription: selectedSubscription,
                    }
                  })
                }
              }}
            >
              <span className="hidden sm:inline">Continuă</span>
              <span className="sm:hidden">Continuă</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BecomeClientView
