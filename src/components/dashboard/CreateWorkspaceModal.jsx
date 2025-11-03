import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, Sparkles, ChevronDown } from "lucide-react"

const WORKSPACE_TYPES = [
  { id: "clinica-dentara", label: "Clinica Dentară", icon: "🦷" },
  { id: "hotel", label: "Hotel", icon: "🏨" },
  { id: "sala-fitness", label: "Sală Fitness", icon: "💪" },
  { id: "salon", label: "Salon", icon: "✂️" },
  { id: "reparatii", label: "Reparații", icon: "🔧" },
]

const CreateWorkspaceModal = ({ 
  open, 
  onClose, 
  onCreateWorkspace, 
  canCreateWorkspace,
  onUpgradeClick 
}) => {
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceType, setWorkspaceType] = useState("")
  const workspaceNameInputRef = useRef(null)

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        workspaceNameInputRef.current?.focus()
      }, 100)
      
      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          handleClose()
        }
      }
      
      document.addEventListener("keydown", handleEscape)
      document.body.classList.add("overflow-hidden")
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.classList.remove("overflow-hidden")
      }
    }
  }, [open])

  const handleClose = () => {
    setWorkspaceName("")
    setWorkspaceType("")
    onClose()
  }

  const handleCreate = () => {
    if (!workspaceName || !workspaceType) return
    onCreateWorkspace({
      name: workspaceName,
      type: workspaceType,
    })
    handleClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={handleClose} />
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="shadow-2xl border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Creează proiect nou</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <span className="text-xl">×</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!canCreateWorkspace ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">Plan necesar</span>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                  Ai atins limita de spații de lucru pentru planul tău actual. Upgrade la un plan superior pentru a crea mai multe spații de lucru.
                </p>
                
                {/* Pricing Information */}
                <div className="mb-4 pt-4 border-t border-yellow-300 dark:border-yellow-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Prețuri</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-800 dark:text-yellow-200">Spațiu de lucru</span>
                      <span className="font-semibold text-yellow-900 dark:text-yellow-100">50 EUR/lună</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-800 dark:text-yellow-200">Cont adițional la grup/workspace</span>
                      <span className="font-semibold text-yellow-900 dark:text-yellow-100">25 EUR/lună</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-yellow-300 dark:border-yellow-700">
                      <span className="text-yellow-800 dark:text-yellow-200">Cont preview</span>
                      <span className="font-semibold text-green-700 dark:text-green-400">Gratuit</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end pt-2">
                  <Button variant="default" className="w-full" onClick={onUpgradeClick}>
                    Upgrade plan
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nume proiect</label>
                  <Input
                    ref={workspaceNameInputRef}
                    placeholder="ex: Clinica Dentară Centrală"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && workspaceName && workspaceType && canCreateWorkspace) {
                        handleCreate()
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tip proiect</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {workspaceType ? (
                          <div className="flex items-center gap-2">
                            <span>{WORKSPACE_TYPES.find(t => t.id === workspaceType)?.icon}</span>
                            <span>{WORKSPACE_TYPES.find(t => t.id === workspaceType)?.label}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Selectează tipul</span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {WORKSPACE_TYPES.map((type) => (
                        <DropdownMenuItem
                          key={type.id}
                          onClick={() => setWorkspaceType(type.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                  >
                    Anulează
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleCreate}
                    disabled={!workspaceName || !workspaceType || !canCreateWorkspace}
                  >
                    Creează
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateWorkspaceModal

