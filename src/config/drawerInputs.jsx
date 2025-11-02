import React from "react"

// Centralized drawer field definitions
export const drawerInputs = {
  pacienti: [
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
  medici: [
    {
      id: "name",
      label: "Nume complet",
      type: "text",
      accessor: (row) => row?.name || "",
      editable: true,
    },
    {
      id: "specialty",
      label: "Specializare",
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
      label: "Pacienți azi",
      type: "text",
      accessor: (row) => row?.patientsToday || "",
      editable: false,
    },
    {
      id: "activeTreatments",
      label: "Tratamente active",
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
      label: "Cabinet",
      type: "text",
      accessor: (row) => row?.cabinet || "",
      editable: true,
    },
  ],
  tratamente: [
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
      label: "Medic recomandat",
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
export const getDrawerInputs = (viewId) => {
  return drawerInputs[viewId] || []
}

