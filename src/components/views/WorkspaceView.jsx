import { useEffect, useMemo, useState } from "react"

import Sidebar from "../Sidebar"
import TopBar from "../TopBar"
import Whiteboard from "../whiteboards/clinic/Whiteboard"
import HotelWhiteboard from "../whiteboards/hotel/HotelWhiteboard"
import FitnessWhiteboard from "../whiteboards/fitness/FitnessWhiteboard"
import SpotlightSearch from "../SpotlightSearch"
import KpiOverview from "./KpiOverview"
import TreatmentsView from "./TreatmentsView"
import PatientsView from "./PatientsView"
import DoctorsView from "./DoctorsView"
import AutomatizariView from "./AutomatizariView"
import SettingsView from "./SettingsView"
import useAppStore from "../../store/appStore"
import useWorkspaceConfig from "../../hooks/useWorkspaceConfig"
import { getDemoDoctors, getDemoAppointments, getDemoClients } from "../../config/demoData"

const initialOnlineUsers = [
  {
    id: "user-1",
    name: "Lavinia Istrate",
    role: "Recepție",
    initials: "LI",
  },
  {
    id: "user-2",
    name: "Dragoș Neagu",
    role: "Asistent",
    initials: "DN",
  },
  {
    id: "user-3",
    name: "Dr. Ana Ionescu",
    role: "Ortodonție",
    initials: "AI",
  },
]

// Funcție helper pentru a obține luni săptămâna curentă
const getMondayOfCurrentWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Ajustare pentru luni
  const monday = new Date(today)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

// Funcție helper pentru a formata data ca string YYYY-MM-DD
const formatDateString = (date) => {
  return date.toISOString().split('T')[0]
}

// Funcție helper pentru a adăuga zile la o dată
const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const initialHotelReservations = (() => {
  const monday = getMondayOfCurrentWeek()
  
  return [
    {
      id: "res-1",
      roomId: "room-101",
      guest: "Ion Popescu",
      service: "Cazare Single",
      startDate: formatDateString(addDays(monday, 0)), // Luni
      durationDays: 2,
      status: "confirmată",
    },
    {
      id: "res-2",
      roomId: "room-102",
      guest: "Maria Ionescu",
      service: "Cazare Double",
      startDate: formatDateString(addDays(monday, 1)), // Marți
      durationDays: 3,
      status: "în curs",
    },
    {
      id: "res-3",
      roomId: "room-103",
      guest: "Andrei Georgescu",
      service: "Cazare Single",
      startDate: formatDateString(addDays(monday, 2)), // Miercuri
      durationDays: 1,
      status: "confirmată",
    },
    {
      id: "res-4",
      roomId: "room-104",
      guest: "Elena Stan",
      service: "Cazare Double",
      startDate: formatDateString(addDays(monday, 3)), // Joi
      durationDays: 2,
      status: "nouă",
    },
    {
      id: "res-5",
      roomId: "room-201",
      guest: "Dan Pop",
      service: "Suite Premium",
      startDate: formatDateString(addDays(monday, 4)), // Vineri
      durationDays: 4,
      status: "confirmată",
    },
    {
      id: "res-6",
      roomId: "room-202",
      guest: "Ana Dima",
      service: "Cazare Double",
      startDate: formatDateString(addDays(monday, 6)), // Duminică
      durationDays: 2,
      status: "confirmată",
    },
    {
      id: "res-7",
      roomId: "room-203",
      guest: "Radu Georgescu",
      service: "Cazare Single",
      startDate: formatDateString(addDays(monday, 7)), // Luni săptămâna următoare
      durationDays: 3,
      status: "în curs",
    },
    {
      id: "res-8",
      roomId: "room-301",
      guest: "Carmen Iacob",
      service: "Suite Deluxe",
      startDate: formatDateString(addDays(monday, 9)), // Miercuri săptămâna următoare
      durationDays: 3,
      status: "ocupată",
    },
    {
      id: "res-9",
      roomId: "room-101",
      guest: "Stefan Popescu",
      service: "Cazare Single",
      startDate: formatDateString(addDays(monday, 5)), // Sâmbătă
      durationDays: 2,
      status: "confirmată",
    },
    {
      id: "res-10",
      roomId: "room-102",
      guest: "Laura Pop",
      service: "Cazare Double",
      startDate: formatDateString(addDays(monday, 11)), // Vineri săptămâna următoare
      durationDays: 2,
      status: "nouă",
    },
  ]
})()

