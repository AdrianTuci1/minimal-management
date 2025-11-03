// Configurații de tabele pentru hotel
import { getLabel } from "../../workspaceConfig"

export const hotelTableColumns = {
  pacienti: [
    {
      id: "client",
      label: getLabel("hotel", "patient"),
      accessor: (row) => row.name,
    },
    {
      id: "contact",
      label: "Contact",
      accessor: (row) => row.email,
    },
    {
      id: "rezervare",
      label: getLabel("hotel", "nextAppointment"),
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
      id: "personal",
      label: getLabel("hotel", "doctor"),
      accessor: (row) => row.name,
    },
    {
      id: "departament",
      label: getLabel("hotel", "specialty"),
      accessor: (row) => row.specialty,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
    {
      id: "clienti",
      label: getLabel("hotel", "patientsToday"),
      accessor: (row) => row.patientsToday,
    },
    {
      id: "servicii",
      label: getLabel("hotel", "activeTreatments"),
      accessor: (row) => row.activeTreatments,
    },
    {
      id: "sector",
      label: getLabel("hotel", "cabinet"),
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
      label: getLabel("hotel", "treatment"),
      accessor: (row) => row.name,
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => row.duration,
    },
    {
      id: "personal",
      label: getLabel("hotel", "recommendedDoctor"),
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
  programari: [
    {
      id: "client",
      label: getLabel("hotel", "patient"),
      accessor: (row) => row.patient,
    },
    {
      id: "camera",
      label: "Cameră",
      accessor: (row) => row.roomId,
    },
    {
      id: "serviciu",
      label: getLabel("hotel", "treatment"),
      accessor: (row) => row.treatment,
    },
    {
      id: "checkin",
      label: "Check-in",
      accessor: (row) => {
        const date = new Date(row.startDate || row.date || row.start)
        return date.toLocaleDateString("ro-RO")
      },
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => `${row.duration || row.durationDays || 0} zile`,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
  ],
}

