import { create } from 'zustand'

const MOCK_WORKFLOWS = [
  {
    id: 'deal-followup',
    name: 'Follow-up după demo',
    description: 'Trimite reminder-uri automate după întâlnirile de vânzări.',
    status: 'Activ',
    updatedAt: '2025-10-01',
  },
  {
    id: 'lead-nurture',
    name: 'Nurturing lead nou',
    description: 'Secvență de emailuri pentru lead-urile calde.',
    status: 'Draft',
    updatedAt: '2025-09-24',
  },
  {
    id: 'churn-prevention',
    name: 'Prevenire churn',
    description: 'Detectează scăderea activității și trimite oferte.',
    status: 'În testare',
    updatedAt: '2025-08-18',
  },
]

export const useWorkflowStore = create((set, get) => ({
  workflows: MOCK_WORKFLOWS,
  activeWorkflowId: null,
  activeWorkflowTab: 'editor',
  isWorkflowEnabled: false,
  setActiveWorkflowId: (activeWorkflowId) =>
    set({
      activeWorkflowId,
      activeWorkflowTab: 'editor',
    }),
  setActiveWorkflowTab: (activeWorkflowTab) => set({ activeWorkflowTab }),
  setWorkflowEnabled: (isWorkflowEnabled) => set({ isWorkflowEnabled }),
  toggleWorkflowEnabled: () =>
    set((state) => ({ isWorkflowEnabled: !state.isWorkflowEnabled })),
  getActiveWorkflow: () => {
    const { workflows, activeWorkflowId } = get()
    return workflows.find((workflow) => workflow.id === activeWorkflowId) ?? null
  },
}))

