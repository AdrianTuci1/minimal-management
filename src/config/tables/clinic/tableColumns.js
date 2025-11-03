// Configurații de tabele pentru clinică dentară
import { getLabel } from "../../workspaceConfig"

export const clinicTableColumns = {
  pacienti: [
    {
      id: "pacient",
      label: getLabel("clinic", "patient"),
      accessor: (row) => row.name,
    },
    {
      id: "contact",
      label: "Contact",
      accessor: (row) => row.email,
    },
    {
      id: "programare",
      label: getLabel("clinic", "nextAppointment"),
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
      label: getLabel("clinic", "doctor"),
      accessor: (row) => row.name,
    },
    {
      id: "specializare",
      label: getLabel("clinic", "specialty"),
      accessor: (row) => row.specialty,
    },
    {
      id: "status",
      label: "Status",
      accessor: (row) => row.status,
    },
    {
      id: "pacienti",
      label: getLabel("clinic", "patientsToday"),
      accessor: (row) => row.patientsToday,
    },
    {
      id: "tratamente",
      label: getLabel("clinic", "activeTreatments"),
      accessor: (row) => row.activeTreatments,
    },
    {
      id: "urmatoare",
      label: "Următoarea fereastră",
      accessor: (row) => row.nextSlot,
    },
    {
      id: "cabinet",
      label: getLabel("clinic", "cabinet"),
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
      label: getLabel("clinic", "treatment"),
      accessor: (row) => row.name,
    },
    {
      id: "durata",
      label: "Durată",
      accessor: (row) => row.duration,
    },
    {
      id: "medic",
      label: getLabel("clinic", "recommendedDoctor"),
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
      id: "pacient",
      label: getLabel("clinic", "patient"),
      accessor: (row) => row.patient,
    },
    {
      id: "medic",
      label: getLabel("clinic", "doctor"),
      accessor: (row) => row.doctorId,
    },
    {
      id: "tratament",
      label: getLabel("clinic", "treatment"),
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
}

