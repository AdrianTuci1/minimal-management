import { ToggleLeft } from 'lucide-react'
import { useMemo } from 'react'
import { useWorkflowEditorStore } from '../../store/useWorkflowEditorStore'

function SwitchEditor({ node, nodesById, onChangeDescription, onAddBranch, onConditionChange }) {
  const setActivePanel = useWorkflowEditorStore((state) => state.setActivePanel)

  const conditionBranches = node.branches?.filter((branch) => branch.type === 'condition') ?? []
  const defaultBranch = node.branches?.find((branch) => branch.type === 'default') ?? null

  const branchSummaries = useMemo(() => {
    const lookup = nodesById ?? {}

    if (!node.branches) {
      return []
    }

    return node.branches.map((branch) => {
      const target = branch.targetId ? lookup[branch.targetId] ?? null : null
      return {
        id: branch.id,
        label: branch.label,
        type: branch.type,
        targetTitle: target ? target.title : 'Add next step',
        targetVariant: target ? target.variant : 'add',
      }
    })
  }, [node.branches, nodesById])

  const handleChange = (event) => {
    if (typeof onChangeDescription === 'function') {
      onChangeDescription(node.id, event.target.value)
    }
  }

  const handleAddBranchClick = () => {
    if (typeof onAddBranch === 'function') {
      onAddBranch(node.id)
    }
  }

  return (
    <>
      <header className="editor-toolbar__detail-header editor-toolbar__detail-header--condition">
        <div className="editor-toolbar__detail-icon editor-toolbar__detail-icon--condition" aria-hidden="true">
          <ToggleLeft className="editor-toolbar__detail-icon-symbol" />
        </div>
        <div className="editor-toolbar__detail-headings">
          <span className="editor-toolbar__detail-chip editor-toolbar__detail-chip--condition">Conditions</span>
          <h2 className="editor-toolbar__detail-title">{node.title}</h2>
          <p className="editor-toolbar__description">Route outcomes across multiple branches.</p>
        </div>
        <button
          type="button"
          className="editor-toolbar__detail-change"
          onClick={() => setActivePanel('next-step-library')}
        >
          Change
        </button>
      </header>

      <section className="editor-toolbar__section editor-toolbar__section--flush">
        <label className="editor-toolbar__field editor-toolbar__field--stack">
          <span className="editor-toolbar__field-label">Description</span>
          <textarea
            className="editor-toolbar__textarea"
            placeholder="Add a description..."
            value={node.description ?? ''}
            onChange={handleChange}
          />
        </label>
      </section>

      <section className="editor-toolbar__section">
        <header className="editor-toolbar__section-header">
          <h3 className="editor-toolbar__section-title">Inputs</h3>
        </header>

        <div className="editor-toolbar__switch-conditions">
          {conditionBranches.map((branch, index) => (
            <div key={branch.id} className="editor-toolbar__switch-condition">
              <label className="editor-toolbar__field editor-toolbar__field--stack">
                <span className="editor-toolbar__field-label">{branch.label ?? `Condition ${index + 1}`}</span>
                <div className="editor-toolbar__input editor-toolbar__input--text">
                  <input
                    className="editor-toolbar__input-field"
                    type="text"
                    placeholder="Describe the condition..."
                    value={branch.condition ?? ''}
                    onChange={(event) =>
                      typeof onConditionChange === 'function' &&
                      onConditionChange(node.id, branch.id, event.target.value)
                    }
                  />
                </div>
              </label>
            </div>
          ))}

          <button
            type="button"
            className="editor-toolbar__inline-button editor-toolbar__inline-button--add"
            onClick={handleAddBranchClick}
          >
            Add filter
          </button>
        </div>
      </section>

      <section className="editor-toolbar__section">
        <header className="editor-toolbar__section-header">
          <h3 className="editor-toolbar__section-title">Next step</h3>
          <p className="editor-toolbar__section-hint">Add the next block in this workflow.</p>
        </header>

        <div className="editor-toolbar__switch-tree">
          <div className="editor-toolbar__switch-root">
            <div className="editor-toolbar__switch-root-icon" aria-hidden="true">
              <ToggleLeft size={16} strokeWidth={2} />
            </div>
            <span className="editor-toolbar__switch-root-label">{node.title}</span>
          </div>
          <div className="editor-toolbar__switch-branches">
            {branchSummaries.map((branch) => (
              <div key={branch.id} className="editor-toolbar__switch-branch">
                <div className="editor-toolbar__switch-branch-rail" aria-hidden="true" />
                <div className="editor-toolbar__switch-branch-body">
                  <span className="editor-toolbar__switch-branch-label">{branch.label}</span>
                  <div className="editor-toolbar__switch-branch-target">
                    <span className="editor-toolbar__switch-branch-target-icon" aria-hidden="true">
                      {branch.targetVariant === 'add' ? '+' : '◎'}
                    </span>
                    <span className="editor-toolbar__switch-branch-target-text">{branch.targetTitle}</span>
                  </div>
                </div>
              </div>
            ))}
            {defaultBranch ? null : (
              <div className="editor-toolbar__switch-branch editor-toolbar__switch-branch--placeholder">
                <div className="editor-toolbar__switch-branch-body">
                  <span className="editor-toolbar__switch-branch-label">Default</span>
                  <div className="editor-toolbar__switch-branch-target">
                    <span className="editor-toolbar__switch-branch-target-icon" aria-hidden="true">
                      +
                    </span>
                    <span className="editor-toolbar__switch-branch-target-text">Add next step</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default SwitchEditor


