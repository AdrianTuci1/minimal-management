import { useEffect, useMemo, useState } from "react"

import Sidebar from "../Sidebar"
import TopBar from "../TopBar"
import Calendar from "../Calendar"
import GanttChart from "../GanttChart"
import SpotlightSearch from "../SpotlightSearch"
import KpiOverview from "./KpiOverview"
import TreatmentsView from "./TreatmentsView"
import PatientsView from "./PatientsView"
import DoctorsView from "./DoctorsView"
import AutomatizariView from "./AutomatizariView"
import SettingsView from "./SettingsView"
import { Drawer, DrawerContent, DrawerField } from "../ui/drawer"
import useAppStore from "../../store/appStore"
import useWorkspaceConfig from "../../hooks/useWorkspaceConfig"
import { getDemoDoctors, getDemoAppointments, getDemoClients } from "../../config/demoData"
import { getDrawerInputs } from "../../config/drawerInputs"
import { clinicAppointmentsData } from "../../config/demoCalendarData"
import { hotelReservationsData, fitnessWorkoutData } from "../../config/demoGanttData"
import { Calendar as CalendarIcon, Save, Trash2 } from "lucide-react"

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
  const [formData, setFormData] = useState({})

  const {
    activeMenu,
    setActiveMenu,
    selectedDate,
    setSelectedDate,
    calendarView,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    setAppointments: setStoreAppointments,
    updateAppointment,
    openDrawer,
    isDrawerOpen,
    drawerData,
    drawerViewId,
    drawerMode,
    closeDrawer,
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

  const handleAppointmentDoubleClick = (appointment) => {
    openDrawer("programari", appointment, "edit")
  }

  const handleAppointmentFieldChange = (fieldId, value) => {
    const isCreateMode = drawerMode === "create"
    
    if (isCreateMode) {
      // In create mode, update formData
      let updatedValue = value
      
      // Parse time format (HH:MM) to minutes for start field
      if (fieldId === "start") {
        const timeMatch = value.match(/^(\d{1,2}):(\d{2})$/)
        if (timeMatch) {
          const hours = parseInt(timeMatch[1], 10)
          const minutes = parseInt(timeMatch[2], 10)
          updatedValue = hours * 60 + minutes
        }
      }

      // Parse duration to number if it's a number field
      if (fieldId === "duration") {
        updatedValue = parseInt(value, 10) || 0
      }

      // Parse durationDays to number for hotel
      if (fieldId === "durationDays") {
        updatedValue = parseInt(value, 10) || 1
      }

      // For fitness, also update startMinutes when start changes
      if (fieldId === "start" && workspaceType === "fitness") {
        setFormData((prev) => ({
          ...prev,
          [fieldId]: updatedValue,
          startMinutes: updatedValue,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [fieldId]: updatedValue,
        }))
      }
      return
    }

    // Edit mode - existing logic
    if (!drawerData) return
    
    // For hotel reservations, update reservations array instead of appointments
    if (workspaceType === "hotel") {
      let updatedValue = value
      
      // Parse durationDays to number for hotel
      if (fieldId === "durationDays") {
        updatedValue = parseInt(value, 10) || 1
      }
      
      const nextValues = {
        [fieldId]: updatedValue,
      }
      
      handleReservationChange(drawerData.id, nextValues)
      
      // Update drawerData in store to reflect changes immediately
      const updatedReservation = reservations.find((res) => res.id === drawerData.id)
      if (updatedReservation) {
        openDrawer("programari", { ...updatedReservation, ...nextValues }, "edit")
      }
      return
    }

    // Parse time format (HH:MM) to minutes for start field
    let updatedValue = value
    if (fieldId === "start") {
      const timeMatch = value.match(/^(\d{1,2}):(\d{2})$/)
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10)
        const minutes = parseInt(timeMatch[2], 10)
        updatedValue = hours * 60 + minutes
      }
    }

    // Parse duration to number if it's a number field
    if (fieldId === "duration") {
      updatedValue = parseInt(value, 10) || 0
    }

    const nextValues = {
      [fieldId]: updatedValue,
    }

    // For fitness, also update startMinutes when start changes
    if (fieldId === "start" && workspaceType === "fitness") {
      nextValues.startMinutes = updatedValue
    }

    handleAppointmentChange(drawerData.id, nextValues)
    
    // Update drawerData in store to reflect changes immediately
    const updatedAppointment = appointments.find((apt) => apt.id === drawerData.id)
    if (updatedAppointment) {
      openDrawer("programari", { ...updatedAppointment, ...nextValues }, "edit")
    }
  }
  
  const handleDeleteReservation = () => {
    if (!drawerData || !drawerData.id) return
    
    if (window.confirm("Sigur doriți să ștergeți această rezervare?")) {
      setReservations((current) => {
        const updated = current.filter((res) => res.id !== drawerData.id)
        return updated
      })
      closeDrawer()
    }
  }

  const handleSaveAppointment = () => {
    const isCreateMode = drawerMode === "create"
    
    if (isCreateMode) {
      // For hotel reservations, use handleSaveReservation
      if (workspaceType === "hotel") {
        handleSaveReservation()
        return
      }
      
      // Create new appointment for clinic/fitness
      const newAppointment = {
        id: `appt-${Date.now()}`,
        ...formData,
        // Set default status if not provided
        status: formData.status || "nouă",
        // For fitness, ensure startMinutes is set
        ...(workspaceType === "fitness" && !formData.startMinutes && formData.start
          ? { startMinutes: formData.start }
          : {}),
      }
      
      setAppointments((current) => {
        const updated = [...current, newAppointment]
        setStoreAppointments(updated)
        return updated
      })
      closeDrawer()
      setFormData({})
    } else {
      // In edit mode, changes are already saved via handleAppointmentFieldChange
      // But we can still close the drawer to confirm save
      closeDrawer()
    }
  }

  const handleDeleteAppointment = () => {
    if (!drawerData || !drawerData.id) return
    
    if (window.confirm("Sigur doriți să ștergeți această programare?")) {
      setAppointments((current) => {
        const updated = current.filter((apt) => apt.id !== drawerData.id)
        setStoreAppointments(updated)
        return updated
      })
      closeDrawer()
    }
  }

  // Reset formData when drawer opens in create mode, or populate with initial data
  useEffect(() => {
    if (drawerMode === "create" && isDrawerOpen && drawerViewId === "programari") {
      // If drawerData contains initial data (from empty area click), use it
      if (drawerData && Object.keys(drawerData).length > 0) {
        setFormData(drawerData)
      } else {
        setFormData({})
      }
    }
  }, [drawerMode, isDrawerOpen, drawerViewId, drawerData])

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

  const handleSaveReservation = () => {
    const isCreateMode = drawerMode === "create"
    
    if (isCreateMode && workspaceType === "hotel") {
      // Create new hotel reservation
      const newReservation = {
        id: `res-${Date.now()}`,
        ...formData,
        // Set default status if not provided
        status: formData.status || "nouă",
      }
      
      setReservations((current) => {
        const updated = [...current, newReservation]
        return updated
      })
      closeDrawer()
      setFormData({})
    }
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
      case "programari":
        return [
          {
            id: "add-appointment",
            label: "Adaugă programare",
            variant: "default",
            onClick: () => openDrawer("programari", null, "create"),
          },
        ]
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
        // Folosește GanttChart pentru workspace-uri de tip hotel
        if (config.id === "hotel" || workspaceType === "hotel") {
          return (
            <div className="w-full h-full">
              <GanttChart data={hotelReservationsData} />
            </div>
          )
        }
        // Folosește GanttChart pentru workspace-uri de tip fitness
        if (config.id === "fitness" || workspaceType === "fitness") {
          return (
            <div className="w-full h-full">
              <GanttChart data={fitnessWorkoutData} />
            </div>
          )
        }
        // Folosește Calendar pentru clinici
        return (
          <div className="w-full h-full">
            <Calendar
              events={clinicAppointmentsData}
              currentView={calendarView}
              currentDate={selectedDate}
              onEventClick={handleAppointmentDoubleClick}
              onEventCreate={(date, hour) => {
                openDrawer("programare", null, "create")
              }}
            />
          </div>
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
      {(() => {
        const drawerFields = getDrawerInputs("programari", workspaceType)
        const isCreateMode = drawerMode === "create"
        const displayData = isCreateMode ? formData : drawerData
        
        // Build actions array
        const drawerActions = []
        
        if (isCreateMode) {
          drawerActions.push({
            id: "save",
            label: "Salvează",
            icon: Save,
            variant: "default",
            onClick: handleSaveAppointment,
          })
        } else {
          drawerActions.push({
            id: "save",
            label: "Salvează",
            icon: Save,
            variant: "default",
            onClick: handleSaveAppointment,
          })
          drawerActions.push({
            id: "delete",
            label: "Șterge",
            icon: Trash2,
            variant: "destructive",
            onClick: workspaceType === "hotel" ? handleDeleteReservation : handleDeleteAppointment,
          })
        }
        
        return (
          <Drawer
            open={isDrawerOpen && drawerViewId === "programari"}
            onOpenChange={closeDrawer}
            title={isCreateMode ? `Adaugă programare` : `Detalii programare`}
            tabs={
              !isCreateMode
                ? [
                    {
                      id: "details",
                      icon: CalendarIcon,
                      content: (
                        <DrawerContent>
                          <>
                            {drawerData && (
                              <div className="mb-6 flex items-center gap-4 pb-6 border-b border-border">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-lg font-bold text-primary">
                                    {workspaceType === "fitness"
                                      ? (drawerData.clientName || "N/A")
                                          .split(" ")
                                          .map((part) => part[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase()
                                      : (drawerData.patient || "N/A")
                                          .split(" ")
                                          .map((part) => part[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-xl font-semibold text-foreground">
                                    {workspaceType === "fitness"
                                      ? drawerData.clientName || "Programare nouă"
                                      : drawerData.patient || "Programare nouă"}
                                  </h3>
                                  {workspaceType === "fitness" ? (
                                    drawerData.training && (
                                      <p className="text-sm text-muted-foreground">{drawerData.training}</p>
                                    )
                                  ) : (
                                    drawerData.treatment && (
                                      <p className="text-sm text-muted-foreground">{drawerData.treatment}</p>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                            {drawerFields.map((field) => {
                              const value = field.accessor(displayData || {})
                              const isEditable = field.editable

                              return (
                                <DrawerField
                                  key={field.id}
                                  label={field.label}
                                  type={field.type}
                                  editable={isEditable}
                                  value={value}
                                  onChange={(newValue) => handleAppointmentFieldChange(field.id, newValue)}
                                >
                                  {!isEditable && field.render ? (
                                    field.render(value)
                                  ) : !isEditable ? (
                                    <div className="text-base text-foreground">{value || "-"}</div>
                                  ) : null}
                                </DrawerField>
                              )
                            })}
                          </>
                        </DrawerContent>
                      ),
                    },
                  ]
                : undefined
            }
            defaultTab="details"
            actions={drawerActions}
          >
            {isCreateMode && (
              <DrawerContent>
                <>
                  {drawerFields.map((field) => {
                    const value = field.accessor(displayData || {})

                    return (
                      <DrawerField
                        key={field.id}
                        label={field.label}
                        type={field.type}
                        editable={true}
                        value={value}
                        onChange={(newValue) => handleAppointmentFieldChange(field.id, newValue)}
                      />
                    )
                  })}
                </>
              </DrawerContent>
            )}
          </Drawer>
        )
      })()}
    </div>
  )
}

export default WorkspaceView

