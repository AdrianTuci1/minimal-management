import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Activity,
  CalendarDays,
  Home,
  PanelsTopLeft,
  Search,
  Settings,
  User,
  UserCog,
  Users,
  Wand2,
  Zap,
} from "lucide-react"
import useWorkspaceStore from "../store/workspaceStore"
import useWorkspaceConfig from "../hooks/useWorkspaceConfig"
import { useMemo } from "react"

// Map pentru iconurile din configurare către componentele Lucide React
const iconMap = {
  Activity,
  CalendarDays,
  Home,
  Settings,
  User,
  UserCog,
  Users,
  Wand2,
  Zap,
}

const Sidebar = ({
  activeMenu,
  onMenuChange,
  workspace,
  onOpenSpotlight,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { goToGroupView } = useWorkspaceStore()
  const { menuItems: configMenuItems } = useWorkspaceConfig()

  // Transformă meniurile din configurare în formatul așteptat de componentă
  const menuItems = useMemo(() => {
    return configMenuItems.map((item) => ({
      ...item,
      icon: iconMap[item.icon] || Settings, // Fallback la Settings dacă iconul nu există
    }))
  }, [configMenuItems])

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
            "flex items-center gap-2 border-b border-border/60 px-4 py-2.5",
            isCollapsed ? "justify-center py-3" : "justify-between",
          )}
        >
          <div className="flex items-center gap-2">
            {!isCollapsed ? (
              workspace ? (
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 rounded-md px-1 py-1 text-sm font-medium text-foreground transition hover:text-primary"
                  onClick={goToGroupView}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex flex-col text-left">
                    <span>{workspace.name}</span>
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-3 px-1 py-1">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    WS
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
                      <span className="text-sm font-medium leading-none text-muted-foreground">{item.label}</span>
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