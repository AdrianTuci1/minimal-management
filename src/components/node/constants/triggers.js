export const TRIGGER_GROUPS = [
  {
    id: 'records',
    title: 'Records',
    items: [
      {
        id: 'record-command',
        label: 'Record command',
        description: 'Runs when a record command is executed.',
        iconKey: 'Command',
      },
      {
        id: 'record-created',
        label: 'Record created',
        description: 'Triggered whenever a new record is created.',
        iconKey: 'PlusCircle',
      },
      {
        id: 'record-updated',
        label: 'Record updated',
        description: 'Triggered when a record changes any tracked attribute.',
        iconKey: 'Pencil',
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    items: [
      {
        id: 'list-entry-command',
        label: 'List entry command',
        description: 'Runs when a list entry command fires for a record.',
        iconKey: 'List',
      },
      {
        id: 'list-entry-updated',
        label: 'List entry updated',
        description: 'Triggered when an entry in a list is updated.',
        iconKey: 'ListChecks',
      },
      {
        id: 'record-added-to-list',
        label: 'Record added to list',
        description: 'Triggered when a record is added to a list.',
        iconKey: 'ListPlus',
      },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    items: [
      {
        id: 'attribute-updated',
        label: 'Attribute updated',
        description: 'Triggered when a key attribute value is updated.',
        iconKey: 'Tag',
      },
    ],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    items: [
      {
        id: 'task-created',
        label: 'Task created',
        description: 'Triggered when a new task is created for a record.',
        iconKey: 'CheckSquare2',
      },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    items: [
      {
        id: 'manually-run',
        label: 'Manually run',
        description: 'Kick off this workflow manually on demand.',
        iconKey: 'PlayCircle',
      },
      {
        id: 'recurring-schedule',
        label: 'Recurring schedule',
        description: 'Trigger on a recurring cadence or schedule.',
        iconKey: 'CalendarClock',
      },
      {
        id: 'webhook-received',
        label: 'Webhook received',
        description: 'Triggered when an external webhook is received.',
        iconKey: 'Webhook',
      },
    ],
  },
]

export const TRIGGER_MAP = TRIGGER_GROUPS.reduce((acc, group) => {
  group.items.forEach((item) => {
    acc[item.id] = {
      ...item,
      groupId: group.id,
      groupTitle: group.title,
    }
  })
  return acc
}, {})

export const TRIGGER_OBJECT_OPTIONS = [
  { id: 'companies', label: 'Companies' },
  { id: 'deals', label: 'Deals' },
  { id: 'contacts', label: 'Contacts' },
]

export const DEFAULT_TRIGGER_OBJECT_ID = TRIGGER_OBJECT_OPTIONS[0].id