function WorkspaceView({ workspace }) {
  const { getLabel, workspaceType, config } = useWorkspaceConfig()
  const initialDoctors = useMemo(() => getDemoDoctors(workspaceType), [workspaceType])
  const initialAppointments = useMemo(() => getDemoAppointments(workspaceType, initialDoctors), [workspaceType, initialDoctors])
  const initialClients = useMemo(() => getDemoClients(workspaceType), [workspaceType])
  
  const [appointments, setAppointments] = useState(initialAppointments)
  const [reservations, setReservations] = useState(initialHotelReservations)

  const {
    activeMenu,
    setActiveMenu,
    selectedDate,
    setSelectedDate,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    setAppointments: setStoreAppointments,
    updateAppointment,
    openDrawer,
  } = useAppStore()

  const doctors = useMemo(() => initialDoctors, [initialDoctors])
  const onlineUsers = useMemo(() => initialOnlineUsers, [])

  // Update appointments when workspace type changes
  useEffect(() => {
    setAppointments(initialAppointments)
  }, [initialAppointments])

  // Sync appointments to store
  useEffect(() => {
    setStoreAppointments(appointments)
  }, [appointments, setStoreAppointments])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsSpotlightOpen(true)
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        setActiveMenu("programari")
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "m") {
        event.preventDefault()
        setActiveMenu("medici")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleMenuChange = (menu) => {
    setActiveMenu(menu)
  }

  const handleAppointmentChange = (appointmentId, nextValues) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              ...nextValues,
            }
          : appointment,
      ),
    )
    updateAppointment(appointmentId, nextValues)
  }

  const handleReservationChange = (reservationId, nextValues) => {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              ...nextValues,
            }
          : reservation,
      ),
    )
  }

  const handleOpenSpotlight = () => {
    setIsSpotlightOpen(true)
  }

  const handleCloseSpotlight = () => {
    setIsSpotlightOpen(false)
  }

  const handleSpotlightSelect = (item) => {
    item?.onSelect?.()
    setIsSpotlightOpen(false)
  }

  const handleJumpToToday = () => {
    setSelectedDate(new Date())
  }

  const spotlightItems = useMemo(() => [
    {
      id: "goto-programari",
      title: `Deschide ${getLabel("appointments")}`,
      description: "Vezi whiteboard-ul zilnic și statusul procedurilor",
      group: "Navigare",
      onSelect: () => setActiveMenu("programari"),
    },
    {
      id: "goto-medici",
      title: `Deschide ${getLabel("doctors")}`,
      description: `Listă cu echipa și specializările`,
      group: "Navigare",
      onSelect: () => setActiveMenu("medici"),
    },
    {
      id: "goto-pacienti",
      title: `Deschide ${getLabel("patients")}`,
      description: `Gestionează istoricul ${getLabel("patients").toLowerCase()}`,
      group: "Navigare",
      onSelect: () => setActiveMenu("pacienti"),
    },
    {
      id: "goto-tratamente",
      title: `Deschide ${getLabel("treatments")}`,
      description: "Fluxuri și protocoale active",
      group: "Navigare",
      onSelect: () => setActiveMenu("tratamente"),
    },
    {
      id: "goto-automatizari",
      title: "Deschide Automatizari",
      description: "Gestioneaza automatizarile si workflow-urile",
      group: "Navigare",
      onSelect: () => setActiveMenu("automatizari"),
    },
    {
      id: "goto-setari",
      title: "Deschide Setari",
      description: "Configureaza programul si traducerile",
      group: "Navigare",
      onSelect: () => setActiveMenu("setari"),
    },
    {
      id: "toggle-today",
      title: "Sari la ziua curentă",
      description: "Resetează calendarul la data de azi",
      group: "Acțiuni",
      onSelect: () => {
        const { jumpToToday } = useAppStore.getState()
        jumpToToday()
      },
    },
  ], [getLabel, setActiveMenu])

  const topBarActions = useMemo(() => {
    switch (activeMenu) {
      case "pacienti":
        return [
          {
            id: "add-patient",
            label: getLabel("addPatient"),
            variant: "default",
            onClick: () => openDrawer("pacienti", null, "create"),
          },
        ]
      case "medici":
        return [
          {
            id: "add-doctor",
            label: getLabel("addDoctor"),
            variant: "default",
            onClick: () => openDrawer("medici", null, "create"),
          },
        ]
      case "tratamente":
        return [
          {
            id: "add-treatment",
            label: getLabel("addTreatment"),
            variant: "default",
            onClick: () => openDrawer("tratamente", null, "create"),
          },
        ]
      case "automatizari":
        return [
          {
            id: "add-automation",
            label: "Adaugă automatizare",
            variant: "default",
            onClick: () => openDrawer("automatizari", null, "create"),
          },
        ]
      default:
        return []
    }
  }, [activeMenu, openDrawer, getLabel])

  const renderMainContent = () => {
    switch (activeMenu) {
      case "kpi":
        return <KpiOverview />
      case "tratamente":
        return <TreatmentsView />
      case "pacienti":
        return <PatientsView />
      case "medici":
        return <DoctorsView doctors={doctors} />
      case "automatizari":
        return <AutomatizariView />
      case "setari":
        return <SettingsView />
      case "programari":
      default:
        // Folosește HotelWhiteboard pentru workspace-uri de tip hotel
        if (config.id === "hotel" || workspaceType === "hotel") {
          return (
            <HotelWhiteboard
              reservations={reservations}
              onReservationChange={handleReservationChange}
            />
          )
        }
        // Folosește FitnessWhiteboard pentru workspace-uri de tip fitness
        if (config.id === "fitness" || workspaceType === "fitness") {
          console.log("Rendering FitnessWhiteboard with clients:", initialClients)
          return (
            <FitnessWhiteboard
              clients={initialClients}
              appointments={appointments}
              onAppointmentChange={handleAppointmentChange}
            />
          )
        }
        return (
          <Whiteboard
            doctors={doctors}
            appointments={appointments}
            onAppointmentChange={handleAppointmentChange}
          />
        )
    }
  }

  const contentOverflowClass = activeMenu === "programari" ? "overflow-hidden" : "overflow-auto"

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="flex min-h-screen bg-white text-foreground">
        <Sidebar
          activeMenu={activeMenu}
          onMenuChange={handleMenuChange}
          workspace={workspace}
          onOpenSpotlight={handleOpenSpotlight}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapsed}
        />
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="sticky top-0 z-10">
            <TopBar
              onlineUsers={onlineUsers}
              actions={topBarActions}
            />
          </div>
          <div className="flex flex-1 min-h-0 flex-col">
            <div className="relative flex-1">
              <div className={`absolute inset-0 ${contentOverflowClass}`}>
                <div className={activeMenu === "programari" ? "flex h-full flex-col" : "min-h-full"}>{renderMainContent()}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <SpotlightSearch
        open={isSpotlightOpen}
        items={spotlightItems}
        onClose={handleCloseSpotlight}
        onSelect={handleSpotlightSelect}
      />
    </div>
  )
}

export default WorkspaceView

