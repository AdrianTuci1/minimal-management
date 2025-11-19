import { ArrowLeft, History, Pencil, Settings2 } from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'

const NAV_ITEMS = [
  { id: 'editor', label: 'Editor', icon: Pencil },
  { id: 'runs', label: 'Runs', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings2 },
]

function EditorTopbar() {
  const hasActiveWorkflow = useWorkflowStore((state) => state.activeWorkflowId !== null)
  const workflowStatus = useWorkflowStore((state) => state.getActiveWorkflow()?.status ?? 'Draft')
  const activeTab = useWorkflowStore((state) => state.activeWorkflowTab)
  const setActiveWorkflowId = useWorkflowStore((state) => state.setActiveWorkflowId)
  const setActiveWorkflowTab = useWorkflowStore((state) => state.setActiveWorkflowTab)
  const isWorkflowEnabled = useWorkflowStore((state) => state.isWorkflowEnabled)
  const toggleWorkflowEnabled = useWorkflowStore((state) => state.toggleWorkflowEnabled)

  const handleBack = () => {
    setActiveWorkflowId(null)
  }

  return (
    <header className="workflow-editor__header">
      <div className="workflow-editor__section workflow-editor__section--left">
        {hasActiveWorkflow && (
          <button
            type="button"
            className="workflow-editor__back"
            onClick={handleBack}
            aria-label="Înapoi la workflow-uri"
          >
            <ArrowLeft size={16} />
            <span>Înapoi</span>
          </button>
        )}

        <nav className="workflow-editor__nav" aria-label="Workflow sections">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`workflow-editor__nav-item ${
                activeTab === id ? 'is-active' : ''
              }`}
              onClick={() => setActiveWorkflowTab(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="workflow-editor__section workflow-editor__section--right">
        <span className="workflow-editor__status-chip">{workflowStatus}</span>
        <button
          type="button"
          className={`workflow-editor__switch ${isWorkflowEnabled ? 'is-on' : 'is-off'}`}
          onClick={toggleWorkflowEnabled}
          aria-pressed={isWorkflowEnabled}
          aria-label={isWorkflowEnabled ? 'Dezactivează workflow-ul' : 'Activează workflow-ul'}
        >
          <span className="workflow-editor__switch-handle" />
        </button>
      </div>
    </header>
  )
}

export default EditorTopbar

