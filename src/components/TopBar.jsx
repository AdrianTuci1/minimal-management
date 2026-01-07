import { useEffect, useMemo, useRef, useState } from "react"
import {
  RefreshCw,
  Sparkles,
  Users,
  MoreVertical,
  LayoutDashboard,
  ExternalLink,
  Settings,
  ChevronDown
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

import ActionBar from "@/components/ActionBar"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { useActionBarModel } from "@/models/ActionBarModel"
import { useSidebarModel } from "@/models/SidebarModel"
import ShareSpotlight from "@/components/ShareSpotlight"

const TopBar = ({ onlineUsers = [] }) => {
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false)
  const primarySectionRef = useRef(null)

  const { activeMenu, isSyncActive, toggleSyncActive, isPresenting, togglePresenting, isShareSpotlightOpen, setIsShareSpotlightOpen } = useAppStore()
  const { currentWorkspace, workspaceType, config } = useWorkspaceConfig()
  const { workspaceNavigationItems } = useSidebarModel()

  // Folosește modelul pentru a obține informații despre ActionBar
  const { hasActionBar, actions } = useActionBarModel()

  const visibleUsers = useMemo(() => onlineUsers.slice(0, 4), [onlineUsers])

  // Icon map for navigation items
  const iconMap = {
    LayoutDashboard,
    ExternalLink,
  }

  useEffect(() => {
    setIsMobileControlsOpen(false)
  }, [activeMenu])

  return (
    <div>
      <header className="sticky top-0 z-40 w-full flex justify-between items-start px-4 py-2 pointer-events-none">

        {/* Left Group: Workspace Dropdown */}
        <div className="pointer-events-auto flex items-center rounded-2xl border border-border/40 bg-background/80 p-1 shadow-sm backdrop-blur-md transition-all hover:bg-background/90 hover:shadow-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 px-2 hover:bg-muted/50 rounded-xl font-semibold text-foreground/80">
                {/* Logo Placeholder */}
                <div className="flex aspect-square h-5 w-5 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                  <span className="font-bold text-[10px] leading-none">
                    {(currentWorkspace?.name?.[0] || "W").toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">{currentWorkspace?.name || "Workspace"}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Navigare Workspace</DropdownMenuLabel>
              {workspaceNavigationItems.map(item => {
                const Icon = iconMap[item.icon] || Settings
                return (
                  <DropdownMenuItem key={item.id} onClick={item.onClick} className="gap-2 cursor-pointer">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Group: ActionBar (Reduced Height) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 pointer-events-auto">
          {hasActionBar && (
            <div className="flex items-center gap-4 rounded-2xl border border-border/40 bg-background/80 shadow-sm backdrop-blur-md transition-all">
              <ActionBar actions={actions} />
            </div>
          )}
        </div>

        {/* Right Group: Live & Content */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-border/40 bg-background/80 p-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-background/90 hover:shadow-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePresenting}
            aria-pressed={isPresenting}
            className={cn(
              "h-8 gap-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all px-3",
              isPresenting
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full bg-current", isPresenting && "animate-pulse")} />
            <span>Live</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => setIsShareSpotlightOpen(true)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

      </header>
      <ShareSpotlight />
    </div>
  )
}

export default TopBar
