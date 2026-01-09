import * as React from "react"
import { createPortal } from "react-dom"
import { X, Calendar as CalendarIcon, ChevronDown, Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ro } from "date-fns/locale"

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

    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!open || !mounted) return null

    const hasTabs = tabs && tabs.length > 0
    const hasActions = actions && actions.length > 0

    return createPortal(
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[1000] bg-black/20 backdrop-blur-xs"
          onClick={() => onOpenChange(false)}
        />
        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 z-[1001] flex items-center justify-center p-4",
            className
          )}
        >
          <div className="flex h-full w-full max-w-[440px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl lg:h-auto lg:max-h-[80vh] lg:max-w-[840px]">
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
      </>,
      document.body
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
  value?: any
  children?: React.ReactNode
  className?: string
  type?: "text" | "textarea" | "date" | "select" | "search" | "time" | string
  editable?: boolean
  onChange?: (value: any) => void
  options?: Array<{ label: string; value: string | number; color?: string }>
  placeholder?: string
}

const DrawerField = React.forwardRef<HTMLDivElement, DrawerFieldProps>(
  ({ label, value, children, type = "text", editable = false, onChange, className, options = [], placeholder }, ref) => {
    const handleDateSelect = (date: Date | undefined) => {
      onChange?.(date)
    }

    const [searchQuery, setSearchQuery] = React.useState("")
    const [openCombobox, setOpenCombobox] = React.useState(false)

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (editable) {
      if (type === "date") {
        return (
          <div ref={ref} className={cn("mb-6", className)}>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP", { locale: ro }) : <span>{placeholder || "Alegeți o dată"}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )
      }

      if (type === "select") {
        return (
          <div ref={ref} className={cn("mb-6", className)}>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between", !value && "text-muted-foreground")}
                >
                  <span className="truncate">
                    {value
                      ? options.find((option) => option.value === value)?.label || value
                      : placeholder || "Selectați o opțiune"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        value === option.value && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        onChange?.(option.value)
                        // Trigger close implicitly by focusing out or let user handle it
                        // With simple popover div content we don't have programmatic close easily without controlled state on Popover,
                        // but since we are inside DrawerField which might be re-rendered, let's keep it simple.
                        // Click outside closes Popover automatically. To close on select, we might need controlled Popover.
                        // For now let's use controlled popover state in a wrapper or accept standard Popover behavior (click outside/esc).
                        // Actually, for better UX, let's just use document click simulates or just let user click away.
                        // Ideally we should have controlled open state.
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.color && (
                        <div
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      {option.label}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      }

      if (type === "search") {
        return (
          <div ref={ref} className={cn("mb-6", className)}>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">
                    {value
                      ? options.find((option) => option.value === value)?.label || value
                      : placeholder || "Căutați..."}
                  </span>
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2 border-b border-border">
                  <Input
                    placeholder="Căutați..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Nu s-au găsit rezultate.
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                          value === option.value && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                          onChange?.(option.value)
                          setOpenCombobox(false)
                          setSearchQuery("")
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.color && (
                          <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        {option.label}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      }

      if (type === "time") {
        return (
          <div ref={ref} className={cn("mb-6", className)}>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
            <div className="relative">
              <Input
                type="time"
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                className="block w-full"
                placeholder={placeholder}
              />
            </div>
          </div>
        )
      }

      return (
        <div ref={ref} className={cn("mb-6", className)}>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
          {type === "textarea" ? (
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder || `Introduceți ${label.toLowerCase()}`}
            />
          ) : (
            <Input
              type={type}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder || `Introduceți ${label.toLowerCase()}`}
            />
          )}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("mb-6", className)}>
        <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
        {children || <div className="text-base text-foreground">
          {/* Handle display value for select/search types when not editable */}
          {(type === 'select' || type === 'search') && options.length > 0 ? (
            options.find(opt => opt.value === value)?.label || value || "-"
          ) : (
            value ? String(value) : "-"
          )}
        </div>}
      </div>
    )
  }
)
DrawerField.displayName = "DrawerField"

export { Drawer, DrawerContent, DrawerField }

