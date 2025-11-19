import { FilePlus, PlusCircle } from 'lucide-react'
import { useWorkflowEditorStore } from '../../store/useWorkflowEditorStore'

function CreateRecord() {
  const setActivePanel = useWorkflowEditorStore((state) => state.setActivePanel)

  const handleBackToTrigger = () => {
    setActivePanel('edit-trigger')
  }

  return (
    <>
      <header className="editor-toolbar__detail-header editor-toolbar__detail-header--action">
        <div className="editor-toolbar__detail-icon" aria-hidden="true">
          <FilePlus className="editor-toolbar__detail-icon-symbol" />
        </div>
        <div className="editor-toolbar__detail-headings">
          <span className="editor-toolbar__detail-chip editor-toolbar__detail-chip--muted">Records</span>
          <h2 className="editor-toolbar__detail-title">Create record</h2>
          <p className="editor-toolbar__description">
            Create a CRM record using values from this workflow.
          </p>
        </div>
        <button
          type="button"
          className="editor-toolbar__detail-change"
          onClick={handleBackToTrigger}
        >
          Change
        </button>
      </header>

      <section className="editor-toolbar__section editor-toolbar__section--flush">
        <label className="editor-toolbar__field editor-toolbar__field--stack">
          <span className="editor-toolbar__field-label">Description</span>
          <textarea className="editor-toolbar__textarea" placeholder="Add a description..." />
        </label>
      </section>

      <section className="editor-toolbar__section">
        <header className="editor-toolbar__section-header">
          <h3 className="editor-toolbar__section-title">Inputs</h3>
        </header>

        <div className="editor-toolbar__form">
          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <span className="editor-toolbar__field-label">Object</span>
              <div className="editor-toolbar__input editor-toolbar__input--select">
                <span>Deals</span>
              </div>
            </label>
          </div>

          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <span className="editor-toolbar__field-label">Deal name</span>
              <div className="editor-toolbar__input editor-toolbar__input--token">
                <span className="editor-toolbar__token">{'{ Record > Name }'}</span>
              </div>
              <button type="button" className="editor-toolbar__inline-button">
                Insert variable
              </button>
            </label>
          </div>

          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <span className="editor-toolbar__field-label">Deal stage</span>
              <div className="editor-toolbar__input editor-toolbar__input--select">
                <span>Qualification</span>
                <button type="button" className="editor-toolbar__pill-action">
                  Clear
                </button>
              </div>
              <button type="button" className="editor-toolbar__inline-button">
                Use variable
              </button>
            </label>
          </div>

          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <span className="editor-toolbar__field-label">Deal owner</span>
              <div className="editor-toolbar__input editor-toolbar__input--avatar">
                <span className="editor-toolbar__avatar">TB</span>
                <span>Triggered by</span>
                <button type="button" className="editor-toolbar__pill-action">
                  Clear
                </button>
              </div>
              <button type="button" className="editor-toolbar__inline-button">
                Use variable
              </button>
            </label>
          </div>

          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <div className="editor-toolbar__field-heading">
                <span className="editor-toolbar__field-label">Deal value</span>
                <span className="editor-toolbar__field-optional">Optional</span>
              </div>
              <div className="editor-toolbar__input editor-toolbar__input--empty">
                <span>Use variable</span>
              </div>
            </label>
          </div>

          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <div className="editor-toolbar__field-heading">
                <span className="editor-toolbar__field-label">Associated people</span>
                <span className="editor-toolbar__field-optional">Optional</span>
              </div>
              <button type="button" className="editor-toolbar__combo-button">
                <PlusCircle className="editor-toolbar__combo-button-icon" />
                Use variable
              </button>
            </label>
          </div>

          <div className="editor-toolbar__form-row">
            <label className="editor-toolbar__field editor-toolbar__field--stack">
              <div className="editor-toolbar__field-heading">
                <span className="editor-toolbar__field-label">Associated company</span>
                <span className="editor-toolbar__field-optional">Optional</span>
              </div>
              <div className="editor-toolbar__input editor-toolbar__input--token">
                <span className="editor-toolbar__token">Record</span>
                <button type="button" className="editor-toolbar__pill-action">
                  Clear
                </button>
              </div>
            </label>
          </div>
        </div>
      </section>

      <footer className="editor-toolbar__footer">
        <button type="button" className="editor-toolbar__footer-button editor-toolbar__footer-button--primary">
          Refresh block
        </button>
        <button type="button" className="editor-toolbar__footer-button editor-toolbar__footer-button--danger">
          Delete block
        </button>
      </footer>
    </>
  )
}

export default CreateRecord


