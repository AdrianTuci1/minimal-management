import { getLabel } from "./workspaceConfig"

// Centralized drawer field definitions
export const drawerInputs = {
  pacienti: (workspaceType = "clinic") => [
    {
      id: "name",
      label: "Nume",
      type: "text",
      accessor: (row) => row?.name || "",
      editable: true,
    },
    {
      id: "phone",
      label: "Număr telefon",
      type: "tel",
      accessor: (row) => row?.phone || "",
      editable: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      accessor: (row) => row?.email || "",
      editable: true,
    },
    {
      id: "age",
      label: "Vârstă",
      type: "number",
      accessor: (row) => row?.age || "",
      editable: true,
    },
    {
      id: "labels",
      label: "Label-uri",
      type: "text",
      accessor: (row) => {
        if (Array.isArray(row?.labels)) {
          return row.labels.join(", ")
        }
        return row?.labels || ""
      },
      editable: true,
    },
    {
      id: "source",
      label: "Sursă",
      type: "text",
      accessor: (row) => row?.source || "",
      editable: true,
    },
  ],
  medici: (workspaceType = "clinic") => [
    {
      id: "name",
      label: "Nume complet",
      type: "text",
      accessor: (row) => row?.name || "",
      editable: true,
    },
    {
      id: "specialty",
      label: getLabel(workspaceType, "specialty"),
      type: "text",
      accessor: (row) => row?.specialty || "",
      editable: true,
    },
    {
      id: "status",
      label: "Status",
      type: "text",
      accessor: (row) => row?.status || "",
      editable: false,
    },
    {
      id: "patientsToday",
      label: getLabel(workspaceType, "patientsToday"),
      type: "text",
      accessor: (row) => row?.patientsToday || "",
      editable: false,
    },
    {
      id: "activeTreatments",
      label: getLabel(workspaceType, "activeTreatments"),
      type: "text",
      accessor: (row) => row?.activeTreatments || "",
      editable: false,
    },
    {
      id: "nextSlot",
      label: "Următoarea fereastră",
      type: "text",
      accessor: (row) => row?.nextSlot || "",
      editable: false,
    },
    {
      id: "cabinet",
      label: getLabel(workspaceType, "cabinet"),
      type: "text",
      accessor: (row) => row?.cabinet || "",
      editable: true,
    },
  ],
  tratamente: (workspaceType = "clinic") => [
    {
      id: "code",
      label: "Cod",
      type: "text",
      accessor: (row) => row?.code || "",
      editable: true,
    },
    {
      id: "name",
      label: "Nume",
      type: "text",
      accessor: (row) => row?.name || "",
      editable: true,
    },
    {
      id: "duration",
      label: "Durată",
      type: "text",
      accessor: (row) => row?.duration || "",
      editable: true,
    },
    {
      id: "doctor",
      label: getLabel(workspaceType, "recommendedDoctor"),
      type: "text",
      accessor: (row) => row?.doctor || "",
      editable: true,
    },
    {
      id: "price",
      label: "Preț",
      type: "text",
      accessor: (row) => row?.price || "",
      editable: true,
    },
    {
      id: "status",
      label: "Status",
      type: "text",
      accessor: (row) => row?.status || "",
      editable: true,
    },
  ],
}

// Get drawer inputs for a specific view
export const getDrawerInputs = (viewId, workspaceType = "clinic") => {
  const inputDef = drawerInputs[viewId]
  if (!inputDef) return []
  
  // Dacă este o funcție, o apelăm cu workspaceType
  if (typeof inputDef === "function") {
    return inputDef(workspaceType)
  }
  
  // Altfel returnează direct
  return inputDef
}

