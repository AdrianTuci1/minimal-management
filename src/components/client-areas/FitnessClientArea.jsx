import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import useFitnessUserStore from "../../store/fitnessUserStore"
import OverviewView from "./fitness/OverviewView"
import WorkoutView from "./fitness/WorkoutView"
import NutritionView from "./fitness/NutritionView"
import ProfileView from "./fitness/ProfileView"
import FitnessNavigation from "./fitness/FitnessNavigation"

function FitnessClientArea({ workspace, workspaceConfig, clientData: propClientData, subscription: propSubscription }) {
  const { activeView, createTemporaryUser, user, setActiveView, subscription: storeSubscription, clientData: storeClientData } = useFitnessUserStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Use props if available, otherwise use store data
  const subscription = propSubscription || storeSubscription
  const clientData = propClientData || storeClientData

  // Create temporary user if client data exists
  useEffect(() => {
    if (clientData?.formData && !user?.email) {
      createTemporaryUser({
        name: clientData.formData.name || "Alex",
        email: clientData.formData.email,
        phone: clientData.formData.phone,
      })
    }
  }, [clientData, createTemporaryUser, user])

  const address = workspace.address || "Strada Exemplu nr. 123, București"
  const email = workspace.email || "contact@example.com"
  const phone = workspace.phone || "+40 123 456 789"

  const renderActiveView = (props = {}) => {
    switch (activeView) {
      case "workout":
        return <WorkoutView />
      case "nutrition":
        return <NutritionView />
      case "profile":
        return <ProfileView />
      case "overview":
      default:
        return <OverviewView subscription={props.subscription} clientData={props.clientData} />
    }
  }

  const menuItems = [
    { 
      label: "Profil", 
      onClick: () => {
        setActiveView("profile")
        setIsMenuOpen(false)
      }
    },
    { label: "Setări", onClick: () => console.log("Setări") },
    { label: "Ajutor", onClick: () => console.log("Ajutor") },
    { label: "Ieșire", onClick: () => console.log("Ieșire") },
  ]

  const userName = user?.name 
    ? user.name.charAt(0).toLowerCase() + user.name.slice(1)
    : "alex"

  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "A"

  // Map view IDs to display names
  const viewNames = {
    overview: null, // Don't show view name for overview
    workout: "Workout",
    nutrition: "Nutriție",
    profile: "Profil",
  }

  const currentViewName = viewNames[activeView]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Welcome Header with Menu - Sticky */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-0 flex items-center gap-4 py-4 border-b border-border">
        {/* Avatar - first column - only in overview */}
        {activeView === "overview" && (
          <Avatar className="h-14 w-14">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        )}
        
        {/* Second column - "Bun venit" and Name or View Name */}
        <div className="flex-1 flex flex-col">
          {activeView === "overview" ? (
            <>
              <p className="text-sm text-muted-foreground">Bun venit</p>
              <h1 className="text-2xl font-semibold">{userName}</h1>
            </>
          ) : (
            <h1 className="text-2xl font-semibold">{currentViewName}</h1>
          )}
        </div>
        
        {/* Menu button - right */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setIsMenuOpen(true)}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Over-screen Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs animate-in fade-in-0"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Meniu</h2>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        item.onClick()
                        setIsMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Anulează
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Content Container */}
      <div className="mt-4">
        {/* Main Content Area */}
        <div className="flex-1">
          {renderActiveView({ subscription, clientData })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <FitnessNavigation />
    </div>
  )
}

export default FitnessClientArea

