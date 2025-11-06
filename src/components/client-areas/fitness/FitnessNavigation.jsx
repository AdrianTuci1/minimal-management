import { Home, Dumbbell, Apple, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useFitnessUserStore from "../../../store/fitnessUserStore"

const navigationItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "nutrition", label: "Nutriție", icon: Apple },
  { id: "profile", label: "Profil", icon: User },
]

function FitnessNavigation() {
  const { activeView, setActiveView } = useFitnessUserStore()

  return (
    <div className="border-t border-border bg-card sticky bottom-0 z-10">
      <div className="grid grid-cols-4 gap-0">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "h-16 rounded-none flex flex-col gap-1",
                isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default FitnessNavigation

