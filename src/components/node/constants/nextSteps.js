import {
  Brain,
  Calculator,
  CheckSquare2,
  ClipboardList,
  Clock,
  FilePlus,
  FileText,
  Filter,
  GitBranch,
  Globe,
  Hash,
  List,
  Megaphone,
  PartyPopper,
  RefreshCw,
  Search,
  Shuffle,
  Sigma,
  TextCursorInput,
  ToggleLeft,
  Wand2,
} from 'lucide-react'

export const NEXT_STEP_GROUPS = [
  {
    id: 'records',
    title: 'Records',
    items: [
      {
        id: 'record-command',
        label: 'Create or update record',
        description: 'Add or update a CRM object after the trigger fires.',
        Icon: FilePlus,
        typeLabel: 'Action',
        variant: 'action',
        status: { label: 'Pending', tone: 'neutral' },
        panel: 'create-record',
        category: { label: 'Records', appearance: 'deal' },
      },
      {
        id: 'create-record',
        label: 'Create record',
        description: 'Add a new CRM object to your workspace.',
        Icon: FilePlus,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
        category: { label: 'Records', appearance: 'deal' },
      },
      {
        id: 'find-records',
        label: 'Find records',
        description: 'Look up CRM data to use later in the flow.',
        Icon: Search,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'update-record',
        label: 'Update record',
        description: 'Modify fields on an existing CRM object.',
        Icon: ClipboardList,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
        category: { label: 'Records', appearance: 'deal' },
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    items: [
      {
        id: 'add-record-to-list',
        label: 'Add record to list',
        description: 'Append a record to one of your saved lists.',
        Icon: List,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'delete-list-entry',
        label: 'Delete list entry',
        description: 'Remove a record from a saved list.',
        Icon: List,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'find-list-entries',
        label: 'Find list entries',
        description: 'Locate list entries that meet your filters.',
        Icon: Search,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'update-list-entry',
        label: 'Update list entry',
        description: 'Edit information stored on a list entry.',
        Icon: ClipboardList,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agents',
    items: [
      {
        id: 'research-record',
        label: 'Research record',
        description: 'Enrich records with external data.',
        Icon: Globe,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    items: [
      {
        id: 'classify-record',
        label: 'Classify record',
        description: 'Automatically categorize records using AI.',
        Icon: Brain,
        typeLabel: 'AI',
        status: { label: 'Beta', tone: 'neutral' },
      },
      {
        id: 'classify-text',
        label: 'Classify text',
        description: 'Use AI to categorize unstructured text.',
        Icon: TextCursorInput,
        typeLabel: 'AI',
        status: { label: 'Beta', tone: 'neutral' },
      },
      {
        id: 'prompt-completion',
        label: 'Prompt completion',
        description: 'Generate text responses from an AI prompt.',
        Icon: Wand2,
        typeLabel: 'AI',
        status: { label: 'Beta', tone: 'neutral' },
      },
      {
        id: 'summarize-record',
        label: 'Summarize record',
        description: 'Create a short summary using AI.',
        Icon: FileText,
        typeLabel: 'AI',
        status: { label: 'Beta', tone: 'neutral' },
      },
    ],
  },
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      {
        id: 'broadcast-message',
        label: 'Broadcast message',
        description: 'Notify teammates when this workflow runs.',
        Icon: Megaphone,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'celebration',
        label: 'Celebration',
        description: 'Celebrate wins automatically.',
        Icon: PartyPopper,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'round-robin',
        label: 'Round robin',
        description: 'Assign work evenly across your team.',
        Icon: Shuffle,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
    ],
  },
  {
    id: 'conditions',
    title: 'Conditions',
    appearance: 'condition',
    items: [
      {
        id: 'filter',
        label: 'Filter',
        description: 'Limit which records continue through the workflow.',
        Icon: Filter,
        typeLabel: 'Condition',
        status: { label: 'Draft', tone: 'neutral' },
      },
      {
        id: 'if-else',
        label: 'If / else',
        description: 'Branch the workflow based on a condition.',
        Icon: GitBranch,
        typeLabel: 'Condition',
        status: { label: 'Draft', tone: 'neutral' },
      },
      {
        id: 'switch',
        label: 'Switch',
        description: 'Route outcomes across multiple branches.',
        Icon: ToggleLeft,
        typeLabel: 'Condition',
        status: { label: 'Draft', tone: 'neutral' },
        variant: 'condition',
        panel: 'switch',
        category: { label: 'Conditions', appearance: 'condition' },
        initialBranchCount: 2,
      },
    ],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    items: [
      {
        id: 'complete-task',
        label: 'Complete task',
        description: 'Mark tasks complete automatically.',
        Icon: CheckSquare2,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'create-task',
        label: 'Create task',
        description: 'Generate a new task in your workspace.',
        Icon: ClipboardList,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
    ],
  },
  {
    id: 'calculations',
    title: 'Calculations',
    items: [
      {
        id: 'adjust-time',
        label: 'Adjust time',
        description: 'Calculate relative dates for later steps.',
        Icon: Clock,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'aggregate-values',
        label: 'Aggregate values',
        description: 'Combine numeric data across records.',
        Icon: Sigma,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'formula',
        label: 'Formula',
        description: 'Compute custom values from inputs.',
        Icon: Calculator,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'random-number',
        label: 'Random number',
        description: 'Generate a random value for experimentation.',
        Icon: Hash,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    items: [
      {
        id: 'loop',
        label: 'Loop',
        description: 'Repeat a set of steps for each record.',
        Icon: RefreshCw,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
      {
        id: 'send-http-request',
        label: 'Send HTTP request',
        description: 'Connect to external systems with a webhook.',
        Icon: Globe,
        typeLabel: 'Action',
        status: { label: 'Pending', tone: 'neutral' },
      },
    ],
  },
]

export function flattenNextStepItems(groups = NEXT_STEP_GROUPS) {
  return groups.reduce((acc, group) => {
    group.items.forEach((item) => {
      acc[item.id] = {
        ...item,
        groupId: group.id,
        groupTitle: group.title,
      }
    })
    return acc
  }, {})
}

export const DEFAULT_NEXT_STEP_ID = 'record-command'

export const NEXT_STEP_ITEMS_BY_ID = flattenNextStepItems()

export const DEFAULT_NEXT_STEP_OPTION = NEXT_STEP_ITEMS_BY_ID[DEFAULT_NEXT_STEP_ID] ?? null


