import { create } from "zustand"
import { addDays } from "date-fns"

const useAppStore = create((set) => ({
  // Menu state
  activeMenu: "programari",
  setActiveMenu: (menu) => set({ activeMenu: menu }),

  // Date state
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  shiftDate: (days) => set((state) => ({ selectedDate: addDays(state.selectedDate, days) })),
  jumpToToday: () => set({ selectedDate: new Date() }),

  // Clinic state (kept for backward compatibility)
  selectedClinicId: null,
  setSelectedClinicId: (clinicId) => set({ selectedClinicId: clinicId }),

  // Spotlight state
  isSpotlightOpen: false,
  setIsSpotlightOpen: (open) => set({ isSpotlightOpen: open }),

  // Sidebar state
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Sync state
  isSyncActive: true,
  setIsSyncActive: (active) => set({ isSyncActive: active }),
  toggleSyncActive: () => set((state) => ({ isSyncActive: !state.isSyncActive })),

  // Presenting state
  isPresenting: false,
  setIsPresenting: (presenting) => set({ isPresenting: presenting }),
  togglePresenting: () => set((state) => ({ isPresenting: !state.isPresenting })),

  // Share spotlight state
  isShareSpotlightOpen: false,
  setIsShareSpotlightOpen: (open) => set({ isShareSpotlightOpen: open }),

  // Shared emails state
  sharedEmails: [],
  addSharedEmail: (email, role = "can_view") =>
    set((state) => ({
      sharedEmails: [...state.sharedEmails, { id: Date.now().toString(), email, role }],
    })),
  updateSharedEmailRole: (id, role) =>
    set((state) => ({
      sharedEmails: state.sharedEmails.map((item) => (item.id === id ? { ...item, role } : item)),
    })),
  removeSharedEmail: (id) =>
    set((state) => ({
      sharedEmails: state.sharedEmails.filter((item) => item.id !== id),
    })),

  // Appointments state
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  updateAppointment: (appointmentId, nextValues) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, ...nextValues } : appointment,
      ),
    })),

  // Drawer state
  isDrawerOpen: false,
  drawerData: null,
  drawerViewId: null,
  drawerMode: "edit", // "create" | "edit"
  openDrawer: (viewId, data = null, mode = "edit") =>
    set({ isDrawerOpen: true, drawerViewId: viewId, drawerData: data, drawerMode: mode }),
  closeDrawer: () => set({ isDrawerOpen: false, drawerViewId: null, drawerData: null, drawerMode: "edit" }),
}))

export default useAppStore
