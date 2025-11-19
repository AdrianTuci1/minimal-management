import { ListTree, Plus } from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'

function ViewTopbar() {
  const setActiveWorkflowId = useWorkflowStore((state) => state.setActiveWorkflowId)

  return (
    <header className="workflow-view__topbar">
      <div className="workflow-view__title">
        <ListTree size={16} />
        <span>Workflow-uri</span>
      </div>
      <button
        type="button"
        className="workflow-view__create"
        onClick={() => setActiveWorkflowId('new-workflow')}
      >
        <Plus size={16} />
        <span>Creează workflow</span>
      </button>
    </header>
  )
}

export default ViewTopbar

