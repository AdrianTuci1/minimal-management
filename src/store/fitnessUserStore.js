import { create } from "zustand"
import { persist } from "zustand/middleware"

const STORAGE_KEY = "fitness-user-store"

// Generate demo session history for the last 6 months
const generateDemoSessions = () => {
  const sessions = []
  const today = new Date()
  const services = ["Sala", "Fitness", "Aerobic", "Pilates"]
  
  // Generate sessions for the last 6 months (approximately 180 days)
  const daysToGenerate = 180
  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    // Randomly add 1-3 sessions per day (30% chance)
    if (Math.random() < 0.3) {
      const numSessions = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numSessions; j++) {
        const service = services[Math.floor(Math.random() * services.length)]
        const minutes = service === "Sala" ? 60 : service === "Aerobic" ? 30 : 45
        sessions.push({
          id: `session-${date.toISOString()}-${j}`,
          date: date.toISOString().split('T')[0],
          service,
          minutes,
        })
      }
    }
  }
  
  return sessions
}

const defaultState = {
  // Temporary user data
  user: {
    id: `fitness-user-${Date.now()}`,
    name: "Alex",
    email: null,
    phone: null,
    createdAt: new Date().toISOString(),
  },

  // Mock subscription data
  subscription: {
    id: "sub-fitness-001",
    name: "Abonament Premium",
    description: "Acces nelimitat la toate facilitățile: sală, fitness, aerobic, pilates",
    duration: "6 luni",
    price: 450,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
    status: "active",
  },

  // Client data mock
  clientData: {
    confirmed: true,
    confirmedAt: new Date().toISOString(),
    formData: {
      name: "Alex",
      email: "alex@example.com",
      phone: "+40 123 456 789",
    },
  },

  // Service time tracking
  serviceTimeStats: [
    { service: "Sala", averageMinutes: 60, totalSessions: 12 },
    { service: "Fitness", averageMinutes: 45, totalSessions: 8 },
    { service: "Aerobic", averageMinutes: 30, totalSessions: 5 },
    { service: "Pilates", averageMinutes: 50, totalSessions: 6 },
  ],

  // Session history for contribution graph
  sessionHistory: generateDemoSessions(),

  // Active view
  activeView: "overview", // "overview" | "workout" | "nutrition" | "profile"

  // Selected date for calendar
  selectedDate: new Date(),

  // Weekly goals per service (object with service names as keys)
  weeklyGoals: {
    // Default goals for available services
    Sala: 2,
    Fitness: 2,
    Aerobic: 1,
    Pilates: 1,
  },
}

const useFitnessUserStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      // User actions
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      createTemporaryUser: (userData) =>
        set({
          user: {
            id: `fitness-user-${Date.now()}`,
            name: userData.name || "Alex",
            email: userData.email || null,
            phone: userData.phone || null,
            createdAt: new Date().toISOString(),
          },
        }),

      // Service time stats actions
      updateServiceTimeStats: (stats) =>
        set({ serviceTimeStats: stats }),

      addServiceSession: (service, minutes, date = new Date()) =>
        set((state) => {
          const dateString = date instanceof Date ? date.toISOString().split('T')[0] : date
          const newSession = {
            id: `session-${Date.now()}-${Math.random()}`,
            date: dateString,
            service,
            minutes,
          }
          
          // Add to session history
          const updatedHistory = [...state.sessionHistory, newSession]
          
          // Update stats
          const existingService = state.serviceTimeStats.find(
            (s) => s.service === service
          )
          
          if (existingService) {
            // Calculate new average
            const newTotal = existingService.averageMinutes * existingService.totalSessions + minutes
            const newTotalSessions = existingService.totalSessions + 1
            const newAverage = Math.round(newTotal / newTotalSessions)
            
            return {
              sessionHistory: updatedHistory,
              serviceTimeStats: state.serviceTimeStats.map((s) =>
                s.service === service
                  ? {
                      ...s,
                      averageMinutes: newAverage,
                      totalSessions: newTotalSessions,
                    }
                  : s
              ),
            }
          } else {
            // Add new service
            return {
              sessionHistory: updatedHistory,
              serviceTimeStats: [
                ...state.serviceTimeStats,
                {
                  service,
                  averageMinutes: minutes,
                  totalSessions: 1,
                },
              ],
            }
          }
        }),

      // View navigation
      setActiveView: (view) => set({ activeView: view }),

      // Date selection
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Weekly goal actions
      setWeeklyGoal: (service, goal) =>
        set((state) => ({
          weeklyGoals: {
            ...state.weeklyGoals,
            [service]: goal,
          },
        })),
      
      setWeeklyGoals: (goals) => set({ weeklyGoals: goals }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        subscription: state.subscription,
        clientData: state.clientData,
        serviceTimeStats: state.serviceTimeStats,
        sessionHistory: state.sessionHistory,
        activeView: state.activeView,
        selectedDate: state.selectedDate,
        weeklyGoals: state.weeklyGoals,
      }),
    }
  )
)

export default useFitnessUserStore

