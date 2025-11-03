import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, FileText, Image, Video, Trash2, ChevronDown } from "lucide-react"
import useWorkspaceStore from "../../store/workspaceStore"
import DashboardSidebar from "./DashboardSidebar"
import DashboardHeader from "./DashboardHeader"
import SpotlightSearch from "../SpotlightSearch"
import CreateWorkspaceModal from "./CreateWorkspaceModal"
import UpgradePlanModal from "./UpgradePlan/UpgradePlanModal"
import RecentsView from "./views/RecentsView"
import GroupsView from "./views/GroupsView"
import DraftsView from "./views/DraftsView"
import AllProjectsView from "./views/AllProjectsView"
import GroupView from "./views/GroupView"

const SUBSCRIPTION_PLANS = {
  basic: { name: "Basic", maxWorkspaces: 1, price: 50 },
  professional: { name: "Professional", maxWorkspaces: 3, price: 150 },
  enterprise: { name: "Enterprise", maxWorkspaces: -1, price: 500 }, // -1 = unlimited
}


function Dashboard() {
  const { 
    groups, 
    selectedGroupId, 
    selectGroup,
    createGroup,
    updateGroup,
    deleteGroup,
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
  const [isUpgradePlanOpen, setIsUpgradePlanOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newDraftName, setNewDraftName] = useState("")
  const [newDraftType, setNewDraftType] = useState("note")
  const [newDraftContent, setNewDraftContent] = useState("")
  const [newDraftMediaUrl, setNewDraftMediaUrl] = useState("")
  const [activeView, setActiveView] = useState("recents")
  
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

  const handleCreateWorkspace = (workspaceData) => {
    if (!workspaceData.name || !workspaceData.type) return
    
    const groupId = activeView === "all-projects" || activeView === "drafts" ? selectedGroupId : activeView
    
    createWorkspace({
      name: workspaceData.name,
      type: workspaceData.type,
      groupId: groupId,
    })
    
    setIsCreateWorkspaceOpen(false)
  }

  const handleUpgradePlanNext = (option) => {
    // Handle the upgrade flow - option will be "just-me" or "team"
    console.log("Upgrade option selected:", option)
    setIsUpgradePlanOpen(false)
    // TODO: Implement the actual upgrade flow
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

      <div className="flex-1 flex flex-col bg-background h-screen overflow-hidden">
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

          {activeView === "recents" && (
            <RecentsView
              workspaces={workspaces}
              groups={groups}
              workspaceAccessLog={workspaceAccessLog}
              onSelectWorkspace={handleSelectWorkspace}
              onViewChange={handleViewChange}
            />
          )}

          {(activeView === "home" || activeView === "all-projects") && (
            <AllProjectsView
              workspaces={currentGroupWorkspaces}
              onSelectWorkspace={handleSelectWorkspace}
              onCreateWorkspaceClick={() => setIsCreateWorkspaceOpen(true)}
              canCreateWorkspace={canCreateWorkspace()}
            />
          )}

          {activeView.startsWith("group-drafts-") && (
            <DraftsView
              drafts={currentGroupDrafts}
              selectedGroup={selectedGroup}
              onCreateDraftClick={() => setIsCreateDraftOpen(true)}
              onDeleteDraft={handleDeleteDraft}
            />
          )}

          {activeView !== "drafts" && 
           activeView !== "groups" && 
           activeView !== "recents" && 
           activeView !== "all-projects" && 
           activeView !== "home" && 
           !activeView.startsWith("group-drafts-") && (
            <GroupView
              workspaces={currentGroupWorkspaces}
              selectedGroup={selectedGroup}
              workspaceAccessLog={workspaceAccessLog}
              onSelectWorkspace={handleSelectWorkspace}
              onCreateWorkspaceClick={() => setIsCreateWorkspaceOpen(true)}
              canCreateWorkspace={canCreateWorkspace()}
            />
          )}

          {activeView === "drafts" && (
            <DraftsView
              drafts={currentGroupDrafts}
              selectedGroup={null}
              onCreateDraftClick={() => setIsCreateDraftOpen(true)}
              onDeleteDraft={handleDeleteDraft}
            />
          )}

          {activeView === "groups" && (
            <GroupsView
              groups={groups}
              workspaces={workspaces}
              onViewChange={handleViewChange}
              onCreateGroupClick={() => setIsCreateTeamSpotlightOpen(true)}
            />
          )}

          {/* Create Workspace Modal */}
          <CreateWorkspaceModal
            open={isCreateWorkspaceOpen}
            onClose={() => setIsCreateWorkspaceOpen(false)}
            onCreateWorkspace={handleCreateWorkspace}
            canCreateWorkspace={canCreateWorkspace()}
            onUpgradeClick={() => {
              setIsCreateWorkspaceOpen(false)
              setIsUpgradePlanOpen(true)
            }}
          />

          {/* Upgrade Plan Modal */}
          <UpgradePlanModal
            open={isUpgradePlanOpen}
            onClose={() => setIsUpgradePlanOpen(false)}
            onNext={handleUpgradePlanNext}
          />

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

