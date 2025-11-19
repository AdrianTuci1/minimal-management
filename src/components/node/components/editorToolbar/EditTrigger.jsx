import {
  CalendarClock,
  CheckSquare2,
  Command,
  List,
  ListChecks,
  ListPlus,
  Pencil,
  PlayCircle,
  PlusCircle,
  Tag,
  Webhook,
} from 'lucide-react'
import {
  TRIGGER_MAP,
  TRIGGER_OBJECT_OPTIONS,
} from '../../constants/triggers'
import { useWorkflowEditorStore } from '../../store/useWorkflowEditorStore'

const ICON_COMPONENTS = {
  CalendarClock,
  CheckSquare2,
  Command,
  List,
  ListChecks,
  ListPlus,
  Pencil,
  PlayCircle,
  PlusCircle,
  Tag,
  Webhook,
}

function EditTrigger() {
  const selectedTriggerId = useWorkflowEditorStore((state) => state.selectedTriggerId)
  const triggerDescription = useWorkflowEditorStore((state) => state.triggerDescription)
  const triggerObjectId = useWorkflowEditorStore((state) => state.triggerObjectId)
  const setTriggerDescription = useWorkflowEditorStore((state) => state.setTriggerDescription)
  const setTriggerObjectId = useWorkflowEditorStore((state) => state.setTriggerObjectId)
  const clearSelectedTrigger = useWorkflowEditorStore((state) => state.clearSelectedTrigger)
  const setActivePanel = useWorkflowEditorStore((state) => state.setActivePanel)

  if (!selectedTriggerId) return null

  const triggerDefinition = TRIGGER_MAP[selectedTriggerId] ?? null
  if (!triggerDefinition) return null

  const Icon = triggerDefinition.iconKey ? ICON_COMPONENTS[triggerDefinition.iconKey] : null

  const handleChangeTrigger = () => {
    clearSelectedTrigger()
    setActivePanel('select-trigger')
  }

  return (
    <>
      <header className="editor-toolbar__detail-header">
        <div className="editor-toolbar__detail-icon" aria-hidden="true">
          {Icon ? (
            <Icon className="editor-toolbar__detail-icon-symbol" />
          ) : (
            <span className="editor-toolbar__detail-icon-fallback">◎</span>
          )}
        </div>
        <div className="editor-toolbar__detail-headings">
          <span className="editor-toolbar__detail-chip">{triggerDefinition.groupTitle}</span>
          <h2 className="editor-toolbar__detail-title">{triggerDefinition.label}</h2>
          <p className="editor-toolbar__description">{triggerDefinition.description}</p>
        </div>
        <button
          type="button"
          className="editor-toolbar__detail-change"
          onClick={handleChangeTrigger}
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
            value={triggerDescription}
            onChange={(event) => setTriggerDescription(event.target.value)}
          />
        </label>
      </section>

      <section className="editor-toolbar__section">
        <header className="editor-toolbar__section-header">
          <h3 className="editor-toolbar__section-title">Inputs</h3>
        </header>
        <label className="editor-toolbar__field editor-toolbar__field--stack">
          <span className="editor-toolbar__field-label">Object</span>
          <select
            className="editor-toolbar__select"
            value={triggerObjectId}
            onChange={(event) => setTriggerObjectId(event.target.value)}
          >
            {TRIGGER_OBJECT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="editor-toolbar__section">
        <header className="editor-toolbar__section-header">
          <h3 className="editor-toolbar__section-title">Next step</h3>
          <p className="editor-toolbar__section-hint">Add the next block in this workflow.</p>
        </header>
        <div className="editor-toolbar__next-list">
          <div className="editor-toolbar__next-item editor-toolbar__next-item--primary">
            <span className="editor-toolbar__next-item-label">{triggerDefinition.label}</span>
            <span className="editor-toolbar__next-item-sub">Trigger</span>
          </div>
          <button type="button" className="editor-toolbar__next-button">
            <span className="editor-toolbar__next-button-symbol" aria-hidden="true">
              +
            </span>
            <span className="editor-toolbar__next-button-label">Add step</span>
          </button>
        </div>
      </section>
    </>
  )
}

export default EditTrigger


