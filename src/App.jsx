import { useEffect, useMemo, useState } from "react"

import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar"
import Whiteboard from "./components/Whiteboard"
import SpotlightSearch from "./components/SpotlightSearch"
import KpiOverview from "./components/views/KpiOverview"
import TreatmentsView from "./components/views/TreatmentsView"
import PatientsView from "./components/views/PatientsView"
import DoctorsView from "./components/views/DoctorsView"
import AutomatizariView from "./components/views/AutomatizariView"
import SettingsView from "./components/views/SettingsView"
import useAppStore from "./store/appStore"

const initialDoctors = [
  {
    id: "dr-ionescu",
    name: "Dr. Ana Ionescu",
    specialty: "Ortodonție",
    color: "#6366F1",
  },
  {
    id: "dr-popescu",
    name: "Dr. Mihai Popescu",
    specialty: "Implantologie",
    color: "#0EA5E9",
  },
  {
    id: "dr-stan",
    name: "Dr. Irina Stan",
    specialty: "Estetică dentară",
    color: "#22C55E",
  },
  {
    id: "dr-dima",
    name: "Dr. Andrei Dima",
    specialty: "Chirurgie",
    color: "#F97316",
  },
]

const initialAppointments = [
  {
    id: "appt-1",
    doctorId: "dr-ionescu",
    patient: "Ioana Marinescu",
    treatment: "Control aparat dentar",
    start: 9 * 60,
    duration: 30,
    status: "confirmată",
  },
  {
    id: "appt-2",
    doctorId: "dr-ionescu",
    patient: "Adrian Pavel",
    treatment: "Strângere arcuri",
    start: 10 * 60 + 30,
    duration: 45,
    status: "în curs",
  },
  {
    id: "appt-3",
    doctorId: "dr-popescu",
    patient: "Maria Tudor",
    treatment: "Consult implant",
    start: 9 * 60 + 15,
    duration: 90,
    status: "confirmată",
  },
  {
    id: "appt-4",
    doctorId: "dr-popescu",
    patient: "Dan Apostol",
    treatment: "Control post-operator",
    start: 11 * 60 + 30,
    duration: 45,
    status: "nouă",
  },
  {
    id: "appt-5",
    doctorId: "dr-stan",
    patient: "Sorina Pătrașcu",
    treatment: "Albire profesională",
    start: 8 * 60 + 45,
    duration: 60,
    status: "confirmată",
  },
  {
    id: "appt-6",
    doctorId: "dr-stan",
    patient: "Radu Georgescu",
    treatment: "Fațete ceramice",
    start: 10 * 60 + 15,
    duration: 120,
    status: "în curs",
  },
  {
    id: "appt-7",
    doctorId: "dr-dima",
    patient: "Emil Ciobanu",
    treatment: "Extracție molar",
    start: 9 * 60 + 30,
    duration: 45,
    status: "confirmată",
  },
  {
    id: "appt-8",
    doctorId: "dr-dima",
    patient: "Carmen Iacob",
    treatment: "Chirurgie parodontală",
    start: 11 * 60,
    duration: 75,
    status: "nouă",
  },
]

const initialClinics = [
  {
    id: "clinic-central",
    name: "Clinica Centrală",
    location: "Cluj-Napoca",
    timezone: "EET",
  },
  {
    id: "clinic-unirii",
    name: "Clinica Unirii",
    location: "București",
    timezone: "EET",
  },
  {
    id: "clinic-westdent",
    name: "WestDent",
    location: "Timișoara",
    timezone: "EET",
  },
]

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

function App() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [selectedClinicId, setSelectedClinicId] = useState(initialClinics[0]?.id)

  const {
    activeMenu,
    setActiveMenu,
    selectedDate,
    setSelectedDate,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebarCollapsed,
    setAppointments: setStoreAppointments,
    updateAppointment,
    openDrawer,
  } = useAppStore()

  const doctors = useMemo(() => initialDoctors, [])
  const clinics = useMemo(() => initialClinics, [])
  const onlineUsers = useMemo(() => initialOnlineUsers, [])

  const selectedClinic = useMemo(() => {
    return clinics.find((clinic) => clinic.id === selectedClinicId) ?? clinics[0]
  }, [clinics, selectedClinicId])

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

  const handleClinicChange = (clinicId) => {
    setSelectedClinicId(clinicId)
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

  const spotlightItems = [
    {
      id: "goto-programari",
      title: "Deschide Programări",
      description: "Vezi whiteboard-ul zilnic și statusul procedurilor",
      group: "Navigare",
      onSelect: () => setActiveMenu("programari"),
    },
    {
      id: "goto-medici",
      title: "Deschide Medici",
      description: "Listă cu echipa medicală și specializările",
      group: "Navigare",
      onSelect: () => setActiveMenu("medici"),
    },
    {
      id: "goto-pacienti",
      title: "Deschide Pacienți",
      description: "Gestionează istoricul pacienților",
      group: "Navigare",
      onSelect: () => setActiveMenu("pacienti"),
    },
    {
      id: "goto-tratamente",
      title: "Deschide Tratamente",
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
    ...clinics.map((clinic) => ({
      id: `clinic-${clinic.id}`,
      title: clinic.name,
      description: clinic.location,
      group: "Clinici",
      isActive: clinic.id === selectedClinic?.id,
      onSelect: () => handleClinicChange(clinic.id),
    })),
  ]

  const topBarActions = useMemo(() => {
    switch (activeMenu) {
      case "pacienti":
        return [
          {
            id: "add-patient",
            label: "Adaugă pacient",
            variant: "default",
            onClick: () => openDrawer("pacienti", null, "create"),
          },
        ]
      case "medici":
        return [
          {
            id: "add-doctor",
            label: "Adaugă medic",
            variant: "default",
            onClick: () => openDrawer("medici", null, "create"),
          },
        ]
      case "tratamente":
        return [
          {
            id: "add-treatment",
            label: "Adaugă tratament",
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
  }, [activeMenu, openDrawer])

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
          clinics={clinics}
          selectedClinic={selectedClinic}
          onClinicChange={handleClinicChange}
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

export default App
