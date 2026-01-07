// Demo data for Calendar component - Clinic appointments
const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

const getRelativeDate = (daysOffset, hours, minutes) => {
  const date = new Date(today)
  date.setDate(date.getDate() + daysOffset)
  if (hours !== undefined && minutes !== undefined) {
    date.setHours(hours, minutes, 0, 0)
  }
  return date
}

export const clinicAppointmentsData = [
  {
    id: "apt-1",
    title: "Consultație dentară - Elena Ionescu",
    startTime: new Date(getRelativeDate(0).setHours(14, 30, 0, 0)).toISOString(), // manual timestamp for overlap test
    endTime: new Date(getRelativeDate(0).setHours(15, 30, 0, 0)).toISOString(),
    patient: "Elena Ionescu",
    doctor: "Dr. Popescu",
    treatment: "Consult primary",
    status: "confirmed",
    color: "blue",
    room: "Cabinet 1",
    attendees: [
      {
        id: "doc-1",
        name: "Dr. Ion Ionescu",
        avatar: "https://i.pravatar.cc/150?img=12"
      }
    ]
  },
  {
    id: "overlap-test-1",
    title: "Suprapunere 1",
    startTime: new Date(getRelativeDate(0).setHours(14, 45, 0, 0)).toISOString(), // Overlaps with apt-1
    endTime: new Date(getRelativeDate(0).setHours(15, 15, 0, 0)).toISOString(), // Short duration, inside apt-1
    patient: "Test Suprapunere 1",
    doctor: "Dr. Popescu",
    treatment: "Tratament A",
    status: "confirmed",
    color: "green",
    room: "Cabinet 1",
    attendees: []
  },
  {
    id: "overlap-test-2",
    title: "Suprapunere 2",
    startTime: new Date(getRelativeDate(0).setHours(15, 0, 0, 0)).toISOString(), // Overlaps with apt-1
    endTime: new Date(getRelativeDate(0).setHours(16, 0, 0, 0)).toISOString(),
    patient: "Test Suprapunere 2",
    doctor: "Dr. Enache",
    treatment: "Tratament B",
    status: "confirmed",
    color: "orange",
    room: "Cabinet 1",
    attendees: []
  },
  {
    id: "apt-2",
    title: "Detartraj - Alexandru Marin",
    startTime: getRelativeDate(0, 10, 30).toISOString(), // Today 10:30
    endTime: getRelativeDate(0, 11, 30).toISOString(), // Today 11:30
    patient: "Alexandru Marin",
    treatment: "Detartraj",
    color: "green",
    allDay: false,
    attendees: [
      {
        id: "doc-2",
        name: "Dr. Elena Vasilescu",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    ]
  },
  {
    id: "apt-3",
    title: "Tratament canal radicular - Ion Georgescu",
    startTime: getRelativeDate(0, 14, 0).toISOString(), // Today 14:00
    endTime: getRelativeDate(0, 16, 0).toISOString(), // Today 16:00
    patient: "Ion Georgescu",
    treatment: "Tratament canal",
    color: "orange",
    allDay: false,
    attendees: [
      {
        id: "doc-1",
        name: "Dr. Ion Ionescu",
        avatar: "https://i.pravatar.cc/150?img=12"
      }
    ]
  },
  {
    id: "apt-4",
    title: "Control de rutină - Ana Dumitru",
    startTime: getRelativeDate(1, 9, 0).toISOString(), // Tomorrow 09:00
    endTime: getRelativeDate(1, 9, 30).toISOString(), // Tomorrow 09:30
    patient: "Ana Dumitru",
    treatment: "Control rutină",
    color: "teal",
    allDay: false,
    attendees: [
      {
        id: "doc-2",
        name: "Dr. Elena Vasilescu",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    ]
  },
  {
    id: "apt-5",
    title: "Montare aparat dentar - Mihai Radu",
    startTime: getRelativeDate(1, 11, 0).toISOString(), // Tomorrow 11:00
    endTime: getRelativeDate(1, 12, 30).toISOString(), // Tomorrow 12:30
    patient: "Mihai Radu",
    treatment: "Aparat dentar",
    color: "purple",
    allDay: false,
    attendees: [
      {
        id: "doc-3",
        name: "Dr. Mihai Popescu",
        avatar: "https://i.pravatar.cc/150?img=8"
      }
    ]
  },
  {
    id: "apt-6",
    title: "Albire dentară - Cristina Stanciu",
    startTime: getRelativeDate(2, 13, 0).toISOString(), // Day after tomorrow 13:00
    endTime: getRelativeDate(2, 14, 30).toISOString(), // Day after tomorrow 14:30
    patient: "Cristina Stanciu",
    treatment: "Albire dentară",
    color: "pink",
    allDay: false,
    attendees: [
      {
        id: "doc-2",
        name: "Dr. Elena Vasilescu",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    ]
  },
  {
    id: "apt-7",
    title: "Extracție molar - George Andrei",
    startTime: getRelativeDate(3, 10, 0).toISOString(), // +3 days 10:00
    endTime: getRelativeDate(3, 11, 0).toISOString(), // +3 days 11:00
    patient: "George Andrei",
    treatment: "Extracție",
    color: "red",
    allDay: false,
    attendees: [
      {
        id: "doc-1",
        name: "Dr. Ion Ionescu",
        avatar: "https://i.pravatar.cc/150?img=12"
      }
    ]
  },
  {
    id: "apt-8",
    title: "Consultație ortodontică - Laura Mitrea",
    startTime: getRelativeDate(3, 15, 0).toISOString(), // +3 days 15:00
    endTime: getRelativeDate(3, 16, 0).toISOString(), // +3 days 16:00
    patient: "Laura Mitrea",
    treatment: "Consult orto",
    color: "yellow",
    allDay: false,
    attendees: [
      {
        id: "doc-3",
        name: "Dr. Mihai Popescu",
        avatar: "https://i.pravatar.cc/150?img=8"
      }
    ]
  }
]

export default clinicAppointmentsData
