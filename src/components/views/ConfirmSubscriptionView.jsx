import { useMemo, useEffect, useSyncExternalStore } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft, ExternalLink, Download, CheckCircle2 } from "lucide-react"
import { ConfirmSubscriptionController } from "../../models/ConfirmSubscriptionController"

function ConfirmSubscriptionView() {
  const { workspaceId, token } = useParams()
  const location = useLocation()
  const { workspaces } = useWorkspaceStore()
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  // Initialize controller
  const controller = useMemo(() => {
    if (!workspace || !workspaceConfig) return null;
    return new ConfirmSubscriptionController(workspaceId, token, workspace, workspaceConfig);
  }, [workspaceId, token, workspace, workspaceConfig]);

  // Sync state from controller
  const tokenData = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.tokenData || null
  )
  const loading = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.loading || true
  )
  const error = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.error || null
  )
  const subscription = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.subscription || null
  )
  const clientId = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.clientId || null
  )
  const accessUrl = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.accessUrl || null
  )

  useEffect(() => {
    if (controller) {
      controller.loadTokenData();
    }
  }, [controller]);

  if (!workspace || !workspaceConfig || !controller || !controller.isFitness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Workspace-ul nu a fost găsit</h1>
          <p className="text-muted-foreground">Workspace-ul cu ID-ul {workspaceId} nu există.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Se încarcă...</p>
        </div>
      </div>
    )
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Eroare</h1>
          <p className="text-muted-foreground mb-4">
            {error || "Token invalid sau expirat"}
          </p>
          <Link to={`/workspace/${workspaceId}/public/become-client`}>
            <Button>Înapoi la abonamente</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!controller.hasValidData()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Date lipsă</h1>
          <p className="text-muted-foreground mb-4">
            Nu există informații despre abonament.
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
                Abonament confirmat
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Plată procesată cu succes!
                  </h2>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Abonamentul tău a fost înregistrat. Folosește opțiunile de mai jos pentru a accesa abonamentul.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Summary */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
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

          {/* Access Options */}
          <div className="space-y-4">
            {/* Option 1: Open Link */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ExternalLink className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Deschide link
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Accesează abonamentul tău direct în browser
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Acces rapid</p>
                      <p className="text-xs text-muted-foreground">
                        Deschide link-ul pentru a accesa abonamentul
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={controller.handleOpenLink}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Deschide link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: Install App */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Descarcă aplicația
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Instalează aplicația pe dispozitivul tău
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
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
                    onClick={controller.handleOpenLink}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Deschide pentru instalare
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Odată deschis, urmează instrucțiunile browser-ului pentru a instala aplicația
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Pași următori
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                    1
                  </div>
                  <p className="text-sm text-foreground">
                    Deschide link-ul sau instalează aplicația
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                    2
                  </div>
                  <p className="text-sm text-foreground">
                    Vei fi redirecționat la autentificare
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                    3
                  </div>
                  <p className="text-sm text-foreground">
                    După autentificare, vei putea accesa abonamentul tău
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ConfirmSubscriptionView
