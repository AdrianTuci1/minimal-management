import { useEffect, useMemo, useRef, useState } from "react"
import {
  RefreshCw,
  Sparkles,
  Users,
  MoreVertical,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ActionBar from "@/components/ActionBar"
import useAppStore from "@/store/appStore"
import ShareSpotlight from "@/components/ShareSpotlight"

const menuLabels = {
  kpi: "Indicatori de performanță",
  tratamente: "Tratamente",
  programari: "Programări",
  pacienti: "Pacienți",
  automatizari: "Automatizari",
  setari: "Setari",
}

const TopBar = ({ onlineUsers = [], actions = [] }) => {
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false)
  const primarySectionRef = useRef(null)

  const { activeMenu, isSyncActive, toggleSyncActive, isPresenting, togglePresenting, isShareSpotlightOpen, setIsShareSpotlightOpen } = useAppStore()

  const visibleUsers = useMemo(() => onlineUsers.slice(0, 4), [onlineUsers])

  // View-uri care au nevoie de ActionBar
  const viewsWithActionBar = ["programari", "pacienti", "medici", "tratamente"]
  const shouldShowActionBar = viewsWithActionBar.includes(activeMenu)

  useEffect(() => {
    setIsMobileControlsOpen(false)
  }, [activeMenu])

  const getInitials = (user) => {
    if (user.initials) {
      return user.initials
    }

    if (!user.name) {
      return "N/A"
    }

    const [first = "", second = ""] = user.name.split(" ")
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
  }

  return (
    <div>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95">
        <div className="flex flex-col gap-2 px-4 py-2">
          {/* First row: Menu name, Sync/Present buttons, and Users */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {menuLabels[activeMenu] ?? ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSyncActive}
                aria-pressed={isSyncActive}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <TooltipProvider>
                <div className="flex items-center -space-x-3">
                  {visibleUsers.map((user) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                        <Avatar className="ring-2 ring-background">
                          {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {getInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-muted-foreground">{user.role}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePresenting}
                aria-pressed={isPresenting}
                className="ml-2"
              >
                <Users className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Share</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShareSpotlightOpen(true)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Separator className="bg-border/60" />
        {shouldShowActionBar && <ActionBar actions={actions} />}
      </header>
      <ShareSpotlight />
    </div>
  )
}

export default TopBar

