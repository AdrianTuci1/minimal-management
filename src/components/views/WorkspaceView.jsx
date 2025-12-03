import { useEffect, useMemo, useState } from "react"

import Sidebar from "../Sidebar"
import TopBar from "../TopBar"
import SpotlightSearch from "../SpotlightSearch"
import KpiOverview from "./KpiOverview"
import ServicesView from "./ServicesView"
import PatientsView from "./PatientsView"
import StaffView from "./StaffView"
import CalendarView from "./CalendarView"
import TreatmentsView from "./TreatmentsView"
import AutomatizariView from "./AutomatizariView"
import SettingsView from "./SettingsView"
import { Drawer, DrawerContent, DrawerField } from "../ui/drawer"
import useAppStore from "../../store/appStore"
import useWorkspaceConfig from "../../hooks/useWorkspaceConfig"
import { getDemoStaff } from "../../config/demoData"
import { getDrawerInputs } from "../../config/drawerInputs"
import { Calendar as CalendarIcon, Save, Trash2 } from "lucide-react"
import { useActionBarModel } from "../../models/ActionBarModel"
import ReservationModel from "../../models/ReservationModel"

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

function WorkspaceView({ workspace }) {
  const { getLabel, workspaceType, config } = useWorkspaceConfig()
  const initialDoctors = useMemo(() => getDemoStaff(workspaceType), [workspaceType])
  
  // Stare pentru modelul de rezervări
  const [reservationModel, setReservationModel] = useState(null)
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
    openDrawer,
    isDrawerOpen,
    drawerData,
    drawerViewId,
    drawerMode,
    closeDrawer,
  } = useAppStore()

  const doctors = useMemo(() => initialDoctors, [initialDoctors])
  const onlineUsers = useMemo(() => initialOnlineUsers, [])

  // Folosește modelul pentru a obține acțiunile pentru ActionBar
  const { actions } = useActionBarModel()
  
  // Inițializează modelul de rezervări
  useEffect(() => {
    const model = new ReservationModel(workspaceType)
    setReservationModel(model)
    
    // Abonează-te la schimbări
    const unsubscribe = model.subscribe(() => {
      // Modelul notifică automat componentele despre schimbări
    })
    
    return unsubscribe
  }, [workspaceType])

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
    
    if (isCreateMode) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }))
    } else if (drawerData && reservationModel) {
      // Actualizează rezervarea prin model
      const updated = reservationModel.updateReservation(drawerData.id, {
        [fieldId]: value,
      })
      
        if (updated) {
          openDrawer("programari", updated, "edit")
      }
    }
  }

  const handleSaveAppointment = () => {
    if (!reservationModel) return
    
    const isCreateMode = drawerMode === "create"
    const dataToSave = isCreateMode ? formData : drawerData

    if (isCreateMode) {
      // Obține tipul de calendar din useActionBarModel
      const { calendarType } = useActionBarModel()
      reservationModel.addReservation(calendarType, dataToSave)
      closeDrawer()
      setFormData({})
    } else {
      reservationModel.updateReservation(drawerData.id, dataToSave)
      closeDrawer()
    }
  }

  const handleDeleteAppointment = () => {
    if (!drawerData || !drawerData.id || !reservationModel) return

    if (window.confirm("Sigur doriți să ștergeți această programare?")) {
      reservationModel.deleteReservation(drawerData.id)
      closeDrawer()
    }
  }

  // Reset formData when drawer opens in create mode
  useEffect(() => {
    if (drawerMode === "create" && isDrawerOpen && drawerViewId === "appointments") {
      if (drawerData && Object.keys(drawerData).length > 0) {
        setFormData(drawerData)
      } else {
        setFormData({})
      }
    }
  }, [drawerMode, isDrawerOpen, drawerViewId, drawerData])

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
      id: "goto-home",
      title: "Deschide Home",
      description: "Vezi indicatorii și activitățile recente",
      group: "Navigare",
      onSelect: () => setActiveMenu("home"),
    },
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

  const renderMainContent = () => {
    switch (activeMenu) {
      case "home":
        return <KpiOverview />
      case "tratamente":
        return <TreatmentsView />
      case "services":
        return <ServicesView />
      case "clients":
      case "pacienti":
        return <PatientsView />
      case "staff":
      case "medici":
        return <StaffView doctors={doctors} />
      case "automatizari":
        return <AutomatizariView />
      case "setari":
        return <SettingsView />
      case "programari":
      default:
        return <CalendarView />
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
              actions={actions}
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
            onClick: handleDeleteAppointment,
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
