import { useState } from "react"
import { MoreVertical, Settings, LogOut, User, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import useFitnessUserStore from "../../../store/fitnessUserStore"

function OverviewHeader({ title = "Overview" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setActiveView } = useFitnessUserStore()

  const menuItems = [
    { 
      icon: User, 
      label: "Profil", 
      onClick: () => {
        setActiveView("profile")
        setIsMenuOpen(false)
      }
    },
    { icon: Settings, label: "Setări", onClick: () => console.log("Setări") },
    { icon: HelpCircle, label: "Ajutor", onClick: () => console.log("Ajutor") },
    { icon: LogOut, label: "Ieșire", onClick: () => console.log("Ieșire") },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Meniu</h2>
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          item.onClick()
                          setIsMenuOpen(false)
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    )
                  })}
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
    </>
  )
}

export default OverviewHeader

