import { useState, useEffect } from "react"
import { useParams, Link, useLocation, useNavigate } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArrowLeft, Lock, Mail, KeyRound } from "lucide-react"
import { loginClient, confirmSubscription, requestPasswordReset, loginWithGoogle } from "../../services/subscriptionService"

function ClientLoginView() {
  const { workspaceId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaces } = useWorkspaceStore()
  
  const { clientId, returnTo, subscription } = location.state || {}
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const workspace = workspaces.find((ws) => ws.id === workspaceId) || null
  const workspaceConfig = workspace ? getWorkspaceConfig(workspace.type) : null

  useEffect(() => {
    // Dacă nu există clientId, redirect
    if (!clientId) {
      navigate(`/workspace/${workspaceId}/public`)
    }
  }, [clientId, workspaceId, navigate])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Login
      const loginResult = await loginClient(workspaceId, formData)
      
      if (!loginResult.success) {
        setError(loginResult.error || "Eroare la autentificare")
        setLoading(false)
        return
      }

      // După login reușit, confirmă abonamentul cu clientId
      if (clientId) {
        const confirmResult = await confirmSubscription(clientId, formData)
        
        if (!confirmResult.success) {
          setError(confirmResult.error || "Eroare la confirmarea abonamentului")
          setLoading(false)
          return
        }
      }

      // Navighează la returnTo sau dashboard
      if (returnTo) {
        navigate(returnTo)
      } else {
        navigate(`/workspace/${workspaceId}/client/dashboard`)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("A apărut o eroare. Te rugăm să încerci din nou.")
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setError(null)

    try {
      const result = await requestPasswordReset(workspaceId, resetEmail)
      
      if (!result.success) {
        setError(result.error || "Eroare la solicitarea resetării parolei")
        setResetLoading(false)
        return
      }

      setResetSuccess(true)
      setResetLoading(false)
    } catch (err) {
      console.error("Password reset error:", err)
      setError("A apărut o eroare. Te rugăm să încerci din nou.")
      setResetLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // TODO: În producție, va folosi Google OAuth SDK
      // Pentru demo, simulăm obținerea token-ului
      const mockGoogleToken = "mock_google_token_" + Date.now()
      
      const loginResult = await loginWithGoogle(workspaceId, mockGoogleToken)
      
      if (!loginResult.success) {
        setError(loginResult.error || "Eroare la autentificarea cu Google")
        setLoading(false)
        return
      }

      // După login reușit cu Google, confirmă abonamentul dacă există clientId
      if (clientId) {
        const confirmResult = await confirmSubscription(clientId, {
          email: loginResult.user.email,
          authProvider: 'google',
        })
        
        if (!confirmResult.success) {
          setError(confirmResult.error || "Eroare la confirmarea abonamentului")
          setLoading(false)
          return
        }
      }

      // Navighează la returnTo sau dashboard
      if (returnTo) {
        navigate(returnTo)
      } else {
        navigate(`/workspace/${workspaceId}/client/dashboard`)
      }
    } catch (err) {
      console.error("Google login error:", err)
      setError("A apărut o eroare. Te rugăm să încerci din nou.")
      setLoading(false)
    }
  }

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
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                Autentificare
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Conectează-te pentru a accesa abonamentul tău
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-md mx-auto">
          {subscription && (
            <Card className="border border-border mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {subscription.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {subscription.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {subscription.price.toLocaleString("ro-RO")} RON
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border border-border">
            <CardContent className="p-6">
              {!showPasswordReset ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="email@example.com"
                          className="pl-9 rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Parolă *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordReset(true)
                            setResetEmail(formData.email)
                            setError(null)
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Ai uitat parola?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Introdu parola"
                          className="pl-9 rounded-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-none"
                      disabled={loading}
                    >
                      {loading ? "Se conectează..." : "Conectează-te"}
                    </Button>
                  </form>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1 border-t border-border"></div>
                    <span className="text-xs text-muted-foreground">SAU</span>
                    <div className="flex-1 border-t border-border"></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full rounded-none mt-6"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Conectează-te cu Google
                  </Button>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      Verifica adresa de email pentru a obtine parola.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordReset(false)
                        setResetEmail("")
                        setResetSuccess(false)
                        setError(null)
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Înapoi la autentificare
                    </button>
                  </div>

                  {resetSuccess ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                              Email trimis cu succes!
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Dacă acest email este înregistrat, vei primi un link de resetare a parolei în scurt timp.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-none"
                        onClick={() => {
                          setShowPasswordReset(false)
                          setResetEmail("")
                          setResetSuccess(false)
                        }}
                      >
                        Închide
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">
                          Resetează parola
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Introdu adresa ta de email și vei primi un link pentru a reseta parola.
                      </p>

                      {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="pl-9 rounded-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-none"
                        disabled={resetLoading}
                      >
                        {resetLoading ? "Se trimite..." : "Trimite link-ul de resetare"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ClientLoginView

