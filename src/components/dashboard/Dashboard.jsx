import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Building2, CreditCard, Sparkles, TrendingUp, Folder, BarChart3, FileText, Image, Video, X, Users, Trash2, ChevronDown, Share2, FolderPlus } from "lucide-react"
import useWorkspaceStore from "../../store/workspaceStore"
import DashboardSidebar from "./DashboardSidebar"
import DashboardHeader from "./DashboardHeader"
import WorkspaceCard from "./WorkspaceCard"
import SpotlightSearch from "../SpotlightSearch"

const WORKSPACE_TYPES = [
  { id: "clinica-dentara", label: "Clinica Dentară", icon: "🦷" },
  { id: "hotel", label: "Hotel", icon: "🏨" },
  { id: "sala-fitness", label: "Sală Fitness", icon: "💪" },
  { id: "salon", label: "Salon", icon: "✂️" },
  { id: "reparatii", label: "Reparații", icon: "🔧" },
]

const SUBSCRIPTION_PLANS = {
  basic: { name: "Basic", maxWorkspaces: 1, price: 50 },
  professional: { name: "Professional", maxWorkspaces: 3, price: 150 },
  enterprise: { name: "Enterprise", maxWorkspaces: -1, price: 500 }, // -1 = unlimited
}

// Mock collaborators data
const MOCK_COLLABORATORS = [
  { id: "col-1", name: "Ana Popescu", initials: "AP", color: "#6366F1" },
  { id: "col-2", name: "Mihai Ionescu", initials: "MI", color: "#0EA5E9" },
  { id: "col-3", name: "Elena Stan", initials: "ES", color: "#22C55E" },
  { id: "col-4", name: "Andrei Dima", initials: "AD", color: "#F97316" },
  { id: "col-5", name: "Maria Georgescu", initials: "MG", color: "#A855F7" },
]

// Helper function to create a deterministic hash from string
const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Helper function to calculate usage hours from access log
const calculateUsageHours = (workspaceId, workspaceAccessLog) => {
  const accesses = workspaceAccessLog.filter(log => log.workspaceId === workspaceId)
  // Mock: each access represents ~2-4 hours of usage
  // Use deterministic hash for consistent values
  const hash = hashString(workspaceId)
  const baseHours = 2 + (hash % 100) / 50 // 2-4 hours per access
  return accesses.length > 0 ? accesses.length * baseHours : hash % 20 + 5 // 5-25 hours if no accesses
}

// Helper function to get collaborators for a workspace
const getWorkspaceCollaborators = (workspaceId) => {
  // Mock: assign 1-4 deterministic collaborators per workspace
  const hash = hashString(workspaceId)
  const count = (hash % 4) + 1 // 1-4 collaborators
  return MOCK_COLLABORATORS.slice(0, count)
}

