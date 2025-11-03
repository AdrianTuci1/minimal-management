import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface DrawerAction {
  id: string
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  onClick: () => void
}

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: React.ReactNode
  className?: string
  tabs?: Array<{
    id: string
    icon: React.ComponentType<{ className?: string }>
    content: React.ReactNode
  }>
  defaultTab?: string
  actions?: DrawerAction[]
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ open, onOpenChange, title, children, className, tabs, defaultTab = "details", actions }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultTab)

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
      return () => {
        document.body.style.overflow = ""
      }
    }, [open])

    React.useEffect(() => {
      if (open && tabs && tabs.length > 0) {
        setActiveTab(defaultTab)
      }
    }, [open, defaultTab, tabs])

    if (!open) return null

    const hasTabs = tabs && tabs.length > 0
    const hasActions = actions && actions.length > 0

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40"
          onClick={() => onOpenChange(false)}
        />
        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-[400px] transition-transform duration-600 ease-in-out flex justify-center align-center",
            open ? "translate-x-0" : "translate-x-full",
            className
          )}
        >
          {/* Padding */}
          <div className="w-full h-full p-4">
          <div className="flex h-full flex-col bg-white border border-gray-200 rounded-lg">
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {/* Tabs */}
            {hasTabs && (
              <div className="border-b border-border px-6 py-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="h-8 w-full justify-start bg-transparent p-0 gap-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="h-7 px-2 data-[state=active]:bg-muted data-[state=active]:text-foreground"
                        >
                          <Icon className="h-4 w-4" />
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </div>
            )}
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {hasTabs ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {tabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0">
                      {tab.content}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                children
              )}
            </div>
            {/* Footer with Actions */}
            {hasActions && (
              <div className="border-t border-border px-6 py-4">
                <div className="flex gap-2">
                  {actions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={action.id}
                        variant={action.variant || "default"}
                        onClick={action.onClick}
                        className={Icon ? "aspect-square h-10 w-10 p-0" : "flex-1"}
                        title={action.label}
                      >
                        {Icon ? <Icon className="h-5 w-5" /> : action.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </>
    )
  }
)
Drawer.displayName = "Drawer"

interface DrawerContentProps {
  children: React.ReactNode
  className?: string
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn("p-6", className)}>
        {children}
      </div>
    )
  }
)
DrawerContent.displayName = "DrawerContent"

interface DrawerFieldProps {
  label: string
  value?: string | React.ReactNode
  children?: React.ReactNode
  className?: string
  type?: string
  editable?: boolean
  onChange?: (value: string) => void
}

const DrawerField = React.forwardRef<HTMLDivElement, DrawerFieldProps>(
  ({ label, value, children, type = "text", editable = false, onChange, className }, ref) => {
    if (editable) {
      return (
        <div ref={ref} className={cn("mb-6", className)}>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
          {type === "textarea" ? (
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={`Introduceți ${label.toLowerCase()}`}
            />
          ) : (
            <Input
              type={type}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={`Introduceți ${label.toLowerCase()}`}
            />
          )}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("mb-6", className)}>
        <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
        {children || <div className="text-base text-foreground">{value || "-"}</div>}
      </div>
    )
  }
)
DrawerField.displayName = "DrawerField"

export { Drawer, DrawerContent, DrawerField }

