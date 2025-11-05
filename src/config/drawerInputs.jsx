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
  programari: (workspaceType = "clinic") => {
    const type = workspaceType === "fitness" ? "fitness" : workspaceType === "hotel" ? "hotel" : "clinic"
    
    if (type === "hotel") {
      return [
        {
          id: "guest",
          label: "Oaspete",
          type: "text",
          accessor: (row) => row?.guest || "",
          editable: true,
        },
        {
          id: "roomId",
          label: "Cameră",
          type: "text",
          accessor: (row) => row?.roomId || "",
          editable: true,
        },
        {
          id: "startDate",
          label: "Data început",
          type: "date",
          accessor: (row) => row?.startDate || row?.date || "",
          editable: true,
        },
        {
          id: "durationDays",
          label: "Durată (zile)",
          type: "number",
          accessor: (row) => row?.durationDays || row?.duration || "",
          editable: true,
        },
        {
          id: "status",
          label: "Status",
          type: "text",
          accessor: (row) => row?.status || "",
          editable: true,
        },
      ]
    }
    
    if (type === "fitness") {
      return [
        {
          id: "clientName",
          label: "Client",
          type: "text",
          accessor: (row) => row?.clientName || "",
          editable: true,
        },
        {
          id: "training",
          label: "Antrenament",
          type: "text",
          accessor: (row) => row?.training || "",
          editable: true,
        },
        {
          id: "start",
          label: "Ora început",
          type: "text",
          accessor: (row) => {
            if (!row?.start && !row?.startMinutes) return ""
            const minutes = row.start || row.startMinutes
            const hours = Math.floor(minutes / 60)
            const mins = minutes % 60
            return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
          },
          editable: true,
        },
        {
          id: "duration",
          label: "Durată (minute)",
          type: "number",
          accessor: (row) => row?.duration || "",
          editable: true,
        },
        {
          id: "status",
          label: "Status",
          type: "text",
          accessor: (row) => row?.status || "",
          editable: true,
        },
      ]
    }
    
    // Clinic (default)
    return [
      {
        id: "patient",
        label: "Pacient",
        type: "text",
        accessor: (row) => row?.patient || "",
        editable: true,
      },
      {
        id: "treatment",
        label: "Tratament",
        type: "text",
        accessor: (row) => row?.treatment || "",
        editable: true,
      },
      {
        id: "start",
        label: "Ora început",
        type: "text",
        accessor: (row) => {
          if (!row?.start) return ""
          const hours = Math.floor(row.start / 60)
          const mins = row.start % 60
          return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
        },
        editable: true,
      },
      {
        id: "duration",
        label: "Durată (minute)",
        type: "number",
        accessor: (row) => row?.duration || "",
        editable: true,
      },
      {
        id: "status",
        label: "Status",
        type: "text",
        accessor: (row) => row?.status || "",
        editable: true,
      },
    ]
  },
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