function Dashboard() {
  const { 
    groups, 
    selectedGroupId, 
    selectGroup,
    createGroup,
    workspaces, 
    subscription, 
    createWorkspace, 
    selectWorkspace, 
    workspaceAccessLog,
    drafts,
    createDraft,
    updateDraft,
    deleteDraft
  } = useWorkspaceStore()
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const [isCreateDraftOpen, setIsCreateDraftOpen] = useState(false)
  const [isCreateTeamSpotlightOpen, setIsCreateTeamSpotlightOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [newWorkspaceType, setNewWorkspaceType] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [newDraftName, setNewDraftName] = useState("")
  const [newDraftType, setNewDraftType] = useState("note")
  const [newDraftContent, setNewDraftContent] = useState("")
  const [newDraftMediaUrl, setNewDraftMediaUrl] = useState("")
  const [activeView, setActiveView] = useState("recents")
  
  const workspaceNameInputRef = useRef(null)
  const draftNameInputRef = useRef(null)

  // Sync activeView with selectedGroupId when it changes externally (e.g., when navigating back from workspace)
  useEffect(() => {
    // Only sync if we're currently viewing a group and selectedGroupId changes
    if (selectedGroupId && activeView === selectedGroupId && groups.find(g => g.id === selectedGroupId)) {
      // Keep the view in sync
      return
    }
    // Don't override special views like recents, drafts, groups
    if (activeView === "recents" || activeView === "drafts" || activeView === "groups") {
      return
    }
    // Don't override group-drafts views
    if (activeView.startsWith("group-drafts-")) {
      return
    }
    // If we're viewing all-projects and selectedGroupId changes, update to show that group
    if (activeView === "all-projects" && selectedGroupId) {
      // Keep all-projects view
      return
    }
  }, [selectedGroupId, activeView, groups])

  // Get current group workspaces
  const currentGroupWorkspaces = useMemo(() => {
    if (activeView === "all-projects" || activeView === "drafts" || activeView.startsWith("group-drafts-")) {
      return workspaces.filter((ws) => ws.groupId === selectedGroupId)
    }
    return workspaces.filter((ws) => ws.groupId === activeView)
  }, [workspaces, activeView, selectedGroupId])

  // Get current group drafts
  const currentGroupDrafts = useMemo(() => {
    if (activeView === "drafts") {
      // In drafts view, show all drafts
      return drafts
    }
    if (activeView.startsWith("group-drafts-")) {
      // Extract groupId from view like "group-drafts-group-1"
      const groupId = activeView.replace("group-drafts-", "")
      return drafts.filter((d) => d.groupId === groupId)
    }
    // In group view, show drafts for that group
    const groupId = activeView === "all-projects" ? selectedGroupId : activeView
    return drafts.filter((d) => d.groupId === groupId)
  }, [drafts, activeView, selectedGroupId])

  // Get all workspaces (including those outside teams)
  const allWorkspaces = useMemo(() => {
    return workspaces
  }, [workspaces])

  // Calculate most accessed workspaces for current group
  const mostAccessedWorkspaces = useMemo(() => {
    if (workspaceAccessLog.length === 0) {
      // If no access log, return all workspaces from current group
      return currentGroupWorkspaces.slice(0, 6)
    }

    // Count accesses per workspace
    const accessCounts = {}
    workspaceAccessLog.forEach((log) => {
      accessCounts[log.workspaceId] = (accessCounts[log.workspaceId] || 0) + 1
    })

    // Sort by access count and get top workspaces from current group
    return currentGroupWorkspaces
      .map((ws) => ({
        ...ws,
        accessCount: accessCounts[ws.id] || 0,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 6)
  }, [currentGroupWorkspaces, workspaceAccessLog])

  // Calculate frequently accessed workspaces (all workspaces, not just current group)
  const frequentlyAccessedWorkspaces = useMemo(() => {
    if (workspaceAccessLog.length === 0) {
      return workspaces.slice(0, 8)
    }

    // Count accesses per workspace
    const accessCounts = {}
    workspaceAccessLog.forEach((log) => {
      accessCounts[log.workspaceId] = (accessCounts[log.workspaceId] || 0) + 1
    })

    // Sort by access count and get top workspaces
    return workspaces
      .map((ws) => ({
        ...ws,
        accessCount: accessCounts[ws.id] || 0,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 8)
  }, [workspaces, workspaceAccessLog])

  // Calculate hours per day for the last 7 days
  const weeklyHours = useMemo(() => {
    const days = []
    const now = new Date()
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      // Filter logs for this day
      const dayLogs = workspaceAccessLog.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= date && logDate < nextDay
      })
      
      // Calculate hours: each access represents ~2-4 hours of usage
      // Use a deterministic calculation based on access count
      let hours = 0
      dayLogs.forEach((log, idx) => {
        const hash = hashString(log.workspaceId + log.timestamp)
        const baseHours = 2 + (hash % 100) / 50 // 2-4 hours per access
        hours += baseHours
      })
      
      // Format day name
      const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm']
      const dayName = dayNames[date.getDay()]
      const dayNumber = date.getDate()
      
      days.push({
        day: dayName,
        date: dayNumber,
        hours: Math.round(hours * 10) / 10, // Round to 1 decimal
      })
    }
    
    return days
  }, [workspaceAccessLog])

  const selectedGroup = useMemo(() => {
    if (activeView === "all-projects" || activeView === "drafts") return groups.find((g) => g.id === selectedGroupId) || null
    if (activeView.startsWith("group-drafts-")) {
      const groupId = activeView.replace("group-drafts-", "")
      return groups.find((g) => g.id === groupId) || null
    }
    return groups.find((g) => g.id === activeView) || null
  }, [groups, activeView, selectedGroupId])

  // Handle view change - also update selected group
  const handleViewChange = (viewId) => {
    setActiveView(viewId)
    // If viewId is a group ID, select that group
    if (viewId !== "all-projects" && viewId !== "drafts" && viewId !== "recents" && viewId !== "groups" && !viewId.startsWith("group-drafts-") && groups.find(g => g.id === viewId)) {
      selectGroup(viewId)
    }
    // If switching to group-drafts view, extract groupId and select it
    if (viewId.startsWith("group-drafts-")) {
      const groupId = viewId.replace("group-drafts-", "")
      if (groups.find(g => g.id === groupId)) {
        selectGroup(groupId)
      }
    }
    // If switching to all-projects or drafts, keep current selectedGroupId
  }

  const handleCreateWorkspaceClick = () => {
    setIsCreateWorkspaceOpen(true)
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isCreateWorkspaceOpen) {
      setTimeout(() => {
        workspaceNameInputRef.current?.focus()
      }, 100)
      
      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          setIsCreateWorkspaceOpen(false)
          setNewWorkspaceName("")
          setNewWorkspaceType("")
        }
      }
      
      document.addEventListener("keydown", handleEscape)
      document.body.classList.add("overflow-hidden")
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.classList.remove("overflow-hidden")
      }
    }
  }, [isCreateWorkspaceOpen])

  // Handle Escape key for draft modal
  useEffect(() => {
    if (isCreateDraftOpen) {
      setTimeout(() => {
        draftNameInputRef.current?.focus()
      }, 100)
      
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          setIsCreateDraftOpen(false)
          setNewDraftName("")
          setNewDraftType("note")
          setNewDraftContent("")
          setNewDraftMediaUrl("")
        }
      }
      
      document.addEventListener("keydown", handleEscape)
      document.body.classList.add("overflow-hidden")
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.classList.remove("overflow-hidden")
      }
    }
  }, [isCreateDraftOpen])

  const canCreateWorkspace = () => {
    if (!subscription) return false
    if (subscription.plan === "enterprise") return true
    return workspaces.length < SUBSCRIPTION_PLANS[subscription.plan].maxWorkspaces
  }

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName || !newWorkspaceType) return
    
    const groupId = activeView === "all-projects" || activeView === "drafts" ? selectedGroupId : activeView
    
    createWorkspace({
      name: newWorkspaceName,
      type: newWorkspaceType,
      groupId: groupId,
    })
    
    setNewWorkspaceName("")
    setNewWorkspaceType("")
    setIsCreateWorkspaceOpen(false)
  }

  const handleSelectWorkspace = (workspaceId) => {
    selectWorkspace(workspaceId)
  }

  const handleCreateDraft = () => {
    if (!newDraftName.trim()) return

    // Determine groupId based on current view
    const groupId = activeView === "drafts" || activeView === "all-projects" 
      ? selectedGroupId 
      : activeView.startsWith("group-drafts-")
        ? activeView.replace("group-drafts-", "")
        : activeView !== "recents" && activeView !== "groups" 
          ? activeView 
          : selectedGroupId

    createDraft({
      name: newDraftName,
      type: newDraftType,
      content: newDraftContent,
      mediaUrl: newDraftMediaUrl || null,
      groupId: groupId,
    })

    setNewDraftName("")
    setNewDraftType("note")
    setNewDraftContent("")
    setNewDraftMediaUrl("")
    setIsCreateDraftOpen(false)
  }

  const handleDeleteDraft = (e, draftId) => {
    e.stopPropagation()
    deleteDraft(draftId)
  }

  const handleCreateTeamFromSpotlight = (teamName) => {
    if (!teamName.trim()) return
    createGroup({ name: teamName })
    setIsCreateTeamSpotlightOpen(false)
    setNewGroupName("")
  }

  const spotlightItems = useMemo(() => {
    if (!isCreateTeamSpotlightOpen) return []
    
    return [
      {
        id: "create-team",
        title: `Creează grup "${newGroupName || "..."}"`,
        description: newGroupName.trim() 
          ? "Apasă Enter pentru a crea grupul" 
          : "Introdu numele grupului",
        group: "Acțiuni",
        onSubmit: (teamName) => {
          if (teamName && teamName.trim()) {
            handleCreateTeamFromSpotlight(teamName)
          }
        },
      },
    ]
  }, [isCreateTeamSpotlightOpen, newGroupName])

  const renderDraftCard = (draft) => {
    const draftTypeIcons = {
      note: FileText,
      image: Image,
      media: Video,
      email: FileText,
    }
    const DraftIcon = draftTypeIcons[draft.type] || FileText

    const draftTypeLabels = {
      note: "Notiță",
      image: "Imagine",
      media: "Media",
      email: "Email",
    }

    return (
      <Card
        key={draft.id}
        className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 group overflow-hidden"
      >
        <div className="relative">
          {draft.type === "image" && draft.mediaUrl && (
            <div className="h-32 bg-muted/50 overflow-hidden">
              <img
                src={draft.mediaUrl}
                alt={draft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>
          )}
          {draft.type === "media" && draft.mediaUrl && (
            <div className="h-32 bg-muted/50 flex items-center justify-center">
              <Video className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {(draft.type === "note" || draft.type === "email") && (
            <div className="h-32 bg-muted/50 flex items-center justify-center">
              <DraftIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => handleDeleteDraft(e, draft.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold mb-1 truncate">{draft.name}</CardTitle>
              <CardDescription className="text-xs">
                {draftTypeLabels[draft.type] || draft.type}
              </CardDescription>
            </div>
          </div>
          {draft.content && draft.type === "note" && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
              {draft.content}
            </p>
          )}
          <div className="mt-3 text-xs text-muted-foreground">
            {new Date(draft.updatedAt || draft.createdAt).toLocaleDateString("ro-RO", {
              day: "numeric",
              month: "short",
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Helper function to get business-relevant stats for workspace
  const getWorkspaceStats = (workspace) => {
    const hash = hashString(workspace.id)
    const hash2 = hashString(workspace.id + "stats")
    
    switch (workspace.type) {
      case "clinica-dentara":
        return {
          label: "Pacienți",
          value: 15 + (hash % 50), // 15-65 pacienți
          secondary: `${3 + (hash2 % 5)} medici`, // 3-7 medici
          icon: "👥",
        }
      case "hotel":
        return {
          label: "Camere",
          value: 20 + (hash % 80), // 20-100 camere
          secondary: `${hash2 % 30}% ocupare`, // 0-29% ocupare
          icon: "🛏️",
        }
      case "sala-fitness":
        return {
          label: "Membri",
          value: 50 + (hash % 200), // 50-250 membri
          secondary: `${3 + (hash2 % 5)} antrenori`, // 3-7 antrenori
          icon: "💪",
        }
      case "salon":
        return {
          label: "Clienți",
          value: 30 + (hash % 100), // 30-130 clienți
          secondary: `${2 + (hash2 % 4)} angajați`, // 2-5 angajați
          icon: "✂️",
        }
      case "reparatii":
        return {
          label: "Clienți",
          value: 25 + (hash % 75), // 25-100 clienți
          secondary: `${hash2 % 40} programări`, // 0-39 programări
          icon: "🔧",
        }
      default:
        return {
          label: "Clienți",
          value: 10 + (hash % 50),
          secondary: "Activități",
          icon: "📊",
        }
    }
  }

  const renderWorkspaceCard = (workspace) => {
    return <WorkspaceCard key={workspace.id} workspace={workspace} onSelect={handleSelectWorkspace} />
  }

  const subscriptionPlan = subscription ? SUBSCRIPTION_PLANS[subscription.plan] : null
  const remainingWorkspaces = subscriptionPlan 
    ? subscriptionPlan.maxWorkspaces === -1 
      ? "nelimitat" 
      : Math.max(0, subscriptionPlan.maxWorkspaces - workspaces.length)
    : 0

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        groups={groups}
        onOpenCreateTeamSpotlight={() => setIsCreateTeamSpotlightOpen(true)}
      />

      <div className="flex-1 flex flex-col bg-background">
        {/* Header with Actions - Hidden for drafts, recents, and groups */}
        {activeView !== "drafts" && 
         !activeView.startsWith("group-drafts-") && 
         activeView !== "recents" && 
         activeView !== "groups" && (
          <DashboardHeader
            activeView={activeView}
            onViewChange={handleViewChange}
            onCreateWorkspaceClick={handleCreateWorkspaceClick}
            onCreateGroupClick={() => setIsCreateTeamSpotlightOpen(true)}
          />
        )}

        <div className="flex-1 p-8 overflow-auto">
          <div className="mx-auto max-w-7xl">

          {activeView === "recents" ? (
            <>
              {/* Weekly Hours Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Ore petrecute în aplicație</CardTitle>
                  </div>
                  <CardDescription>Ultimele 7 zile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-64">
                    {weeklyHours.map((day, index) => {
                      const maxHours = Math.max(...weeklyHours.map(d => d.hours), 1)
                      const heightPercentage = maxHours > 0 ? (day.hours / maxHours) * 100 : 0
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex flex-col items-center gap-1">
                            <div className="text-xs font-medium text-foreground">
                              {day.hours > 0 ? `${day.hours}h` : ''}
                            </div>
                            <div 
                              className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 group relative"
                              style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-t opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="text-xs font-medium text-foreground">{day.day}</div>
                            <div className="text-xs text-muted-foreground">{day.date}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total săptămână</span>
                      <span className="font-semibold">
                        {weeklyHours.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workspaces Section */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Folder className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Spații de lucru</h2>
                </div>
                {allWorkspaces.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allWorkspaces.map((workspace) => renderWorkspaceCard(workspace))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru</h3>
                      <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                        Creează primul tău spațiu de lucru pentru a începe să folosești aplicația.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Groups Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Grupuri</h2>
                </div>
                {groups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => {
                      const groupWorkspaces = workspaces.filter(ws => ws.groupId === group.id)
                      return (
                        <Card
                          key={group.id}
                          className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                          onClick={() => handleViewChange(group.id)}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                                <Folder className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                <CardDescription>
                                  {groupWorkspaces.length} {groupWorkspaces.length === 1 ? "spațiu" : "spații"} de lucru
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Users className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nu ai grupuri</h3>
                      <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                        Creează primul tău grup pentru a organiza spațiile de lucru.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : activeView === "home" || activeView === "all-projects" ? (
            <>
              {/* Workspaces Grid */}
              {currentGroupWorkspaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentGroupWorkspaces.map((workspace) => renderWorkspaceCard(workspace))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru</h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                      Creează primul tău spațiu de lucru pentru a începe să folosești aplicația.
                    </p>
                    {canCreateWorkspace() && (
                      <Button onClick={() => setIsCreateWorkspaceOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Creează spațiu de lucru
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : activeView.startsWith("group-drafts-") ? (
            /* Group Drafts View */
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">
                    Drafts din {selectedGroup?.name || "grup"}
                  </h2>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsCreateDraftOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Creează draft
                </Button>
              </div>

              {currentGroupDrafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentGroupDrafts.map((draft) => renderDraftCard(draft))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nu ai drafts în acest grup</h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                      Creează primul draft pentru acest grup pentru a salva notițe, imagini sau media.
                    </p>
                    <Button onClick={() => setIsCreateDraftOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Creează draft
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : activeView !== "drafts" && activeView !== "groups" ? (
            /* Group View */
            <>
              {/* Most Accessed Workspaces for Group */}
              {mostAccessedWorkspaces.length > 0 ? (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">Cel mai accesate</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mostAccessedWorkspaces.map((workspace) => renderWorkspaceCard(workspace))}
                  </div>
                </div>
              ) : (
                <Card className="mb-10">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru în acest grup</h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                      Creează primul spațiu de lucru pentru acest grup.
                    </p>
                    {canCreateWorkspace() && (
                      <Button onClick={() => setIsCreateWorkspaceOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Creează spațiu de lucru
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* All Workspaces Section */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Spații de lucru din {selectedGroup?.name || "grup"}
                </h2>
              </div>

              {currentGroupWorkspaces.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru în acest grup</h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                      Creează primul spațiu de lucru pentru acest grup.
                    </p>
                    {canCreateWorkspace() && (
                      <Button onClick={() => setIsCreateWorkspaceOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Creează spațiu de lucru
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentGroupWorkspaces.map((workspace) => renderWorkspaceCard(workspace))}
                </div>
              )}
            </>
          ) : null}

          {/* Drafts View */}
          {activeView === "drafts" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Drafts</h2>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsCreateDraftOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Creează draft
                </Button>
              </div>

              {currentGroupDrafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentGroupDrafts.map((draft) => renderDraftCard(draft))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nu ai drafts</h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                      Creează primul tău draft pentru a salva notițe, imagini sau media.
                    </p>
                    <Button onClick={() => setIsCreateDraftOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Creează draft
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Groups View */}
          {activeView === "groups" && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Grupuri</h2>
                </div>
                <Button 
                  onClick={() => setIsCreateTeamSpotlightOpen(true)} 
                  className="gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Creează grup
                </Button>
              </div>
              {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map((group) => {
                    const groupWorkspaces = workspaces.filter(ws => ws.groupId === group.id)
                    return (
                      <Card
                        key={group.id}
                        className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                        onClick={() => {
                          selectGroup(group.id)
                          handleViewChange("all-projects")
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                              <Folder className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <CardDescription>
                                {groupWorkspaces.length} {groupWorkspaces.length === 1 ? "spațiu" : "spații"} de lucru
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nu ai grupuri</h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                      Creează primul tău grup pentru a organiza spațiile de lucru.
                    </p>
                    <Button 
                      onClick={() => setIsCreateTeamSpotlightOpen(true)} 
                      className="gap-2"
                    >
                      <FolderPlus className="h-4 w-4" />
                      Creează grup
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Create Workspace Modal */}
          {isCreateWorkspaceOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="absolute inset-0" onClick={() => {
                setIsCreateWorkspaceOpen(false)
                setNewWorkspaceName("")
                setNewWorkspaceType("")
              }} />
              
              <div className="relative z-10 w-full max-w-md mx-4">
                <Card className="shadow-2xl border-border/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Creează proiect nou</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setIsCreateWorkspaceOpen(false)
                          setNewWorkspaceName("")
                          setNewWorkspaceType("")
                        }}
                      >
                        <span className="sr-only">Close</span>
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!canCreateWorkspace() && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          <span className="font-medium text-yellow-900 dark:text-yellow-100">Plan necesar</span>
                        </div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                          Ai atins limita de spații de lucru pentru planul tău actual. Upgrade la un plan superior pentru a crea mai multe spații de lucru.
                        </p>
                        <Button variant="outline" className="w-full">
                          Upgrade plan
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nume proiect</label>
                      <Input
                        ref={workspaceNameInputRef}
                        placeholder="ex: Clinica Dentară Centrală"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newWorkspaceName && newWorkspaceType && canCreateWorkspace()) {
                            handleCreateWorkspace()
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tip proiect</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {newWorkspaceType ? (
                              <div className="flex items-center gap-2">
                                <span>{WORKSPACE_TYPES.find(t => t.id === newWorkspaceType)?.icon}</span>
                                <span>{WORKSPACE_TYPES.find(t => t.id === newWorkspaceType)?.label}</span>
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
                              onClick={() => setNewWorkspaceType(type.id)}
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

                    {canCreateWorkspace() && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Costuri</span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Spațiu de lucru</span>
                            <span className="font-medium text-foreground">50 EUR/lună</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Utilizator adițional</span>
                            <span className="font-medium text-foreground">25 EUR/lună</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateWorkspaceOpen(false)
                          setNewWorkspaceName("")
                          setNewWorkspaceType("")
                        }}
                      >
                        Anulează
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleCreateWorkspace}
                        disabled={!newWorkspaceName || !newWorkspaceType || !canCreateWorkspace()}
                      >
                        Creează
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Create Draft Modal */}
          {isCreateDraftOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="absolute inset-0" onClick={() => {
                setIsCreateDraftOpen(false)
                setNewDraftName("")
                setNewDraftType("note")
                setNewDraftContent("")
                setNewDraftMediaUrl("")
              }} />
              
              <div className="relative z-10 w-full max-w-md mx-4">
                <Card className="shadow-2xl border-border/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Creează draft nou</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setIsCreateDraftOpen(false)
                          setNewDraftName("")
                          setNewDraftType("note")
                          setNewDraftContent("")
                          setNewDraftMediaUrl("")
                        }}
                      >
                        <span className="sr-only">Close</span>
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nume draft</label>
                      <Input
                        ref={draftNameInputRef}
                        placeholder="ex: Notițe importante"
                        value={newDraftName}
                        onChange={(e) => setNewDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newDraftName.trim()) {
                            handleCreateDraft()
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tip draft</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {newDraftType === "note" ? (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Notiță</span>
                              </div>
                            ) : newDraftType === "image" ? (
                              <div className="flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                <span>Imagine</span>
                              </div>
                            ) : newDraftType === "media" ? (
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                <span>Media</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Email</span>
                              </div>
                            )}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem
                            onClick={() => setNewDraftType("note")}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Notiță</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setNewDraftType("image")}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              <span>Imagine</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setNewDraftType("media")}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <span>Media</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setNewDraftType("email")}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Email</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {newDraftType === "note" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Conținut</label>
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          placeholder="Scrie notițele tale aici..."
                          value={newDraftContent}
                          onChange={(e) => setNewDraftContent(e.target.value)}
                        />
                      </div>
                    )}

                    {(newDraftType === "image" || newDraftType === "media") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">URL imagine/media</label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={newDraftMediaUrl}
                          onChange={(e) => setNewDraftMediaUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Introdu URL-ul imaginii sau media-ului pe care vrei să-l salvezi.
                        </p>
                      </div>
                    )}

                    {newDraftType === "email" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Conținut email</label>
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          placeholder="Scrie conținutul email-ului aici..."
                          value={newDraftContent}
                          onChange={(e) => setNewDraftContent(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Draft-ul va fi asociat cu grupul {selectedGroup?.name || "curent"} și va fi vizibil doar în acest grup.
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateDraftOpen(false)
                          setNewDraftName("")
                          setNewDraftType("note")
                          setNewDraftContent("")
                          setNewDraftMediaUrl("")
                        }}
                      >
                        Anulează
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleCreateDraft}
                        disabled={!newDraftName.trim() || (newDraftType === "image" && !newDraftMediaUrl.trim()) || (newDraftType === "media" && !newDraftMediaUrl.trim())}
                      >
                        Creează
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Create Team Spotlight */}
      <SpotlightSearch
        open={isCreateTeamSpotlightOpen}
        items={spotlightItems}
        query={newGroupName}
        onQueryChange={setNewGroupName}
        onClose={() => {
          setIsCreateTeamSpotlightOpen(false)
          setNewGroupName("")
        }}
        onSelect={(item) => {
          if (item.onSubmit) {
            item.onSubmit(newGroupName)
          } else {
            item?.onSelect?.()
          }
        }}
        placeholder="Introdu numele grupului"
      />
    </div>
  )
}

export default Dashboard

