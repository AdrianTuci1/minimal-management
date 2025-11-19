import { useEffect, useRef, useState } from 'react'
import EditorTopbar from '../components/EditorTopbar'
import FlowCanvas from '../components/FlowCanvas'
import FlowEdges from '../components/FlowEdges'
import FlowAnchors from '../components/FlowAnchors'
import FlowNode from '../components/FlowNode'
import BottomBar from '../components/BottomBar'
import PanManager from '../utils/panManager'
import EditorToolbar from '../components/EditorToolbar'
import { TRIGGER_MAP } from '../constants/triggers'
import { useWorkflowEditorStore } from '../store/useWorkflowEditorStore'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/layout'
import { useWorkflowGraph } from '../hooks/useWorkflowGraph'
import './WorkflowEditor.css'

function WorkflowEditor() {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const viewportRef = useRef(null)
  const selectedTriggerId = useWorkflowEditorStore((state) => state.selectedTriggerId)
  const triggerDefinition = selectedTriggerId ? TRIGGER_MAP[selectedTriggerId] ?? null : null

  const {
    nodes,
    edges,
    connectionAnchors,
    nodesWithAddControl,
    getHalfSize,
    handleNodeDrag,
    handleNodeClick,
    handleNodeContextMenu,
    handleEdgeContextMenu,
    handleAnchorDragStart,
    handleAnchorDragMove,
    handleAnchorDragEnd,
    handleAddNode,
    handleNextStepSelect,
    shouldAttachHandlers,
    selectedNodeId,
    selectedNode,
    nodesById,
    handleSwitchAddBranch,
    handleSwitchConditionChange,
    handleNodeDescriptionChange,
  } = useWorkflowGraph(triggerDefinition)

  useEffect(() => {
    if (!viewportRef.current) return undefined
    const manager = new PanManager(viewportRef.current, setPan)
    return () => manager.destroy()
  }, [])

  return (
    <div className="workflow-editor">
      <EditorTopbar />

      <div className="app" role="application">
        <div className="workflow-editor__surface">
          <div
            className="flow-viewport"
            ref={viewportRef}
            style={{ cursor: 'grab' }}
            aria-label="Workflow canvas"
          >
            <FlowCanvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} pan={pan}>
              <FlowEdges
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                edges={edges}
                onEdgeContextMenu={handleEdgeContextMenu}
              />
              {nodes.map((node) => {
                const isInteractive = shouldAttachHandlers(node)
                const isSelected = node.id === selectedNodeId
                const canShowAddControl = nodesWithAddControl.has(node.id)

                return (
                  <FlowNode
                    key={node.id}
                    node={node}
                    size={getHalfSize()}
                    onClick={isInteractive ? handleNodeClick : undefined}
                    panLock={isInteractive}
                    onContextMenu={handleNodeContextMenu}
                    onDrag={isInteractive ? handleNodeDrag : undefined}
                    showAddControl={canShowAddControl && isSelected}
                    onAddClick={handleAddNode}
                    isSelected={isSelected}
                  />
                )
              })}
              <FlowAnchors
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                edges={edges}
                anchors={connectionAnchors}
                onAnchorDragStart={handleAnchorDragStart}
                onAnchorDragMove={handleAnchorDragMove}
                onAnchorDragEnd={handleAnchorDragEnd}
              />
            </FlowCanvas>
          </div>
          <BottomBar />
        </div>
        <EditorToolbar
          onNextStepSelect={handleNextStepSelect}
          selectedNode={selectedNode}
          nodesById={nodesById}
          onSwitchAddBranch={handleSwitchAddBranch}
          onSwitchConditionChange={handleSwitchConditionChange}
          onUpdateNodeDescription={handleNodeDescriptionChange}
        />
      </div>
    </div>
  )
}

export default WorkflowEditor

