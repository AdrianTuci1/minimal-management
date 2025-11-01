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

  // Clinic state
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

  // Appointments state
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  updateAppointment: (appointmentId, nextValues) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, ...nextValues } : appointment,
      ),
    })),
}))

export default useAppStore

