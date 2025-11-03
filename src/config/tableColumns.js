// Centralized table column definitions
import { getLabel } from "./workspaceConfig"

export const tableColumns = {
  pacienti: (workspaceType = "clinic") => [
    {
      id: "pacient",
      label: getLabel(workspaceType, "patient"),
      accessor: (row) => row.name,
    },
    {
      id: "contact",
      label: "Contact",
      accessor: (row) => row.email,
    },
    {
      id: "programare",
      label: getLabel(workspaceType, "nextAppointment"),
      accessor: (row) => row.upcoming,
    },
    {
      id: "dePlata",
      label: "De plată",
      accessor: (row) => row.dePlata,
    },
  ],
  medici: (workspaceType = "clinic") => [
    {
      id: "medic",
      label: getLabel(workspaceType, "doctor"),
      accessor: (row) => row.name,
    },
    {
      id: "specializare",
      label: getLabel(workspaceType, "specialty"),
      accessor: (row) => row.specialty,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
    {
      id: "pacienti",
      label: getLabel(workspaceType, "patientsToday"),
      accessor: (row) => row.patientsToday,
    },
    {
      id: "tratamente",
      label: getLabel(workspaceType, "activeTreatments"),
      accessor: (row) => row.activeTreatments,
    },
    {
      id: "urmatoare",
      label: "Următoarea fereastră",
      accessor: (row) => row.nextSlot,
    },
    {
      id: "cabinet",
      label: getLabel(workspaceType, "cabinet"),
      accessor: (row) => row.cabinet,
    },
  ],
  tratamente: (workspaceType = "clinic") => [
    {
      id: "cod",
      label: "Cod",
      accessor: (row) => row.code,
      width: "w-[120px]",
    },
    {
      id: "nume",
      label: "Nume",
      accessor: (row) => row.name,
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => row.duration,
    },
    {
      id: "medic",
      label: getLabel(workspaceType, "recommendedDoctor"),
      accessor: (row) => row.doctor,
    },
    {
      id: "pret",
      label: "Preț",
      accessor: (row) => row.price,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
  ],
  programari: (workspaceType = "clinic") => [
    {
      id: "pacient",
      label: getLabel(workspaceType, "patient"),
      accessor: (row) => row.patient,
    },
    {
      id: "medic",
      label: getLabel(workspaceType, "doctor"),
      accessor: (row) => row.doctorId,
    },
    {
      id: "tratament",
      label: getLabel(workspaceType, "treatment"),
      accessor: (row) => row.treatment,
    },
    {
      id: "ora",
      label: "Oră",
      accessor: (row) => {
        const hours = Math.floor(row.start / 60)
        const minutes = row.start % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      },
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => `${row.duration} min`,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
  ],
  automatizari: () => [
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

// Get filter columns for a specific menu
export const getFilterColumns = (menuId, workspaceType = "clinic") => {
  const columns = getTableColumns(menuId, workspaceType)
  return columns?.map((col) => ({
    id: col.id,
    label: col.label,
  })) || []
}

// Get table columns for a specific menu
export const getTableColumns = (menuId, workspaceType = "clinic") => {
  const columnDef = tableColumns[menuId]
  if (!columnDef) return []
  
  // Dacă este o funcție, o apelăm cu workspaceType
  if (typeof columnDef === "function") {
    return columnDef(workspaceType)
  }
  
  // Altfel returnează direct
  return columnDef
}

