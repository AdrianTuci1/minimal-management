import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, FolderPlus, Share2, Grid3x3, List, Users, Settings, Copy, Pencil, ImageIcon, Trash2 } from "lucide-react"
import useWorkspaceStore from "../../store/workspaceStore"

const DashboardHeader = ({ 
  activeView, 
  onViewChange, 
  onCreateWorkspaceClick,
  onCreateGroupClick 
}) => {
  const { groups, selectedGroupId, selectGroup, updateGroup, deleteGroup, createGroup, createWorkspace, workspaces } = useWorkspaceStore()
  
  const selectedGroup = groups.find(g => g.id === selectedGroupId)

  const handleGroupSelect = (groupId) => {
    // When selecting a group from header, update view to show that group's workspaces
    onViewChange?.(groupId)
  }

  // Debug: check if we should hide the button
  const shouldHideCreateGroupButton = activeView === "groups" || String(activeView) === "groups"

  return (
    <div className="border-b border-border/60 bg-background px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 text-2xl font-semibold gap-2 hover:bg-transparent">
                  {selectedGroup ? `${selectedGroup.name}'s grup` : "Grup"}
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() => handleGroupSelect(group.id)}
                  >
                    {group.name}'s grup
                  </DropdownMenuItem>
                ))}
                {selectedGroup && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      // TODO: Implement view members
                    }}>
                      <Users className="h-4 w-4 mr-2" />
                      Vezi membrii
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      // TODO: Implement view settings
                    }}>
                      <Settings className="h-4 w-4 mr-2" />
                      Vezi setări
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      // Copy group
                      const copiedWorkspaces = workspaces.filter(ws => ws.groupId === selectedGroup.id)
                      createGroup({ 
                        name: `${selectedGroup.name} (copie)`,
                        memberCount: selectedGroup.memberCount || 1
                      })
                      // Get the newly created group ID from store
                      setTimeout(() => {
                        const store = useWorkspaceStore.getState()
                        const newGroupId = store.selectedGroupId
                        copiedWorkspaces.forEach(ws => {
                          createWorkspace({
                            name: ws.name,
                            type: ws.type,
                            groupId: newGroupId,
                            logo: ws.logo
                          })
                        })
                      }, 100)
                    }}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiază
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      const newName = prompt("Redenumește grupul:", selectedGroup.name)
                      if (newName && newName.trim() && newName !== selectedGroup.name) {
                        updateGroup(selectedGroup.id, { name: newName.trim() })
                      }
                    }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Redenumește
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      const newIcon = prompt("Introdu iconul (emoji sau text):", "")
                      if (newIcon && newIcon.trim()) {
                        updateGroup(selectedGroup.id, { icon: newIcon.trim() })
                      }
                    }}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Schimbă icon
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        if (confirm(`Ești sigur că vrei să ștergi grupul "${selectedGroup.name}"?`)) {
                          deleteGroup(selectedGroup.id)
                        }
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Șterge
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onCreateWorkspaceClick}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Sort and View Options */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              Last modified
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Last modified</DropdownMenuItem>
            <DropdownMenuItem>Name</DropdownMenuItem>
            <DropdownMenuItem>Created</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1 border border-border rounded-md p-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader

