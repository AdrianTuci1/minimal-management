import { useMemo } from "react"
import Dashboard from "./components/dashboard/Dashboard"
import WorkspaceView from "./components/views/WorkspaceView"
import useWorkspaceStore from "./store/workspaceStore"
import { GlobalDropdownBackdrop } from "./components/ui/dropdown-menu"

function App() {
  const { selectedWorkspaceId, workspaces } = useWorkspaceStore()

  const selectedWorkspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === selectedWorkspaceId) || null
  }, [workspaces, selectedWorkspaceId])

  // If no workspace is selected, show the dashboard
  if (!selectedWorkspace) {
    return (
      <>
        <Dashboard />
        <GlobalDropdownBackdrop />
      </>
    )
  }

  // Otherwise, show the workspace view
  return (
    <>
      <WorkspaceView workspace={selectedWorkspace} />
      <GlobalDropdownBackdrop />
    </>
  )
}

export default App
