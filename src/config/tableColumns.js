// Centralized table column definitions
export const tableColumns = {
  pacienti: [
    {
      id: "pacient",
      label: "Pacient",
      accessor: (row) => row.name,
    },
    {
      id: "contact",
      label: "Contact",
      accessor: (row) => row.email,
    },
    {
      id: "programare",
      label: "Programare următoare",
      accessor: (row) => row.upcoming,
    },
    {
      id: "dePlata",
      label: "De plată",
      accessor: (row) => row.dePlata,
    },
  ],
  medici: [
    {
      id: "medic",
      label: "Medic",
      accessor: (row) => row.name,
    },
    {
      id: "specializare",
      label: "Specializare",
      accessor: (row) => row.specialty,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
    {
      id: "pacienti",
      label: "Pacienți azi",
      accessor: (row) => row.patientsToday,
    },
    {
      id: "tratamente",
      label: "Tratamente active",
      accessor: (row) => row.activeTreatments,
    },
    {
      id: "urmatoare",
      label: "Următoarea fereastră",
      accessor: (row) => row.nextSlot,
    },
    {
      id: "cabinet",
      label: "Cabinet",
      accessor: (row) => row.cabinet,
    },
  ],
  tratamente: [
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
      label: "Medic recomandat",
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
  produse: [
    {
      id: "produs",
      label: "Produs",
      accessor: (row) => row.name,
    },
    {
      id: "cod",
      label: "Cod",
      accessor: (row) => row.sku,
    },
    {
      id: "stoc",
      label: "Stoc",
      accessor: (row) => row.stock,
    },
    {
      id: "minim",
      label: "Minim necesar",
      accessor: (row) => row.minStock,
    },
    {
      id: "furnizor",
      label: "Furnizor",
      accessor: (row) => row.supplier,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
  ],
}

// Get filter columns for a specific menu
export const getFilterColumns = (menuId) => {
  return tableColumns[menuId]?.map((col) => ({
    id: col.id,
    label: col.label,
  })) || []
}

// Get table columns for a specific menu
export const getTableColumns = (menuId) => {
  return tableColumns[menuId] || []
}

