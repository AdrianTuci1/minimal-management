import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  Home, 
  Folder, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Settings,
  LogOut,
  User,
  Clock,
  Search,
  Grid3x3,
  Library,
  Trash2,
  Star,
  Bell,
  HomeIcon,
  Code,
  Briefcase
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"

const DashboardSidebar = ({ activeView, onViewChange, onOpenCreateTeamSpotlight }) => {
  const navigate = useNavigate()
  const { 
    groups, 
    selectedGroupId,
    drafts,
    currentUser,
    workspaces,
    subscription,
    selectGroup,
    createGroup,
    selectWorkspace
  } = useWorkspaceStore()
  
  const [expandedGroups, setExpandedGroups] = useState({})
  const [isTeamExpanded, setIsTeamExpanded] = useState(true)
  
  const selectedGroup = groups.find(g => g.id === selectedGroupId)
  const subscriptionPlan = subscription?.plan || "free"

  // Get drafts for current group
  const currentGroupDrafts = useMemo(() => {
    if (!selectedGroupId) return []
    return drafts.filter((d) => d.groupId === selectedGroupId)
  }, [drafts, selectedGroupId])

  const handleViewChange = (viewId) => {
    if (viewId === "groups" || viewId === "all-projects") {
      const allExpanded = {}
      groups.forEach(g => {
        allExpanded[g.id] = true
      })
      setExpandedGroups(allExpanded)
    }
    onViewChange?.(viewId)
  }

  const handleGroupSelect = (groupId) => {
    // When selecting a group from sidebar dropdown, update view to show that group's workspaces
    onViewChange?.(groupId)
  }

  return (
    <aside className="hidden border-r border-border/60 bg-sidebar-background/95 text-sm lg:flex w-64 flex-col">
      {/* User Profile Section */}
      <div className="border-b border-border/60 p-3">
        <div className="flex items-center justify-between mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-auto p-0 hover:bg-transparent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium text-sm truncate">{currentUser.name}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => {}}>
                <User className="h-4 w-4 mr-2" />
                Editează profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Settings className="h-4 w-4 mr-2" />
                Setări
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {}} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Deconectare
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 h-8 text-xs bg-muted/50 border-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-border/60 p-2">
        <div className="space-y-0.5">
          {currentUser?.userType === "service_user" ? (
            // For service users, show simplified navigation
            <>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm h-8",
                  activeView === "services" && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => handleViewChange("services")}
              >
                <Briefcase className="h-4 w-4" />
                Servicii
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm h-8",
                  activeView === "account" && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => handleViewChange("account")}
              >
                <User className="h-4 w-4" />
                Contul meu
              </Button>
            </>
          ) : (
            // For service providers, show full navigation
            <>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm h-8",
                  activeView === "recents" && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => handleViewChange("recents")}
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm h-8",
                  activeView === "services" && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => handleViewChange("services")}
              >
                <Briefcase className="h-4 w-4" />
                Servicii
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm h-8",
                  activeView === "groups" && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => handleViewChange("groups")}
              >
                <Users className="h-4 w-4" />
                Grupuri
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm h-8",
                  activeView === "drafts" && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => handleViewChange("drafts")}
              >
                <FileText className="h-4 w-4" />
                Drafts
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Group Section - Only show for service providers */}
      {currentUser?.userType !== "service_user" && selectedGroup && (
        <>
          <div className="border-b border-border/60 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between gap-2 h-auto p-2 hover:bg-muted/50"
                  onClick={() => setIsTeamExpanded(!isTeamExpanded)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {selectedGroup.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                      {selectedGroup.name}'s
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {subscriptionPlan === "free" ? "Free" : subscriptionPlan === "basic" ? "Basic" : subscriptionPlan === "professional" ? "Pro" : "Enterprise"}
                    </Badge>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform",
                    !isTeamExpanded && "-rotate-90"
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() => handleGroupSelect(group.id)}
                    className={selectedGroupId === group.id ? "bg-muted" : ""}
                  >
                    {group.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onOpenCreateTeamSpotlight?.()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Creează grup
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isTeamExpanded && (
              <div className="mt-1 space-y-0.5">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-sm h-8 pl-8",
                    activeView === "all-projects" && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => handleViewChange("all-projects")}
                >
                  <Grid3x3 className="h-3.5 w-3.5" />
                  Workspaces
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-sm h-8 pl-8",
                    activeView === `group-drafts-${selectedGroupId}` && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => handleViewChange(`group-drafts-${selectedGroupId}`)}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Drafts
                  {currentGroupDrafts.length > 0 && (
                    <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 h-4">
                      {currentGroupDrafts.length}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm h-8 pl-8"
                  onClick={() => {}}
                >
                  <Library className="h-3.5 w-3.5" />
                  Resources
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm h-8 pl-8"
                  onClick={() => {}}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Trash
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Upgrade Section */}
      {subscriptionPlan === "free" && (
        <>
          <div className="p-3 m-2 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              Ready to go beyond this free plan?
            </p>
            <p className="text-xs font-medium mb-3">
              Upgrade for premium features.
            </p>
            <Button variant="default" size="sm" className="w-full h-7 text-xs">
              View plans
            </Button>
          </div>
        </>
      )}

      {/* Starred Section */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2">
            Starred
          </div>
          <div className="space-y-0.5">
            {workspaces
              .filter(ws => ws.starred)
              .slice(0, 3)
              .map((workspace) => (
                <Button
                  key={workspace.id}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm h-8 pl-2"
                  onClick={() => {
                    selectWorkspace(workspace.id)
                    navigate(`/workspace/${workspace.id}`)
                  }}
                >
                  <Folder className="h-3.5 w-3.5" />
                  <span className="truncate text-xs">{workspace.name}</span>
                </Button>
              ))}
            {workspaces.filter(ws => ws.starred).length === 0 && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                No starred projects
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Developers Section */}
      <div className="border-t border-border/60 p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-sm h-8",
            activeView === "developers" && "bg-primary/10 text-primary font-medium"
          )}
          onClick={() => handleViewChange("developers")}
        >
          <Code className="h-4 w-4" />
          Developers
        </Button>
      </div>

    </aside>
  )
}

export default DashboardSidebar

