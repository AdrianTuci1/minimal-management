// Configurații de tabele pentru sală de fitness
import { getLabel } from "../../workspaceConfig"

export const fitnessTableColumns = {
  pacienti: [
    {
      id: "client",
      label: getLabel("fitness", "patient"),
      accessor: (row) => row.name,
    },
    {
      id: "contact",
      label: "Contact",
      accessor: (row) => row.email,
    },
    {
      id: "programare",
      label: getLabel("fitness", "nextAppointment"),
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
      id: "antrenor",
      label: getLabel("fitness", "doctor"),
      accessor: (row) => row.name,
    },
    {
      id: "specializare",
      label: getLabel("fitness", "specialty"),
      accessor: (row) => row.specialty,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
    {
      id: "clienti",
      label: getLabel("fitness", "patientsToday"),
      accessor: (row) => row.patientsToday,
    },
    {
      id: "pachete",
      label: getLabel("fitness", "activeTreatments"),
      accessor: (row) => row.activeTreatments,
    },
    {
      id: "zona",
      label: getLabel("fitness", "cabinet"),
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
      label: getLabel("fitness", "treatment"),
      accessor: (row) => row.name,
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => row.duration,
    },
    {
      id: "antrenor",
      label: getLabel("fitness", "recommendedDoctor"),
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
      label: getLabel("fitness", "patient"),
      accessor: (row) => row.clientName || row.patient,
    },
    {
      id: "antrenor",
      label: getLabel("fitness", "doctor"),
      accessor: (row) => row.trainerId || row.doctorId,
    },
    {
      id: "antrenament",
      label: "Antrenament",
      accessor: (row) => row.training || row.treatment,
    },
    {
      id: "ora",
      label: "Oră",
      accessor: (row) => {
        const startMinutes = row.start || row.startMinutes || 0
        const hours = Math.floor(startMinutes / 60)
        const minutes = startMinutes % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      },
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => `${row.duration || 0} min`,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
  ],
}

