import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import WorkspaceCard from "../WorkspaceCard"

function AllProjectsView({ workspaces, onSelectWorkspace, onCreateWorkspaceClick, canCreateWorkspace }) {
  return (
    <>
      {/* Workspaces Grid */}
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} onSelect={onSelectWorkspace} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              Creează primul tău spațiu de lucru pentru a începe să folosești aplicația.
            </p>
            {canCreateWorkspace && (
              <Button onClick={onCreateWorkspaceClick} className="gap-2">
                <Plus className="h-4 w-4" />
                Creează spațiu de lucru
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default AllProjectsView

