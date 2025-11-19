import { useWorkflowEditorStore } from '../store/useWorkflowEditorStore'
import SelectTrigger from './editorToolbar/SelectTrigger'
import EditTrigger from './editorToolbar/EditTrigger'
import CreateRecord from './editorToolbar/CreateRecord'
import NextStepLibrary from './editorToolbar/NextStepLibrary'
import SwitchEditor from './editorToolbar/Switch'
import './EditorToolbar.css'

function EditorToolbar({
  onNextStepSelect,
  selectedNode,
  nodesById,
  onSwitchAddBranch,
  onSwitchConditionChange,
  onUpdateNodeDescription,
}) {
  const selectedTriggerId = useWorkflowEditorStore((state) => state.selectedTriggerId)
  const activePanel = useWorkflowEditorStore((state) => state.activePanel)

  const hasTrigger = Boolean(selectedTriggerId)
  const panel = !hasTrigger ? 'select-trigger' : activePanel

  return (
    <aside className="editor-toolbar" aria-label="Trigger panel">
      {panel === 'select-trigger' ? <SelectTrigger /> : null}
      {panel === 'edit-trigger' && hasTrigger ? <EditTrigger /> : null}
      {panel === 'create-record' && hasTrigger ? <CreateRecord /> : null}
      {panel === 'next-step-library' && hasTrigger ? (
        <NextStepLibrary onSelect={onNextStepSelect} />
      ) : null}
      {panel === 'switch' && hasTrigger && selectedNode ? (
        <SwitchEditor
          node={selectedNode}
          nodesById={nodesById}
          onAddBranch={onSwitchAddBranch}
          onConditionChange={onSwitchConditionChange}
          onChangeDescription={onUpdateNodeDescription}
        />
      ) : null}
    </aside>
  )
}

EditorToolbar.defaultProps = {
  onNextStepSelect: undefined,
  selectedNode: null,
  nodesById: {},
  onSwitchAddBranch: undefined,
  onSwitchConditionChange: undefined,
  onUpdateNodeDescription: undefined,
}

export default EditorToolbar