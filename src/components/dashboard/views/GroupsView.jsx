import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Users, FolderPlus, Folder, MoreVertical, Settings, Copy, Pencil, ImageIcon, Trash2 } from "lucide-react"
import useWorkspaceStore from "../../../store/workspaceStore"

function GroupsView({ groups, workspaces, onViewChange, onCreateGroupClick }) {
  const { selectGroup, createGroup, updateGroup, deleteGroup, createWorkspace } = useWorkspaceStore()

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Grupuri</h2>
        </div>
        <Button 
          onClick={onCreateGroupClick} 
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
                className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 group relative"
                onClick={() => {
                  selectGroup(group.id)
                  onViewChange("all-projects")
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement view members
                        }}>
                          <Users className="h-4 w-4 mr-2" />
                          Vezi membrii
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement view settings
                        }}>
                          <Settings className="h-4 w-4 mr-2" />
                          Vezi setări
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          // Copy group
                          const copiedWorkspaces = workspaces.filter(ws => ws.groupId === group.id)
                          createGroup({ 
                            name: `${group.name} (copie)`,
                            memberCount: group.memberCount || 1
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
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          const newName = prompt("Redenumește grupul:", group.name)
                          if (newName && newName.trim() && newName !== group.name) {
                            updateGroup(group.id, { name: newName.trim() })
                          }
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Redenumește
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          const newIcon = prompt("Introdu iconul (emoji sau text):", "")
                          if (newIcon && newIcon.trim()) {
                            updateGroup(group.id, { icon: newIcon.trim() })
                          }
                        }}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Schimbă icon
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Ești sigur că vrei să ștergi grupul "${group.name}"?`)) {
                              deleteGroup(group.id)
                            }
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Șterge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              onClick={onCreateGroupClick} 
              className="gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              Creează grup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GroupsView

