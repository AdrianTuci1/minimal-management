import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarClock,
  CheckSquare2,
  Command,
  FilePlus,
  List,
  ListChecks,
  ListPlus,
  Pencil,
  PlayCircle,
  PlusCircle,
  Tag,
  Webhook,
} from 'lucide-react'
import EdgeManager from '../utils/edgeManager'
import { useWorkflowEditorStore } from '../store/useWorkflowEditorStore'
import { getNodeHalfSize, clampNodeYPosition } from '../constants/layout'
import {
  appendSwitchBranch,
  createAddNodeAfter,
  createGraphForTrigger,
  connectNodes,
  ensureGraphForTrigger,
  initializeSwitchNode,
  removeEdge,
  removeNode,
  setSwitchBranchCondition,
  updateNodeWithOption,
} from '../models/workflowGraph'

const ICON_COMPONENTS = {
  CalendarClock,
  CheckSquare2,
  Command,
  FilePlus,
  List,
  ListChecks,
  ListPlus,
  Pencil,
  PlayCircle,
  PlusCircle,
  Tag,
  Webhook,
}

function resolveIcon(iconKey) {
  return ICON_COMPONENTS[iconKey] ?? null
}

export function useWorkflowGraph(triggerDefinition) {
  const selectedTriggerId = useWorkflowEditorStore((state) => state.selectedTriggerId)
  const activeTool = useWorkflowEditorStore((state) => state.activeTool)
  const activePanel = useWorkflowEditorStore((state) => state.activePanel)
  const selectedNodeId = useWorkflowEditorStore((state) => state.selectedNodeId)
  const setSelectedNodeId = useWorkflowEditorStore((state) => state.setSelectedNodeId)
  const setActivePanel = useWorkflowEditorStore((state) => state.setActivePanel)
  const triggerDescription = useWorkflowEditorStore((state) => state.triggerDescription)

  const [graph, setGraph] = useState(() => createGraphForTrigger(triggerDefinition, resolveIcon))

  useEffect(() => {
    setGraph((prev) => ensureGraphForTrigger(prev, triggerDefinition, resolveIcon))
  }, [triggerDefinition])

  useEffect(() => {
    if (!selectedTriggerId || !triggerDefinition) {
      return
    }

    const nextDescription =
      triggerDescription && triggerDescription.trim().length > 0
        ? triggerDescription.trim()
        : triggerDefinition.description ?? 'No description'

    setGraph((prev) => {
      const index = prev.nodes.findIndex((node) => node.id === 'workflow-trigger')
      if (index === -1) {
        return prev
      }

      const currentNode = prev.nodes[index]
      if (currentNode.description === nextDescription) {
        return prev
      }

      const updatedNodes = [...prev.nodes]
      updatedNodes[index] = {
        ...currentNode,
        description: nextDescription,
      }

      return { ...prev, nodes: updatedNodes }
    })
  }, [selectedTriggerId, triggerDefinition, triggerDescription])

  const getHalfSize = useCallback(() => getNodeHalfSize(), [])

  const [pendingConnection, setPendingConnection] = useState(null)

  const nodes = graph.nodes

  const nodesById = useMemo(() => {
    return nodes.reduce((acc, node) => {
        acc[node.id] = node
        return acc
    }, {})
  }, [nodes])

  const selectedNode = selectedNodeId ? nodesById[selectedNodeId] ?? null : null

  const getAnchorPoint = useCallback(
    (nodeId, side) => {
      const node = nodesById[nodeId]
      if (!node) return { x: 0, y: 0 }
      const { halfWidth, halfHeight } = getHalfSize()
      const { x, y } = node.position

      switch (side) {
        case 'top':
          return { x, y: y - halfHeight }
        case 'bottom':
          return { x, y: y + halfHeight }
        case 'left':
          return { x: x - halfWidth, y }
        case 'right':
        default:
          return { x: x + halfWidth, y }
      }
    },
    [getHalfSize, nodesById]
  )

  const edgeManager = useMemo(
    () =>
      new EdgeManager(getAnchorPoint, {
        offset: 28,
        radius: 12,
        directionOverrides: {
          top: { x: 0, y: -2 },
          bottom: { x: 0, y: 1 },
          left: { x: -2, y: 0 },
          right: { x: 1, y: 0 },
        },
      }),
    [getAnchorPoint]
  )

  const baseEdges = useMemo(
    () =>
      graph.edges.map((edge) => {
        const { id, sourceId, sourceSide, targetId, targetSide, ...extra } = edge
        return edgeManager.createEdge(id, sourceId, sourceSide, targetId, targetSide, extra)
      }),
    [graph.edges, edgeManager]
  )

  const previewEdge = useMemo(() => {
    if (!pendingConnection) {
      return null
    }

    const { anchor, position } = pendingConnection
    if (!anchor || !anchor.nodeId) {
      return null
    }

    const start = getAnchorPoint(anchor.nodeId, anchor.side ?? 'bottom')
    const targetY = position?.y ?? start.y
    const target = { x: start.x, y: targetY }
    const targetSide = target.y >= start.y ? 'top' : 'bottom'

    return {
      id: `preview-${anchor.nodeId}`,
      path: edgeManager.buildOrthogonalPath(start, target, anchor.side ?? 'bottom', targetSide),
      hasArrow: true,
      isPreview: true,
      showAnchor: false,
      start,
      end: target,
      sourceSide: anchor.side ?? 'bottom',
      targetSide,
    }
  }, [edgeManager, getAnchorPoint, pendingConnection])

  const edges = useMemo(
    () => (previewEdge ? [...baseEdges, previewEdge] : baseEdges),
    [baseEdges, previewEdge]
  )

  const nodesWithAddControl = useMemo(() => {
    const outgoing = new Set(graph.edges.map((edge) => edge.sourceId))
    return new Set(
      graph.nodes
        .filter((node) => node.variant !== 'placeholder' && node.variant !== 'add')
        .filter((node) => !outgoing.has(node.id))
        .map((node) => node.id)
    )
  }, [graph.edges, graph.nodes])

  const connectionAnchors = useMemo(() => {
    return graph.nodes
      .filter((node) => nodesWithAddControl.has(node.id))
      .map((node) => {
        const anchor = getAnchorPoint(node.id, 'bottom')
        return {
          id: `anchor-${node.id}`,
          nodeId: node.id,
          side: 'bottom',
          cx: anchor.x,
          cy: anchor.y,
          isInteractive: true,
        }
      })
  }, [getAnchorPoint, graph.nodes, nodesWithAddControl])

  const handleAnchorDragStart = useCallback(
    (anchor, position) => {
      if (!anchor || !anchor.nodeId) {
        return
      }

      setPendingConnection({
        anchor,
        position: position ?? getAnchorPoint(anchor.nodeId, anchor.side ?? 'bottom'),
      })
    },
    [getAnchorPoint]
  )

  const handleAnchorDragMove = useCallback((anchor, position) => {
    if (!anchor || !anchor.nodeId) {
      return
    }

    setPendingConnection((prev) => {
      if (!prev || prev.anchor.nodeId !== anchor.nodeId) {
        return prev
      }

      return {
        ...prev,
        position: position ?? prev.position,
      }
    })
  }, [])

  const handleAnchorDragEnd = useCallback(
    (anchor, position, options = {}) => {
      setPendingConnection(null)

      if (!anchor || !anchor.nodeId || options.cancelled) {
        return
      }

      const sourceNodeId = anchor.nodeId
      const dropPoint = position ?? getAnchorPoint(sourceNodeId, anchor.side ?? 'bottom')

      setGraph((prev) => {
        const { halfWidth, halfHeight } = getNodeHalfSize()

        const targetNode = prev.nodes.find((node) => {
          if (node.id === sourceNodeId) {
            return false
          }

          if (node.variant === 'placeholder') {
            return false
          }

          const withinX =
            dropPoint.x >= node.position.x - halfWidth && dropPoint.x <= node.position.x + halfWidth
          const withinY =
            dropPoint.y >= node.position.y - halfHeight && dropPoint.y <= node.position.y + halfHeight

          return withinX && withinY
        })

        if (!targetNode) {
          return prev
        }

        return connectNodes(prev, sourceNodeId, targetNode.id, {
          sourceSide: anchor.side ?? 'bottom',
          targetSide: 'top',
          hasArrow: true,
        })
      })
    },
    [getAnchorPoint, setGraph]
  )

  const handleNodeDrag = useCallback((draggedNode, nextPosition) => {
    setGraph((prev) => {
      const index = prev.nodes.findIndex((node) => node.id === draggedNode.id)
      if (index === -1) {
        return prev
      }

      const updatedNodes = [...prev.nodes]
      const currentNode = updatedNodes[index]
      const clampedY = clampNodeYPosition(nextPosition.y)

      updatedNodes[index] = {
        ...currentNode,
        position: { x: currentNode.position.x, y: clampedY },
      }

      return { ...prev, nodes: updatedNodes }
    })
  }, [])

  const handleNodeContextMenu = useCallback(
    (node) => {
      if (node.variant === 'placeholder' || node.id === 'workflow-trigger') {
        return
      }

      let removed = false

      setGraph((prev) => {
        const { graph: nextGraph, removed: wasRemoved } = removeNode(prev, node.id)
        removed = wasRemoved
        return nextGraph
      })

      if (removed) {
        const fallbackPanel = selectedTriggerId ? 'next-step-library' : 'select-trigger'
        if (selectedNodeId === node.id) {
          setSelectedNodeId(null)
          setActivePanel(fallbackPanel)
        }
      }
    },
    [selectedNodeId, selectedTriggerId, setActivePanel, setSelectedNodeId]
  )

  const handleEdgeContextMenu = useCallback((edge) => {
    setGraph((prev) => removeEdge(prev, edge.id))
  }, [])

  const handleAddNode = useCallback(
    (sourceNode) => {
      let newNodeMeta = null

      setGraph((prev) => {
        const parent = prev.nodes.find((node) => node.id === sourceNode.id)
        if (!parent) {
          return prev
        }

        const { graph: nextGraph, node } = createAddNodeAfter(parent, prev)
        newNodeMeta = {
          id: node.id,
          panel: node.panel ?? 'next-step-library',
        }

          return nextGraph
      })

      if (newNodeMeta) {
        const schedule =
          typeof queueMicrotask === 'function'
            ? queueMicrotask
            : (callback) => {
                Promise.resolve().then(callback)
              }

        schedule(() => {
          setSelectedNodeId(newNodeMeta.id)
          setActivePanel(newNodeMeta.panel)
        })
      }
    },
    [setActivePanel, setSelectedNodeId]
  )

  const handleNodeClick = useCallback(
    (node) => {
      if (!selectedTriggerId) return

      setSelectedNodeId(node.id)

      if (node.id === 'workflow-trigger') {
        setActivePanel('edit-trigger')
        return
      }

      const targetPanel = node.panel ?? (node.variant === 'add' ? 'next-step-library' : undefined)
      setActivePanel(targetPanel ?? 'next-step-library')
    },
    [selectedTriggerId, setActivePanel, setSelectedNodeId]
  )

  const handleNextStepSelect = useCallback(
    (option) => {
      if (!option || !selectedNodeId) {
        return
      }

      const nextPanel = option.panel ?? 'next-step-library'

      setGraph((prev) => {
        const index = prev.nodes.findIndex((node) => node.id === selectedNodeId)
        if (index === -1) {
          return prev
        }

        const updatedNodes = [...prev.nodes]
        const updatedNode = updateNodeWithOption(updatedNodes[index], option)
        updatedNodes[index] = updatedNode

        let nextGraph = { ...prev, nodes: updatedNodes }

        if (option.id === 'switch' || option.panel === 'switch' || updatedNode.panel === 'switch') {
          const initialBranchCount =
            typeof option.initialBranchCount === 'number' && option.initialBranchCount > 0
              ? option.initialBranchCount
              : 2
          nextGraph = initializeSwitchNode(nextGraph, selectedNodeId, initialBranchCount)
        }

        return nextGraph
      })

      setActivePanel(nextPanel)
    },
    [selectedNodeId, setActivePanel]
  )

  useEffect(() => {
    if (!selectedTriggerId || !selectedNodeId) return

    const node = graph.nodes.find((item) => item.id === selectedNodeId)
    if (!node) return

    const targetPanel = node.panel ?? (node.variant === 'add' ? 'next-step-library' : undefined)
    if (targetPanel && activePanel !== targetPanel) {
      setActivePanel(targetPanel)
    }
  }, [activePanel, graph.nodes, selectedNodeId, selectedTriggerId, setActivePanel])

  const shouldAttachHandlers = useCallback(
    (node) => activeTool === 'select' && node.variant !== 'placeholder',
    [activeTool]
  )

  const handleSwitchAddBranch = useCallback((switchNodeId) => {
    setGraph((prev) => appendSwitchBranch(prev, switchNodeId))
  }, [])

  const handleSwitchConditionChange = useCallback((switchNodeId, branchId, value) => {
    setGraph((prev) => setSwitchBranchCondition(prev, switchNodeId, branchId, value))
  }, [])

  const handleNodeDescriptionChange = useCallback((nodeId, description) => {
    setGraph((prev) => {
      const index = prev.nodes.findIndex((node) => node.id === nodeId)
      if (index === -1) {
        return prev
      }

      const updatedNodes = [...prev.nodes]
      updatedNodes[index] = { ...updatedNodes[index], description }

      return { ...prev, nodes: updatedNodes }
    })
  }, [])

  return {
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
  }
}

