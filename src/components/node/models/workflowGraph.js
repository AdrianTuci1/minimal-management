import {
  CANVAS_CENTER_X,
  CANVAS_HEIGHT,
  DEFAULT_ACTION_Y,
  DEFAULT_TRIGGER_Y,
  NODE_VERTICAL_SPACING,
  NODE_WIDTH,
  clampNodeYPosition,
} from '../constants/layout'
import { DEFAULT_NEXT_STEP_OPTION, NEXT_STEP_ITEMS_BY_ID } from '../constants/nextSteps'

export function createPlaceholderGraph() {
  return {
    nodes: [
      {
        id: 'empty-trigger',
        title: 'Set a trigger in the sidebar',
        description: 'Choose a starting event to begin building this workflow.',
        position: { x: CANVAS_CENTER_X, y: CANVAS_HEIGHT / 2 },
        variant: 'placeholder',
      },
    ],
    edges: [],
    nextNodeIndex: 1,
  }
}

export function createGraphForTrigger(triggerDefinition, resolveIcon = () => null) {
  if (!triggerDefinition) {
    return createPlaceholderGraph()
  }

  const Icon = triggerDefinition.iconKey ? resolveIcon(triggerDefinition.iconKey) ?? null : null

  const defaultActionNode =
    DEFAULT_NEXT_STEP_OPTION !== null
      ? updateNodeWithOption(
          {
            id: 'node-0',
    title: 'Add next step',
    description: '',
    position: { x: CANVAS_CENTER_X, y: DEFAULT_ACTION_Y },
    variant: 'add',
    panel: 'next-step-library',
          },
          DEFAULT_NEXT_STEP_OPTION
        )
      : null

  return {
    nodes: [
      {
        id: 'workflow-trigger',
        title: triggerDefinition.label,
        description: triggerDefinition.description,
        icon: Icon,
        typeLabel: triggerDefinition.groupTitle,
        status: { label: 'Draft', tone: 'neutral' },
        position: { x: CANVAS_CENTER_X, y: DEFAULT_TRIGGER_Y },
        variant: 'trigger',
        panel: 'edit-trigger',
      },
      ...(defaultActionNode ? [defaultActionNode] : []),
    ],
    edges: defaultActionNode
      ? [
      {
            id: 'edge-workflow-trigger-node-0',
        sourceId: 'workflow-trigger',
        sourceSide: 'bottom',
            targetId: 'node-0',
        targetSide: 'top',
        hasArrow: true,
      },
        ]
      : [],
    nextNodeIndex: defaultActionNode ? 1 : 0,
  }
}

export function ensureGraphForTrigger(graph, triggerDefinition, resolveIcon = () => null) {
  if (!triggerDefinition) {
    return createPlaceholderGraph()
  }

  if (!graph) {
    return createGraphForTrigger(triggerDefinition, resolveIcon)
  }

  const triggerNode = graph.nodes.find((node) => node.id === 'workflow-trigger')
  const hasPlaceholder = graph.nodes.some((node) => node.variant === 'placeholder')

  if (!triggerNode || hasPlaceholder) {
    return createGraphForTrigger(triggerDefinition, resolveIcon)
  }

  const Icon = triggerDefinition.iconKey ? resolveIcon(triggerDefinition.iconKey) ?? null : null

  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === 'workflow-trigger'
        ? {
            ...node,
            title: triggerDefinition.label,
            description: triggerDefinition.description,
            icon: Icon,
            typeLabel: triggerDefinition.groupTitle,
          }
        : node
    ),
  }
}

export function createAddNodeAfter(parentNode, graph) {
  const newNodeId = `node-${graph.nextNodeIndex}`
  const desiredY = parentNode.position.y + NODE_VERTICAL_SPACING
  const newY = clampNodeYPosition(desiredY)

  const node = {
    id: newNodeId,
    title: 'Add next step',
    description: '',
    position: { x: parentNode.position.x, y: newY },
    variant: 'add',
    panel: 'next-step-library',
  }

  const edge = {
    id: `edge-${parentNode.id}-${newNodeId}`,
    sourceId: parentNode.id,
    sourceSide: 'bottom',
    targetId: newNodeId,
    targetSide: 'top',
    hasArrow: true,
  }

  return {
    graph: {
      nodes: [...graph.nodes, node],
      edges: [...graph.edges, edge],
      nextNodeIndex: graph.nextNodeIndex + 1,
    },
    node,
  }
}

