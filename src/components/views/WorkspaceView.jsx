import { useEffect, useMemo, useSyncExternalStore } from "react"

import Sidebar from "../Sidebar"
import TopBar from "../TopBar"
import Calendar from "../Calendar"
import GanttChart from "../GanttChart"
import SpotlightSearch from "../SpotlightSearch"
import KpiOverview from "./KpiOverview"
import ServicesView from "./ServicesView"
import ClientsView from "./ClientsView"
import StaffView from "./StaffView"
import AutomatizariView from "./AutomatizariView"
import SettingsView from "./SettingsView"
import { Drawer, DrawerContent, DrawerField } from "../ui/drawer"
import useAppStore from "../../store/appStore"
import useWorkspaceConfig from "../../hooks/useWorkspaceConfig"
import { getDemoStaff, getDemoAppointments, getDemoClients } from "../../config/demoData"
import { getDrawerInputs } from "../../config/drawerInputs"
import { clinicAppointmentsData } from "../../config/demoCalendarData"
import { hotelReservationsData, fitnessWorkoutData } from "../../config/demoGanttData"
import { Calendar as CalendarIcon, Save, Trash2 } from "lucide-react"
import { WorkspaceController } from "../../models/WorkspaceController"

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
  const initialDoctors = useMemo(() => getDemoStaff(workspaceType), [workspaceType])
  const initialAppointments = useMemo(() => getDemoAppointments(workspaceType, initialDoctors), [workspaceType, initialDoctors])

  // Initialize Controller
  const controller = useMemo(() => {
    return new WorkspaceController(workspaceType, {
      appointments: initialAppointments,
      reservations: initialHotelReservations
    })
  }, [workspaceType, initialAppointments])

  // Sync state from controller
  const appointments = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.appointments
  )

  const reservations = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.reservations
  )

  const formData = useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => controller.formData
  )

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

  const handleAppointmentDoubleClick = (appointment) => {
    openDrawer("programari", appointment, "edit")
  }

  const handleAppointmentFieldChange = (fieldId, value) => {
    const isCreateMode = drawerMode === "create"
    controller.handleFieldChange(fieldId, value, isCreateMode, drawerData?.id)

    // If editing, also update the drawer data in the store immediately for UI responsiveness
    if (!isCreateMode && drawerData) {
      // We need to know if we are updating an appointment or a reservation
      // The controller has already updated its internal state
      // We just need to reflect that in the drawer
      if (workspaceType === "hotel") {
        const updated = controller.reservations.find(r => r.id === drawerData.id)
        if (updated) openDrawer("programari", updated, "edit")
      } else {
        const updated = controller.appointments.find(a => a.id === drawerData.id)
        if (updated) {
          openDrawer("programari", updated, "edit")
          updateAppointment(drawerData.id, { [fieldId]: value }) // Keep store in sync
        }
      }
    }
  }

  const handleDeleteReservation = () => {
    if (!drawerData || !drawerData.id) return

    if (window.confirm("Sigur doriți să ștergeți această rezervare?")) {
      controller.deleteReservation(drawerData.id)
      closeDrawer()
    }
  }

  const handleSaveAppointment = () => {
    const isCreateMode = drawerMode === "create"

    if (isCreateMode) {
      if (workspaceType === "hotel") {
        controller.createReservation(formData)
      } else {
        const newAppt = controller.createAppointment(formData)
        // Also update store
        setStoreAppointments([...appointments, newAppt])
      }
      closeDrawer()
      controller.resetFormData()
    } else {
      closeDrawer()
    }
  }

  const handleDeleteAppointment = () => {
    if (!drawerData || !drawerData.id) return

    if (window.confirm("Sigur doriți să ștergeți această programare?")) {
      controller.deleteAppointment(drawerData.id)
      // Update store
      setStoreAppointments(appointments.filter(a => a.id !== drawerData.id))
      closeDrawer()
    }
  }

  // Reset formData when drawer opens in create mode, or populate with initial data
  useEffect(() => {
    if (drawerMode === "create" && isDrawerOpen && drawerViewId === "appointments") {
      if (drawerData && Object.keys(drawerData).length > 0) {
        controller.setFormData(drawerData)
      } else {
        controller.resetFormData()
      }
    }
  }, [drawerMode, isDrawerOpen, drawerViewId, drawerData, controller])

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

  const getActionBarActions = useMemo(() => {
    switch (activeMenu) {
      case "appointments":
        return [
          {
            id: "add-appointment",
            label: "Adaugă programare",
            variant: "default",
            onClick: () => openDrawer("appointments", null, "create"),
          },
        ]
      case "clients":
        return [
          {
            id: "add-client",
            label: getLabel("addClient"),
            variant: "default",
            onClick: () => openDrawer("clients", null, "create"),
          },
        ]
      case "staff":
        return [
          {
            id: "add-staff",
            label: getLabel("addStaff"),
            variant: "default",
            onClick: () => openDrawer("staff", null, "create"),
          },
        ]
      case "services":
        return [
          {
            id: "add-service",
            label: getLabel("addService"),
            variant: "default",
            onClick: () => openDrawer("services", null, "create"),
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
      case "services":
        return <ServicesView />
      case "clients":
        return <ClientsView />
      case "staff":
        return <StaffView doctors={doctors} />
      case "automatizari":
        return <AutomatizariView />
      case "setari":
        return <SettingsView />
      case "appointments":
      default:
        // Folosește GanttChart pentru workspace-uri de tip hotel
        if (config.id === "hotel" || workspaceType === "hotel") {
          return (
            <div className="w-full h-full">
              <GanttChart data={reservations} />
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
              events={appointments}
              currentView={calendarView}
              currentDate={selectedDate}
              onEventClick={handleAppointmentDoubleClick}
              onEventCreate={(date, hour) => {
                openDrawer("appointment", null, "create")
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
              actions={getActionBarActions}
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
        const drawerFields = getDrawerInputs("appointments", workspaceType)
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
            open={isDrawerOpen && drawerViewId === "appointments"}
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
                                {workspaceType === "fitness" && drawerData.training && (
                                  <p className="text-sm text-muted-foreground">{drawerData.training}</p>
                                )}
                                {workspaceType !== "fitness" && drawerData.treatment && (
                                  <p className="text-sm text-muted-foreground">{drawerData.treatment}</p>
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
                {drawerFields.map((field) => {
                  const value = field.accessor(displayData || {})
                  const isEditable = true

                  return (
                    <DrawerField
                      key={field.id}
                      label={field.label}
                      type={field.type}
                      editable={isEditable}
                      value={value}
                      onChange={(newValue) => handleAppointmentFieldChange(field.id, newValue)}
                    />
                  )
                })}
              </DrawerContent>
            )}
          </Drawer>
        )
      })()}
    </div>
  )
}

export default WorkspaceView
