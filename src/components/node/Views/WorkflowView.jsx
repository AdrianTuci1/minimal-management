import ViewTopbar from '../components/ViewTopbar'
import { useWorkflowStore } from '../store/useWorkflowStore'
import WorkflowEditor from './WorkflowEditor'
import './WorkflowView.css'

function WorkflowView() {
  const workflows = useWorkflowStore((state) => state.workflows)
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId)
  const setActiveWorkflowId = useWorkflowStore((state) => state.setActiveWorkflowId)

  if (activeWorkflowId) {
    return <WorkflowEditor />
  }

  return (
    <div className="workflow-view">
      <ViewTopbar />

      <section className="workflow-view__content">
        <p className="workflow-view__description">
          Gestionează și editează automatizările din contul tău.
        </p>

        <ul className="workflow-list">
          {workflows.map((workflow) => (
            <li key={workflow.id}>
              <button
                type="button"
                className="workflow-item"
                onClick={() => setActiveWorkflowId(workflow.id)}
              >
                <div className="workflow-item__main">
                  <span className="workflow-item__name">{workflow.name}</span>
                  <span className="workflow-item__status">{workflow.status}</span>
                </div>
                <p className="workflow-item__description">{workflow.description}</p>
                <span className="workflow-item__meta">
                  Ultima actualizare: {workflow.updatedAt}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default WorkflowView

