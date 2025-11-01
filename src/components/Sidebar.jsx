import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Activity,
  Boxes,
  CalendarDays,
  PanelsTopLeft,
  Search,
  Settings,
  UserCog,
  Users,
  Wand2,
} from "lucide-react"

const menuItems = [
  {
    id: "kpi",
    label: "KPI",
    icon: Activity,
  },
  {
    id: "programari",
    label: "Programari",
    icon: CalendarDays,
  },
  {
    id: "tratamente",
    label: "Tratamente",
    icon: Wand2,
  },
  {
    id: "pacienti",
    label: "Pacienti",
    icon: Users,
  },
  {
    id: "medici",
    label: "Medici",
    icon: UserCog,
  },
  {
    id: "produse",
    label: "Produse",
    icon: Boxes,
  },
  {
    id: "setari",
    label: "Setari",
    icon: Settings,
  },
]

const Sidebar = ({
  activeMenu,
  onMenuChange,
  clinics = [],
  selectedClinic,
  onClinicChange,
  onOpenSpotlight,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={cn(
        "hidden border-r border-border/60 bg-sidebar-background/95 text-sm transition-[width] duration-300 ease-in-out lg:flex",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-full w-full flex-col">
        <div
          className={cn(
            "flex items-center gap-2 border-b border-border/60 px-4 py-2",
            isCollapsed ? "justify-center py-3" : "justify-between",
          )}
        >
          <div className="flex items-center gap-2">
            {!isCollapsed ? (
              clinics.length ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-3 rounded-md px-1 py-1 text-sm font-medium text-foreground transition hover:text-primary"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                        CL
                      </span>
                      <span className="flex flex-col text-left">
                        <span>{selectedClinic?.name ?? "Selectează clinică"}</span>
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Comută între clinici</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {clinics.map((clinic) => (
                      <DropdownMenuItem
                        key={clinic.id}
                        onSelect={() => onClinicChange?.(clinic.id)}
                        className={cn(
                          "flex flex-col items-start gap-0.5 rounded-lg",
                          clinic.id === selectedClinic?.id && "bg-muted/70 text-foreground",
                        )}
                      >
                        <span className="text-sm font-medium">{clinic.name}</span>
                        <span className="text-xs text-muted-foreground">{clinic.location}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3 px-1 py-1">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    CL
                  </span>
                </div>
              )
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleCollapse}
          >
            <PanelsTopLeft className="h-4 w-4" />
            <span className="sr-only">Comuta latimea meniului</span>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-center px-2">
            {!isCollapsed ? (
              <Button
                variant="outline"
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-muted/60"
                onClick={onOpenSpotlight}
              >
                <span className="flex items-center gap-2">
                  <span>Căutare rapidă</span>
                </span>
                <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 rounded-md border border-border/60 bg-white px-1.5 py-0.5 font-medium">
                    ⌘K
                  </span>
                  <Search className="h-3.5 w-3.5" />
                </span>
              </Button>
            ) : null}
            </div>

            <nav className="space-y-0 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.id

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "group relative w-full justify-start gap-3 rounded-xl text-left text-foreground transition",
                      isActive
                        ? "bg-primary/5 text-primary hover:bg-primary/10"
                        : "hover:bg-muted/50",
                      isCollapsed && "px-2 py-3 justify-center",
                    )}
                    onClick={() => onMenuChange?.(item.id)}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-start rounded-md text-secondary-foreground transition",
                        isCollapsed && "h-10 w-10 justify-center",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {!isCollapsed ? (
                      <span className="text-sm font-medium leading-none">{item.label}</span>
                    ) : null}
                    {item.badge && !isCollapsed ? (
                      <Badge variant="outline" className="ml-0 text-[10px] uppercase tracking-wide">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </Button>
                )
              })}
            </nav>


          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}

export default Sidebar;