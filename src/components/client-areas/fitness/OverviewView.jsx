import { useState, useMemo } from "react"
import SimpleWeekCalendar from "./SimpleWeekCalendar"
import ServiceTimeStats from "./ServiceTimeStats"
import MonthlyContributionGraph from "./MonthlyContributionGraph"
import useFitnessUserStore from "../../../store/fitnessUserStore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download } from "lucide-react"
import QRCode from "react-qr-code"

function OverviewView({ subscription: propSubscription, clientData: propClientData }) {
  const { selectedDate, setSelectedDate, serviceTimeStats, sessionHistory, subscription: storeSubscription, clientData: storeClientData } = useFitnessUserStore()
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [isAddingToWallet, setIsAddingToWallet] = useState(false)

  // Use props if available, otherwise use store data
  const subscription = propSubscription || storeSubscription
  const clientData = propClientData || storeClientData

  // Generate QR code data - use subscription ID or user email
  const qrData = useMemo(() => {
    if (clientData?.formData?.email) {
      return `FITNESS:${clientData.formData.email}:${subscription?.id || 'default'}`
    }
    return `FITNESS:${Date.now()}`
  }, [clientData, subscription])

  const handleAddToWallet = async () => {
    setIsAddingToWallet(true)
    
    // Simulate API call to generate wallet pass
    // In production, this would generate a PKPass file for Apple Wallet or Google Wallet pass
    try {
      // TODO: Replace with actual wallet pass generation API call
      // const response = await fetch(`/api/wallet/generate-pass`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ subscription, clientData, qrData })
      // })
      
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production, this would download the .pkpass file or redirect to wallet app
      // For demo purposes, we'll show a success message
      alert('Cardul a fost adăugat în wallet!')
      
      setIsAddingToWallet(false)
    } catch (error) {
      console.error('Error adding to wallet:', error)
      alert('Eroare la adăugarea în wallet. Te rugăm să încerci din nou.')
      setIsAddingToWallet(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <SimpleWeekCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
        {/* Fitness Card with Subscription Details */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => subscription && setIsCardOpen(true)}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* QR Code - small */}
              <div className="flex-shrink-0">
                <div className="bg-white p-2 rounded-lg border border-border">
                  <QRCode
                    value={qrData}
                    size={80}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
              
              {/* Subscription Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base">
                    {subscription?.name || "Cardul meu"}
                  </h3>
                  {subscription && clientData?.confirmed ? (
                    <Badge variant="default" className="text-xs">Activ</Badge>
                  ) : subscription ? (
                    <Badge variant="outline" className="text-xs">Neconfirmat</Badge>
                  ) : null}
                </div>
                
                {subscription ? (
                  <>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Durată</span>
                        <span className="text-sm font-medium">{subscription.duration || "Nedefinită"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Preț</span>
                        <span className="text-sm font-medium">
                          {subscription.price ? `${subscription.price.toLocaleString("ro-RO")} RON` : "N/A"}
                        </span>
                      </div>
                      {subscription.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {subscription.description}
                        </p>
                      )}
                    </div>

                    {/* Check-in rapid button */}
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsCardOpen(true)
                      }}
                    >
                      Check-in rapid
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Nu ai un abonament activ
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled
                    >
                      Check-in rapid
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ServiceTimeStats stats={serviceTimeStats} />
        
        <MonthlyContributionGraph sessionHistory={sessionHistory} />
      </div>

      {/* Full-screen Subscription Card Modal - outside container */}
      {isCardOpen && subscription && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs animate-in fade-in-0"
            onClick={() => setIsCardOpen(false)}
          />
          
          {/* Full-screen Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Cardul meu de abonament</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subscription.name || "Abonament activ"}
                    </p>
                  </div>
                  {clientData?.confirmed ? (
                    <Badge variant="default">Activ</Badge>
                  ) : (
                    <Badge variant="outline">Neconfirmat</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Large QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border border-border">
                    <QRCode
                      value={qrData}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>

                {/* Subscription Details */}
                {subscription.description && (
                  <p className="text-sm text-muted-foreground text-center">
                    {subscription.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Durată</div>
                    <div className="font-semibold mt-1">{subscription.duration}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Preț</div>
                    <div className="font-semibold mt-1">
                      {subscription.price?.toLocaleString("ro-RO")} RON
                    </div>
                  </div>
                </div>

                {clientData?.confirmedAt && (
                  <div className="pt-2 border-t border-border text-center">
                    <div className="text-xs text-muted-foreground">
                      Confirmat pe {new Date(clientData.confirmedAt).toLocaleDateString("ro-RO")}
                    </div>
                  </div>
                )}

                {/* Add to Wallet Button */}
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleAddToWallet}
                  disabled={isAddingToWallet}
                >
                  {isAddingToWallet ? (
                    <>
                      <Download className="h-4 w-4 mr-2 animate-pulse" />
                      Se adaugă...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Adaugă în Wallet
                    </>
                  )}
                </Button>

                {/* Close Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCardOpen(false)}
                >
                  Închide
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  )
}

export default OverviewView

