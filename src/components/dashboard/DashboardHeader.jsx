import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, FolderPlus, Share2, Grid3x3, List, Users } from "lucide-react"
import useWorkspaceStore from "../../store/workspaceStore"

const DashboardHeader = ({ 
  activeView, 
  onViewChange, 
  onCreateWorkspaceClick,
  onCreateGroupClick 
}) => {
  const { groups, selectedGroupId, selectGroup } = useWorkspaceStore()
  
  const selectedGroup = groups.find(g => g.id === selectedGroupId)

  const handleGroupSelect = (groupId) => {
    // When selecting a group from header, update view to show that group's workspaces
    onViewChange?.(groupId)
  }

  return (
    <div className="border-b border-border/60 bg-background px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 text-2xl font-semibold gap-2 hover:bg-transparent">
                  {selectedGroup ? `${selectedGroup.name}'s team` : "Team"}
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() => handleGroupSelect(group.id)}
                  >
                    {group.name}'s team
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateGroupClick}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Creează grup</span>
          </Button>
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

