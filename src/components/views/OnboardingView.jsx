import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, ArrowRight, Check } from "lucide-react"
import useWorkspaceStore from "../../store/workspaceStore"

function OnboardingView() {
  const navigate = useNavigate()
  const { updateUser } = useWorkspaceStore()
  const [selectedType, setSelectedType] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userTypes = [
    {
      id: "service_provider",
      title: "Prestez servicii",
      description: "Gestionez servicii, programări și clienți pentru afacerea mea",
      icon: Briefcase,
    },
    {
      id: "service_user",
      title: "Folosesc serviciile",
      description: "Caut și rezerv servicii, urmăresc abonamentele mele",
      icon: Users,
    },
  ]

  const handleSelectType = (typeId) => {
    setSelectedType(typeId)
  }

  const handleContinue = async () => {
    if (!selectedType) return

    setIsSubmitting(true)

    try {
      // Salvează preferința utilizatorului în store
      updateUser({ userType: selectedType })
      
      // Simulează un mic delay pentru o experiență mai bună
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Navighează către Dashboard sau către view-ul corespunzător
      if (selectedType === "service_provider") {
        navigate("/")
      } else {
        // Pentru utilizatorii care folosesc serviciile, navigăm către Dashboard
        // (poate fi modificat ulterior pentru un view dedicat)
        navigate("/")
      }
    } catch (error) {
      console.error("Error saving user type:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:py-12 flex flex-col justify-center">
        {/* Header */}
        <div className="text-left mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Bine ai venit!
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Înainte să începem, spune-ne ce tip de utilizator ești pentru a personaliza experiența ta
          </p>
        </div>

        {/* User Type Selection - Single Row Layout (Table-like) */}
        <div className="space-y-3 mb-6">
          {userTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id

            return (
              <div
                key={type.id}
                className={`
                  w-full cursor-pointer transition-all duration-200
                  border rounded-lg
                  ${isSelected 
                    ? "bg-primary/5 border-primary border-2" 
                    : "border-border bg-card hover:bg-muted/50"
                  }
                `}
                onClick={() => handleSelectType(type.id)}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className={`
                      p-3 rounded-lg flex-shrink-0
                      ${isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                      transition-colors
                    `}>
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                            {type.title}
                          </h3>
                          <p className="text-sm md:text-base text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 p-1.5 bg-primary rounded-full">
                            <Check className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Text */}
        <p className="text-left text-sm text-muted-foreground mb-20 md:mb-24">
          Poți schimba această preferință oricând din setări
        </p>
      </div>

      {/* Sticky Continue Button */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-4xl mx-auto px-4 py-4 flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType || isSubmitting}
            className="w-full md:w-auto md:min-w-[200px]"
          >
            {isSubmitting ? (
              "Se încarcă..."
            ) : (
              <>
                Continuă
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingView

