import { useMemo, useSyncExternalStore } from "react"
import { useParams, Link, useLocation, useNavigate } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArrowLeft, ArrowRight, CreditCard, Shield, Smartphone, Dumbbell, TrendingUp, CheckCircle2 } from "lucide-react"
import { SubscriptionPaymentController } from "../../models/SubscriptionPaymentController"

function SubscriptionPaymentView() {
  const { workspaceId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaces } = useWorkspaceStore()
  
  // Get subscription data from location state
  const subscription = location.state?.subscription || null

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
    return new SubscriptionPaymentController(workspaceId, subscription, workspace, workspaceConfig, navigate);
  }, [workspaceId, subscription, workspace, workspaceConfig, navigate]);

  // Sync state from controller
  const formData = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.formData || { fullName: "", email: "", phone: "", dateOfBirth: "", objectives: "" }
  )
  const processing = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.processing || false
  )
  const error = useSyncExternalStore(
    (callback) => controller?.subscribe(callback) || (() => {}),
    () => controller?.error || null
  )

  // Redirect if no subscription data
  if (!controller?.hasValidSubscription()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Abonament lipsă</h1>
          <p className="text-muted-foreground mb-4">
            Nu există abonament selectat. Te rugăm să selectezi un abonament mai întâi.
          </p>
          <Link to={`/workspace/${workspaceId}/public/become-client`}>
            <Button>Înapoi la abonamente</Button>
          </Link>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link to={`/workspace/${workspaceId}/public/become-client`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Detalii și plată
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="border border-border rounded-none">
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Informații personale
                  </h2>
                  <form onSubmit={(e) => { e.preventDefault(); controller.handleSubmit(); }} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Nume complet *
                      </label>
                      <Input
                        required
                        value={formData.fullName}
                        onChange={(e) => controller.handleInputChange("fullName", e.target.value)}
                        placeholder="Nume complet"
                        className="rounded-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Email *
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => controller.handleInputChange("email", e.target.value)}
                          placeholder="email@example.com"
                          className="rounded-none"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Telefon *
                        </label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => controller.handleInputChange("phone", e.target.value)}
                          placeholder="+40 123 456 789"
                          className="rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Data nașterii
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => controller.handleInputChange("dateOfBirth", e.target.value)}
                        className="rounded-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Obiective
                      </label>
                      <textarea
                        value={formData.objectives}
                        onChange={(e) => controller.handleInputChange("objectives", e.target.value)}
                        placeholder="Descrieți obiectivele dvs. de fitness..."
                        className="w-full min-h-[100px] rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border border-border rounded-none">
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Metodă de plată
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border border-border rounded-none cursor-pointer hover:bg-accent/50 transition-colors">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Card bancar</div>
                        <div className="text-sm text-muted-foreground">
                          Visa, Mastercard, American Express
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border rounded-none cursor-pointer hover:bg-accent/50 transition-colors">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Apple Pay / Google Pay</div>
                        <div className="text-sm text-muted-foreground">
                          Plătește rapid și sigur
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                      <Shield className="h-4 w-4" />
                      <span>Plata este securizată și criptată</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-border rounded-none sticky top-24">
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Rezumat abonament
                  </h2>

                  {/* Subscription Details */}
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">
                          {subscription.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {subscription.duration}
                        </div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2 mt-3">
                      {subscription.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {subscription.features.length > 3 && (
                        <div className="text-xs text-muted-foreground ml-6">
                          +{subscription.features.length - 3} mai multe
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Preț abonament</span>
                      <span className="text-foreground">{subscription.price.toLocaleString("ro-RO")} RON</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Taxe</span>
                      <span className="text-foreground">0 RON</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-foreground">
                        {subscription.price.toLocaleString("ro-RO")} RON
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    size="lg"
                    className="w-full mt-6 rounded-none"
                    onClick={controller.handleSubmit}
                    disabled={!controller.isFormValid() || processing}
                  >
                    {processing ? "Se procesează..." : "Confirmă și plătește"}
                    {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Prin confirmare, ești de acord cu termenii și condițiile
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SubscriptionPaymentView

