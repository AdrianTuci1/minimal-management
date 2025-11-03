import { create } from "zustand"
import { persist } from "zustand/middleware"

const STORAGE_KEY = "workspace-store"

const defaultState = {
  // Groups/Teams state (groups are teams)
  groups: [
    {
      id: "group-1",
      name: "Grupul meu",
      memberCount: 1,
      createdAt: new Date().toISOString(),
    },
  ],
  selectedGroupId: "group-1",

  // Workspace state
  workspaces: [],
  selectedWorkspaceId: null,
  workspaceAccessLog: [], // Track workspace access for "most accessed" feature

  // Drafts state (notițe, imagini, media - pot fi asociate cu grupuri)
  drafts: [
    {
      id: "draft-1",
      name: "Notițe importante",
      type: "note",
      content: "Notițe despre proiect...",
      groupId: "group-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "draft-2",
      name: "Screenshot UI",
      type: "image",
      content: "",
      mediaUrl: "/placeholder-image.jpg",
      groupId: "group-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  // User state
  currentUser: {
    id: "user-1",
    name: "Alexandru Popescu",
    email: "alexandru@example.com",
    initials: "AP",
    avatar: null,
  },

  // Subscription state
  subscription: {
    plan: "basic", // "basic" | "professional" | "enterprise"
    active: true,
    expiresAt: null,
  },
}

const useWorkspaceStore = create(
  persist(
    (set) => ({
      ...defaultState,

      // Group/Team actions (groups are teams)
      createGroup: (groupData) =>
        set((state) => {
          const newGroup = {
            id: `group-${Date.now()}`,
            name: groupData.name,
            memberCount: groupData.memberCount || 1,
            createdAt: new Date().toISOString(),
          }
          return {
            groups: [...state.groups, newGroup],
            selectedGroupId: newGroup.id,
          }
        }),

      selectGroup: (groupId) =>
        set({ selectedGroupId: groupId, selectedWorkspaceId: null }),

      updateGroup: (groupId, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, ...updates } : g
          ),
        })),

      deleteGroup: (groupId) =>
        set((state) => {
          // Also delete all workspaces and drafts in this group
          const remainingWorkspaces = state.workspaces.filter((ws) => ws.groupId !== groupId)
          const remainingDrafts = state.drafts.filter((d) => d.groupId !== groupId)
          // If deleting selected group, select first remaining group or null
          const remainingGroups = state.groups.filter((g) => g.id !== groupId)
          const newSelectedGroupId = state.selectedGroupId === groupId
            ? remainingGroups.length > 0 ? remainingGroups[0].id : null
            : state.selectedGroupId
          return {
            groups: remainingGroups,
            workspaces: remainingWorkspaces,
            drafts: remainingDrafts,
            selectedGroupId: newSelectedGroupId,
            selectedWorkspaceId: state.selectedWorkspaceId && remainingWorkspaces.find(ws => ws.id === state.selectedWorkspaceId) 
              ? state.selectedWorkspaceId 
              : null,
          }
        }),

      // Workspace actions
      createWorkspace: (workspaceData) =>
        set((state) => {
          const newWorkspace = {
            id: `workspace-${Date.now()}`,
            name: workspaceData.name,
            type: workspaceData.type,
            groupId: workspaceData.groupId || state.selectedGroupId,
            userCount: 1,
            maxUsers: 1,
            logo: workspaceData.logo || null, // Logo URL sau null
            createdAt: new Date().toISOString(),
          }
          return {
            workspaces: [...state.workspaces, newWorkspace],
          }
        }),

      selectWorkspace: (workspaceId) =>
        set((state) => {
          // Track workspace access
          const log = { workspaceId, timestamp: new Date().toISOString() }
          return {
            selectedWorkspaceId: workspaceId,
            workspaceAccessLog: [...state.workspaceAccessLog, log],
          }
        }),

      updateWorkspace: (workspaceId, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId ? { ...ws, ...updates } : ws
          ),
        })),

      deleteWorkspace: (workspaceId) =>
        set((state) => ({
          workspaces: state.workspaces.filter((ws) => ws.id !== workspaceId),
          selectedWorkspaceId: state.selectedWorkspaceId === workspaceId ? null : state.selectedWorkspaceId,
        })),

      goToGroupView: () =>
        set({ selectedWorkspaceId: null }),

      // Current group getter
      getCurrentGroup: () => {
        const state = useWorkspaceStore.getState()
        return state.groups.find((g) => g.id === state.selectedGroupId) || null
      },

      // Drafts actions
      createDraft: (draftData) =>
        set((state) => {
          const newDraft = {
            id: `draft-${Date.now()}`,
            name: draftData.name || "Draft fără titlu",
            type: draftData.type || "note", // "note" | "image" | "media" | "email"
            content: draftData.content || "",
            mediaUrl: draftData.mediaUrl || null,
            groupId: draftData.groupId || state.selectedGroupId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          return {
            drafts: [...state.drafts, newDraft],
          }
        }),

      updateDraft: (draftId, updates) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        })),

      deleteDraft: (draftId) =>
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== draftId),
        })),

      // Subscription actions
      setSubscription: (subscription) =>
        set({ subscription }),

      // User actions
      updateUser: (updates) =>
        set((state) => ({
          currentUser: { ...state.currentUser, ...updates },
        })),
    }),
    {
      name: STORAGE_KEY,
      // Only persist the important data, skip functions
      partialize: (state) => ({
        groups: state.groups,
        selectedGroupId: state.selectedGroupId,
        workspaces: state.workspaces,
        selectedWorkspaceId: state.selectedWorkspaceId,
        workspaceAccessLog: state.workspaceAccessLog,
        drafts: state.drafts,
        currentUser: state.currentUser,
        subscription: state.subscription,
      }),
    }
  )
)

export default useWorkspaceStore

