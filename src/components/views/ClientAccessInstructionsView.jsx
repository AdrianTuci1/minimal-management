import { useMemo, useState, useEffect } from "react"
import { useParams, Link, useLocation, useNavigate } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft, Link2, Download, Smartphone, CheckCircle2, ExternalLink, Copy } from "lucide-react"

function ClientAccessInstructionsView() {
  const { workspaceId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaces } = useWorkspaceStore()
  
  const subscription = location.state?.subscription || null
  const token = location.state?.token || null
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  // Normalize workspace type
  const normalizedWorkspaceType = workspaceConfig?.id || workspace?.type
  const isFitness = normalizedWorkspaceType === "fitness"

  // Detect if user is on mobile
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }, [])

  // PWA install detection
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
  }

  const [copied, setCopied] = useState(false)

  const shortcutUrl = useMemo(() => {
    if (token) {
      return `${window.location.origin}/workspace/${workspaceId}/public/client-access/${token}`
    }
    return null
  }, [token, workspaceId])

  const handleCopyLink = async () => {
    if (!shortcutUrl) return
    
    try {
      await navigator.clipboard.writeText(shortcutUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleOpenLink = () => {
    if (shortcutUrl) {
      window.open(shortcutUrl, '_blank')
    }
  }

  // Dacă nu există token, redirect către pagina de confirmare
  useEffect(() => {
    if (!token && subscription) {
      // Dacă nu avem token dar avem subscription, înseamnă că venim direct de la payment
      // Ar trebui să fie redirectat la confirm-subscription, dar dacă ajungem aici
      // înseamnă că trebuie să generăm token-ul sau să redirectăm
      // Pentru moment, lăsăm utilizatorul să vadă instrucțiunile
    }
  }, [token, subscription])

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

  // Dacă nu avem token sau subscription, redirect
  if (!token && !subscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Date lipsă</h1>
          <p className="text-muted-foreground mb-4">
            Nu există informații despre abonament. Te rugăm să completezi procesul de plată.
          </p>
          <Link to={`/workspace/${workspaceId}/public/become-client`}>
            <Button>Înapoi la abonamente</Button>
          </Link>
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
            <Link to={`/workspace/${workspaceId}/public/subscription-payment`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                Accesează abonamentul tău
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">

          {/* Subscription Summary */}
          {subscription && (
            <Card className="border border-border mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {subscription.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {subscription.price.toLocaleString("ro-RO")} RON
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Options */}
          <div className="space-y-4">
            {/* Option 1: Add to Shortcuts (PWA) */}
            {shortcutUrl ? (
              <Card className="border border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Link2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Adaugă la scurtături</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Folosește link-ul de mai jos pentru a crea o scurtătură
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                      <code className="flex-1 text-sm text-foreground break-all">
                        {shortcutUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        className="shrink-0"
                      >
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleCopyLink}
                        className="flex-1"
                        variant="outline"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? "Copiat!" : "Copiază link"}
                      </Button>
                      <Button 
                        onClick={handleOpenLink}
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Deschide link
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Instrucțiuni:</strong>
                      </p>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Deschide link-ul de mai sus în browser</li>
                        <li>Apasă pe meniul browser-ului (⋮ sau ☰)</li>
                        <li>Selectează "Adaugă la ecranul de start" sau "Instalează aplicația"</li>
                        <li>Odată adăugat, vei putea accesa abonamentul direct</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Pentru a obține link-ul de scurtătură, completează procesul de plată.
                  </p>
                  <Link to={`/workspace/${workspaceId}/public/become-client`}>
                    <Button>Înapoi la abonamente</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Option 2: Install App (PWA) */}
            {isInstallable && (
              <Card className="border border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Instalează aplicația</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Descarcă aplicația pe dispozitivul tău
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Experiență nativă</p>
                        <p className="text-xs text-muted-foreground">
                          Funcționează ca o aplicație normală pe telefon
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Acces offline</p>
                        <p className="text-xs text-muted-foreground">
                          Unele funcții disponibile fără internet
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleInstallApp}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Instalează aplicația
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Option 3: Mobile Instructions (if not installable) */}
            {isMobile && !isInstallable && (
              <Card className="border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Smartphone className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>Instrucțiuni pentru dispozitiv mobil</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Urmează pașii pentru a adăuga aplicația pe ecranul de start
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                        1
                      </div>
                      <p className="text-sm text-foreground">
                        Apasă pe butonul "Share" sau meniul browser-ului
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                        2
                      </div>
                      <p className="text-sm text-foreground">
                        Selectează "Adaugă la ecranul de start" sau "Add to Home Screen"
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                        3
                      </div>
                      <p className="text-sm text-foreground">
                        Confirmă și aplicația va apărea pe ecranul tău de start
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Option 4: Direct Link */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <ExternalLink className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle>Acces direct</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sau accesează direct pagina abonamentului
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={`/workspace/${workspaceId}/public`}>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Accesează acum
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Success Message */}
          <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Abonamentul tău a fost înregistrat!
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Odată ce adaugi aplicația la scurtături sau o instalezi, vei putea accesa abonamentul tău oricând.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClientAccessInstructionsView

