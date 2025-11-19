import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_TRIGGER_OBJECT_ID } from '../constants/triggers'

const INITIAL_STATE = {
  selectedTriggerId: null,
  selectedNodeId: null,
  triggerDescription: '',
  triggerObjectId: DEFAULT_TRIGGER_OBJECT_ID,
  activePanel: 'select-trigger',
  activeTool: 'select',
}

export const useWorkflowEditorStore = create(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setSelectedTriggerId: (selectedTriggerId) =>
        set(() => ({
          selectedTriggerId,
          selectedNodeId: null,
          triggerDescription: '',
          triggerObjectId: DEFAULT_TRIGGER_OBJECT_ID,
          activePanel: selectedTriggerId ? 'edit-trigger' : 'select-trigger',
        })),
      clearSelectedTrigger: () =>
        set(() => ({
          ...INITIAL_STATE,
        })),
      setTriggerDescription: (triggerDescription) => set({ triggerDescription }),
      setTriggerObjectId: (triggerObjectId) => set({ triggerObjectId }),
      setActivePanel: (activePanel) => set({ activePanel }),
      setActiveTool: (activeTool) => set({ activeTool }),
      setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
    }),
    {
      name: 'workflow-editor-state',
      version: 5,
      migrate: (persistedState, version) => {
        if (!persistedState) {
          return INITIAL_STATE
        }

        const upgradedState = {
          ...INITIAL_STATE,
          ...persistedState,
        }

        if (version < 3) {
          upgradedState.activePanel = persistedState.selectedTriggerId ? 'edit-trigger' : 'select-trigger'
        }

        if (!persistedState.activeTool) {
          upgradedState.activeTool = 'select'
        }

        if (version < 5 || typeof persistedState.selectedNodeId === 'undefined') {
          upgradedState.selectedNodeId = null
        }

        return upgradedState
      },
    }
  )
)

