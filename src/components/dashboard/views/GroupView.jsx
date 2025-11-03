import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Building2, Plus } from "lucide-react"
import WorkspaceCard from "../WorkspaceCard"

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

function GroupView({ workspaces, selectedGroup, workspaceAccessLog, onSelectWorkspace, onCreateWorkspaceClick, canCreateWorkspace }) {
  // Calculate most accessed workspaces for current group
  const mostAccessedWorkspaces = useMemo(() => {
    if (workspaceAccessLog.length === 0) {
      // If no access log, return all workspaces from current group
      return workspaces.slice(0, 6)
    }

    // Count accesses per workspace
    const accessCounts = {}
    workspaceAccessLog.forEach((log) => {
      accessCounts[log.workspaceId] = (accessCounts[log.workspaceId] || 0) + 1
    })

    // Sort by access count and get top workspaces from current group
    return workspaces
      .map((ws) => ({
        ...ws,
        accessCount: accessCounts[ws.id] || 0,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 6)
  }, [workspaces, workspaceAccessLog])

  return (
    <>
      {/* Most Accessed Workspaces for Group */}
      {mostAccessedWorkspaces.length > 0 ? (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Cel mai accesate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostAccessedWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} onSelect={onSelectWorkspace} />
            ))}
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
            {canCreateWorkspace && (
              <Button onClick={onCreateWorkspaceClick} className="gap-2">
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

      {workspaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru în acest grup</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              Creează primul spațiu de lucru pentru acest grup.
            </p>
            {canCreateWorkspace && (
              <Button onClick={onCreateWorkspaceClick} className="gap-2">
                <Plus className="h-4 w-4" />
                Creează spațiu de lucru
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} onSelect={onSelectWorkspace} />
          ))}
        </div>
      )}
    </>
  )
}

export default GroupView