export function removeNode(graph, nodeId) {
  const nodes = graph.nodes.filter((node) => node.id !== nodeId)
  if (nodes.length === graph.nodes.length) {
    return { graph, removed: false }
  }

  const edges = graph.edges.filter((edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId)

  return {
    graph: {
      ...graph,
      nodes,
      edges,
    },
    removed: true,
  }
}

export function removeEdge(graph, edgeId) {
  return {
    ...graph,
    edges: graph.edges.filter((edge) => edge.id !== edgeId),
  }
}

export function connectNodes(graph, sourceId, targetId, options = {}) {
  if (!sourceId || !targetId || sourceId === targetId) {
    return graph
  }

  const existingEdge = graph.edges.find((edge) => edge.sourceId === sourceId && edge.targetId === targetId)
  if (existingEdge) {
    return graph
  }

  const edges = graph.edges.filter((edge) => edge.sourceId !== sourceId)
  const baseId = `edge-${sourceId}-${targetId}`
  let edgeId = baseId
  let attempt = 1

  while (edges.some((edge) => edge.id === edgeId)) {
    edgeId = `${baseId}-${attempt}`
    attempt += 1
  }

  const newEdge = {
    id: edgeId,
    sourceId,
    sourceSide: options.sourceSide ?? 'bottom',
    targetId,
    targetSide: options.targetSide ?? 'top',
    hasArrow: options.hasArrow ?? true,
  }

  return {
    ...graph,
    edges: [...edges, newEdge],
  }
}

export function updateNodeWithOption(node, option) {
  const nextVariant = option.variant ?? 'action'
  const nextStatus =
    option.status ?? (nextVariant === 'action' ? { label: 'Pending', tone: 'neutral' } : node.status ?? null)

  const updatedNode = {
    ...node,
    title: option.nodeTitle ?? option.label ?? node.title,
    description: option.nodeDescription ?? option.description ?? '',
    icon: option.Icon ?? node.icon ?? null,
    typeLabel: option.typeLabel ?? (nextVariant === 'action' ? 'Action' : node.typeLabel ?? null),
    status: nextStatus,
    variant: nextVariant,
    panel: option.panel ?? (nextVariant === 'add' ? 'next-step-library' : node.panel ?? null),
  }

  if (option.metaLabel !== undefined) {
    updatedNode.metaLabel = option.metaLabel
  }

  if (option.category) {
    updatedNode.category = option.category
  } else if (option.group) {
    const appearance = option.group.appearance ?? undefined
    updatedNode.category = option.group.title
      ? appearance
        ? { label: option.group.title, appearance }
        : { label: option.group.title }
      : null
  } else {
    updatedNode.category = null
  }

  return updatedNode
}

const SWITCH_BRANCH_HORIZONTAL_SPACING = NODE_WIDTH + 120
const DEFAULT_SWITCH_BRANCH_OPTION_ID = 'create-record'
const DEFAULT_SWITCH_BRANCH_PANEL = 'create-record'
const DEFAULT_SWITCH_BRANCH_OPTION = NEXT_STEP_ITEMS_BY_ID[DEFAULT_SWITCH_BRANCH_OPTION_ID] ?? null

function createSwitchBranchId(nodeId, suffix) {
  return `branch-${nodeId}-${suffix}`
}

function setSwitchBranches(graph, switchNodeId, desiredBranches) {
  const nodeIndex = graph.nodes.findIndex((item) => item.id === switchNodeId)
  if (nodeIndex === -1) {
    return graph
  }

  const parentNode = graph.nodes[nodeIndex]
  const originalChildIds = new Set(
    graph.nodes.filter((item) => item.parentNodeId === switchNodeId).map((item) => item.id)
  )

  let nodes = graph.nodes.slice()
  let nextNodeIndex = graph.nextNodeIndex
  const branchCount = desiredBranches.length
  const retainedChildIds = new Set()

  const branchMetadata = desiredBranches.map((branch, index) => {
    const isDefault = branch.type === 'default'
    const branchId = branch.id ?? createSwitchBranchId(switchNodeId, isDefault ? 'default' : index + 1)

    let targetId = branch.targetId ?? null
    const existingNodeIndex = targetId ? nodes.findIndex((item) => item.id === targetId) : -1

    if (existingNodeIndex === -1) {
      targetId = `node-${nextNodeIndex}`
      nextNodeIndex += 1

      const baseNode = {
        id: targetId,
        title: 'Add next step',
        description: '',
        position: { x: parentNode.position.x, y: parentNode.position.y + NODE_VERTICAL_SPACING },
        variant: 'add',
        panel: 'next-step-library',
        parentNodeId: switchNodeId,
        branchId,
      }

      const nextNode =
        DEFAULT_SWITCH_BRANCH_OPTION !== null
          ? {
              ...updateNodeWithOption(baseNode, DEFAULT_SWITCH_BRANCH_OPTION),
              panel: DEFAULT_SWITCH_BRANCH_OPTION.panel ?? DEFAULT_SWITCH_BRANCH_PANEL,
              parentNodeId: switchNodeId,
              branchId,
            }
          : baseNode

      nodes.push(nextNode)
    } else {
      const existingChild = nodes[existingNodeIndex]
      if (existingChild.parentNodeId !== switchNodeId || existingChild.branchId !== branchId) {
        nodes[existingNodeIndex] = { ...existingChild, parentNodeId: switchNodeId, branchId }
      }
    }

    const spacing = SWITCH_BRANCH_HORIZONTAL_SPACING
    const childIndex = nodes.findIndex((item) => item.id === targetId)
    if (childIndex !== -1) {
      const desiredPosition = {
        x: parentNode.position.x + (index - (branchCount - 1) / 2) * spacing,
        y: parentNode.position.y + NODE_VERTICAL_SPACING,
      }
      const currentNode = nodes[childIndex]
      if (
        currentNode.position.x !== desiredPosition.x ||
        currentNode.position.y !== desiredPosition.y ||
        currentNode.parentNodeId !== switchNodeId ||
        currentNode.branchId !== branchId
      ) {
        nodes[childIndex] = { ...currentNode, position: desiredPosition, parentNodeId: switchNodeId, branchId }
      }
    }

    retainedChildIds.add(targetId)

    return {
      ...branch,
      id: branchId,
      label: branch.label ?? (isDefault ? 'Default' : `Condition ${index + 1}`),
      type: isDefault ? 'default' : 'condition',
      condition: branch.condition ?? '',
      targetId,
    }
  })

  nodes = nodes.filter((item) => {
    if (item.id === switchNodeId) {
      return true
    }
    if (item.parentNodeId === switchNodeId && !retainedChildIds.has(item.id)) {
      return false
    }
    return true
  })

  const removedChildIds = new Set([...originalChildIds].filter((id) => !retainedChildIds.has(id)))

  const edges = [
    ...graph.edges.filter(
      (edge) =>
        edge.sourceId !== switchNodeId &&
        !removedChildIds.has(edge.sourceId) &&
        !removedChildIds.has(edge.targetId)
    ),
  ]

  branchMetadata.forEach((branch) => {
    edges.push({
      id: `edge-${switchNodeId}-${branch.targetId}`,
      sourceId: switchNodeId,
      sourceSide: 'bottom',
      targetId: branch.targetId,
      targetSide: 'top',
      hasArrow: true,
      branchId: branch.id,
    })
  })

  nodes[nodeIndex] = { ...parentNode, branches: branchMetadata }

  return {
    ...graph,
    nodes,
    edges,
    nextNodeIndex,
  }
}

export function initializeSwitchNode(graph, switchNodeId, initialBranchCount = 2) {
  const node = graph.nodes.find((item) => item.id === switchNodeId)
  if (!node) {
    return graph
  }

  if (node.branches && node.branches.length > 0) {
    return setSwitchBranches(graph, switchNodeId, node.branches)
  }

  const branches = Array.from({ length: initialBranchCount }, (_, index) => ({
    id: createSwitchBranchId(switchNodeId, index + 1),
    label: `Condition ${index + 1}`,
    type: 'condition',
    condition: '',
  }))

  branches.push({
    id: createSwitchBranchId(switchNodeId, 'default'),
    label: 'Default',
    type: 'default',
    condition: '',
  })

  return setSwitchBranches(graph, switchNodeId, branches)
}

export function appendSwitchBranch(graph, switchNodeId) {
  const node = graph.nodes.find((item) => item.id === switchNodeId)
  if (!node) {
    return graph
  }

  const existingBranches = node.branches ?? []
  const defaultBranch = existingBranches.find((branch) => branch.type === 'default')
  const conditionBranches = existingBranches.filter((branch) => branch.type === 'condition')

  const nextIndex = conditionBranches.length + 1
  const newBranch = {
    id: createSwitchBranchId(switchNodeId, `${nextIndex}-${graph.nextNodeIndex}`),
    label: `Condition ${nextIndex}`,
    type: 'condition',
    condition: '',
  }

  const desiredBranches = [
    ...conditionBranches.map((branch) => ({ ...branch })),
    newBranch,
    ...(defaultBranch ? [{ ...defaultBranch }] : []),
  ]

  if (!desiredBranches.some((branch) => branch.type === 'default')) {
    desiredBranches.push({
      id: createSwitchBranchId(switchNodeId, 'default'),
      label: 'Default',
      type: 'default',
      condition: '',
    })
  }

  return setSwitchBranches(graph, switchNodeId, desiredBranches)
}

export function setSwitchBranchCondition(graph, switchNodeId, branchId, condition) {
  const node = graph.nodes.find((item) => item.id === switchNodeId)
  if (!node || !node.branches) {
    return graph
  }

  const desiredBranches = node.branches.map((branch) =>
    branch.id === branchId ? { ...branch, condition } : branch
  )

  return setSwitchBranches(graph, switchNodeId, desiredBranches)
}

