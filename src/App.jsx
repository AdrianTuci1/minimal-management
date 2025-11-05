import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import Dashboard from "./components/dashboard/Dashboard"
import WorkspaceView from "./components/views/WorkspaceView"
import ClientView from "./components/views/ClientView"
import useWorkspaceStore from "./store/workspaceStore"
import { GlobalDropdownBackdrop } from "./components/ui/dropdown-menu"
import { useMemo, useEffect } from "react"

// Wrapper component for WorkspaceView that gets workspace from route
function WorkspaceViewWrapper() {
  const { workspaceId } = useParams()
  const { workspaces, selectWorkspace } = useWorkspaceStore()

  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  // Sync route with store when workspace is found
  useEffect(() => {
    if (workspace && workspaceId) {
      selectWorkspace(workspaceId)
    }
  }, [workspace, workspaceId, selectWorkspace])

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Workspace-ul nu a fost găsit</h1>
          <p className="text-muted-foreground">Workspace-ul cu ID-ul {workspaceId} nu există.</p>
        </div>
      </div>
    )
  }

  return <WorkspaceView workspace={workspace} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Dashboard />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId" element={
          <>
            <WorkspaceViewWrapper />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/client" element={
          <>
            <ClientView />
            <GlobalDropdownBackdrop />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
