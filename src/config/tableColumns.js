// Centralized table column definitions
// Importă configurațiile specifice pentru fiecare tip de workspace
import { clinicTableColumns } from "./tables/clinic/tableColumns"
import { hotelTableColumns } from "./tables/hotel/tableColumns"
import { fitnessTableColumns } from "./tables/fitness/tableColumns"

// Map pentru configurațiile de tabele pe tipuri de workspace
const workspaceTableConfigs = {
  clinic: clinicTableColumns,
  hotel: hotelTableColumns,
  fitness: fitnessTableColumns,
}

// Tabele comune (nu depind de tipul de workspace)
export const commonTableColumns = {
  automatizari: [
    {
      id: "nume",
      label: "Nume",
      accessor: (row) => row.name,
    },
    {
      id: "eveniment",
      label: "Eveniment",
      accessor: (row) => row.trigger,
    },
    {
      id: "actiune",
      label: "Acțiune",
      accessor: (row) => row.action,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
  ],
}

// Get table columns for a specific menu and workspace type
export const getTableColumns = (menuId, workspaceType = "clinic") => {
  // Tabele comune (automatizări)
  if (commonTableColumns[menuId]) {
    return commonTableColumns[menuId]
  }

  // Normalizează tipul de workspace pentru a gestiona și "sala-fitness"
  const normalizedType = workspaceType === "hotel" ? "hotel" 
    : workspaceType === "fitness" || workspaceType === "sala-fitness" ? "fitness" 
    : "clinic"

  // Tabele specifice tipului de workspace
  const config = workspaceTableConfigs[normalizedType] || workspaceTableConfigs.clinic
  return config[menuId] || []
}

// Get filter columns for a specific menu
export const getFilterColumns = (menuId, workspaceType = "clinic") => {
  const columns = getTableColumns(menuId, workspaceType)
  return columns?.map((col) => ({
    id: col.id,
    label: col.label,
  })) || []
}

