import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { Plus } from "lucide-react"

// Model pentru ActionBar care gestionează acțiunile în funcție de view-ul curent
export class ActionBarModel {
  constructor() {
    // Nu mai folosim getState() în constructor
    // Datele vor fi obținute prin parametrii metodelor
  }

  // Obține acțiunile pentru view-ul curent
  getActions(activeMenu, workspaceType, config, openDrawer, getLabel) {
    switch (activeMenu) {
      case "programari":
        return this.getAppointmentActions(openDrawer, workspaceType, config)
      case "pacienti":
        return this.getPatientActions(openDrawer, getLabel)
      case "medici":
      case "staff":
        return this.getStaffActions(openDrawer, getLabel)
      case "tratamente":
      case "services":
        return this.getServiceActions(openDrawer, getLabel)
      case "automatizari":
        return this.getAutomationActions(openDrawer)
      case "setari":
        return this.getSettingsActions(openDrawer)
      case "leads":
        return this.getLeadActions(openDrawer)
      default:
        return []
    }
  }

  // Acțiuni pentru programări
  getAppointmentActions(openDrawer, workspaceType, config) {
    const isHotelReservations = config?.id === "hotel" || workspaceType === "hotel"
    const isClinicCalendar = config?.id === "clinic" || workspaceType === "clinic" || workspaceType === "clinica-dentara"

    const actions = []

    if (isHotelReservations) {
      actions.push({
        id: "add-reservation",
        label: "Adaugă rezervare",
        variant: "default",
        onClick: () => openDrawer("appointments", null, "create"),
      })
    } else if (isClinicCalendar) {
      actions.push({
        id: "add-appointment",
        label: "Adaugă programare",
        variant: "default",
        onClick: () => openDrawer("appointments", null, "create"),
      })
    } else {
      actions.push({
        id: "add-appointment",
        label: "Adaugă programare",
        variant: "default",
        onClick: () => openDrawer("appointments", null, "create"),
      })
    }

    return actions
  }

  // Acțiuni pentru pacienți
  getPatientActions(openDrawer, getLabel) {
    return [
      {
        id: "add-patient",
        label: getLabel("addPatient"),
        variant: "default",
        onClick: () => openDrawer("pacienti", null, "create"),
      },
    ]
  }

  // Acțiuni pentru personal medical
  getStaffActions(openDrawer, getLabel) {
    return [
      {
        id: "add-staff",
        label: getLabel("addStaff"),
        variant: "default",
        onClick: () => openDrawer("staff", null, "create"),
      },
    ]
  }

  // Acțiuni pentru servicii/tratamente
  getServiceActions(openDrawer, getLabel) {
    return [
      {
        id: "add-service",
        label: getLabel("addService"),
        variant: "default",
        onClick: () => openDrawer("services", null, "create"),
      },
    ]
  }

  // Acțiuni pentru automatizări
  getAutomationActions(openDrawer) {
    return [
      {
        id: "add-automation",
        label: "Adaugă automatizare",
        variant: "default",
        onClick: () => openDrawer("automatizari", null, "create"),
      },
    ]
  }

  // Acțiuni pentru setări
  getSettingsActions(openDrawer) {
    return [
      {
        id: "add-setting",
        label: "Adaugă setare",
        variant: "default",
        onClick: () => openDrawer("setari", null, "create"),
      },
    ]
  }

  // Acțiuni pentru leads
  getLeadActions(openDrawer) {
    return [
      {
        id: "add-lead",
        label: "Adaugă lead",
        variant: "default",
        onClick: () => openDrawer("leads", null, "create"),
      },
    ]
  }

  // Verifică dacă view-ul are nevoie de ActionBar
  hasActionBar(activeMenu) {
    const viewsWithActionBar = ["programari", "pacienti", "medici", "tratamente", "services", "staff", "leads"]
    return viewsWithActionBar.includes(activeMenu)
  }

  // Verifică dacă view-ul are nevoie de controale de calendar
  hasCalendarControls(activeMenu, workspaceType, config) {
    return activeMenu === "programari"
  }

  // Obține tipul de calendar pentru view-ul curent
  getCalendarType(activeMenu, workspaceType, config) {
    if (activeMenu !== "programari") return null

    if (config?.id === "hotel" || workspaceType === "hotel") {
      return "hotel"
    }

    if (config?.id === "clinic" || workspaceType === "clinic" || workspaceType === "clinica-dentara") {
      return "clinic"
    }

    return "default"
  }
}

// Hook pentru a folosi modelul în componente
export const useActionBarModel = () => {
  const { activeMenu, openDrawer } = useAppStore()
  const { workspaceType, config, getLabel } = useWorkspaceConfig()

  const model = new ActionBarModel()

  return {
    actions: model.getActions(activeMenu, workspaceType, config, openDrawer, getLabel),
    hasActionBar: model.hasActionBar(activeMenu),
    hasCalendarControls: model.hasCalendarControls(activeMenu, workspaceType, config),
    calendarType: model.getCalendarType(activeMenu, workspaceType, config),
  }
}

export default ActionBarModel
