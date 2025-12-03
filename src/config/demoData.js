// Date demo organizate per tip de entitate generică
// Helper pentru a normaliza tipul de workspace
const normalizeWorkspaceType = (workspaceType) => {
  if (workspaceType === "hotel") return "hotel"
  if (workspaceType === "fitness" || workspaceType === "sala-fitness") return "fitness"
  return "clinic"
}

// Date demo pentru clienți/pacienți
export const getDemoClients = (workspaceType) => {
  const type = normalizeWorkspaceType(workspaceType)
  
  if (type === "hotel") {
    return [
      {
        name: "Ion Popescu",
        email: "ion.popescu@email.com",
        phone: "0723 887 210",
        dePlata: "450 RON",
        upcoming: "Cazare Single - 12 feb, 14:00",
      },
      {
        name: "Maria Ionescu",
        email: "maria.ionescu@email.com",
        phone: "0721 535 298",
        dePlata: "280 RON",
        upcoming: "Cazare Double - 12 feb, 15:00",
      },
      {
        name: "Andrei Georgescu",
        email: "andrei.georgescu@email.com",
        phone: "0730 611 927",
        dePlata: "1200 RON",
        upcoming: "Suite Premium - 12 feb, 16:00",
      },
      {
        name: "Elena Stan",
        email: "elena.stan@email.com",
        phone: "0745 632 110",
        dePlata: "350 RON",
        upcoming: "Masaj relaxare - 12 feb, 18:00",
      },
      {
        name: "Dan Pop",
        email: "dan.pop@email.com",
        phone: "0733 440 118",
        dePlata: "0 RON",
        upcoming: "Breakfast buffet - 13 feb, 08:00",
      },
    ]
  }
  
  if (type === "fitness") {
    return [
      {
        name: "Ion Popescu",
        email: "ion.popescu@email.com",
        phone: "0723 887 210",
        dePlata: "450 RON",
        upcoming: "Abonament Standard - 12 feb, 09:00",
      },
      {
        name: "Maria Ionescu",
        email: "maria.ionescu@email.com",
        phone: "0721 535 298",
        dePlata: "280 RON",
        upcoming: "Abonament Premium - 12 feb, 10:00",
      },
      {
        name: "Andrei Georgescu",
        email: "andrei.georgescu@email.com",
        phone: "0730 611 927",
        dePlata: "1200 RON",
        upcoming: "Pachet Antrenament Personal - 12 feb, 11:00",
      },
      {
        name: "Elena Stan",
        email: "elena.stan@email.com",
        phone: "0745 632 110",
        dePlata: "350 RON",
        upcoming: "Consult nutriție - 12 feb, 16:00",
      },
      {
        name: "Dan Pop",
        email: "dan.pop@email.com",
        phone: "0733 440 118",
        dePlata: "0 RON",
        upcoming: "Pachet grup - 13 feb, 08:00",
      },
    ]
  }
  
  // Clinic (default)
  return [
    {
      name: "Ioana Marinescu",
      email: "ioana.marinescu@email.com",
      phone: "0723 887 210",
      dePlata: "450 RON",
      upcoming: "Control aparat dentar - 12 feb, 09:00",
    },
    {
      name: "Adrian Pavel",
      email: "adrian.pavel@email.com",
      phone: "0721 535 298",
      dePlata: "280 RON",
      upcoming: "Strângere arcuri - 12 feb, 10:45",
    },
    {
      name: "Maria Tudor",
      email: "maria.tudor@email.com",
      phone: "0730 611 927",
      dePlata: "1200 RON",
      upcoming: "Implant finalizare - 12 feb, 09:15",
    },
    {
      name: "Sorina Pătrașcu",
      email: "sorina.patrascu@email.com",
      phone: "0745 632 110",
      dePlata: "350 RON",
      upcoming: "Albire profesională - 12 feb, 08:45",
    },
    {
      name: "Carmen Iacob",
      email: "carmen.iacob@email.com",
      phone: "0733 440 118",
      dePlata: "0 RON",
      upcoming: "Chirurgie parodontală - 12 feb, 11:00",
    },
  ]
}

// Date demo pentru personal/medici/antrenori
export const getDemoStaff = (workspaceType) => {
  const type = normalizeWorkspaceType(workspaceType)
  
  if (type === "hotel") {
    return [
      {
        id: "pers-1",
        name: "Maria Popescu",
        specialty: "Recepție",
        color: "#6366F1",
      },
      {
        id: "pers-2",
        name: "Ion Ionescu",
        specialty: "Concierge",
        color: "#0EA5E9",
      },
      {
        id: "pers-3",
        name: "Elena Stan",
        specialty: "Housekeeping",
        color: "#22C55E",
      },
      {
        id: "pers-4",
        name: "Andrei Dima",
        specialty: "Spa & Wellness",
        color: "#F97316",
      },
    ]
  }
  
  if (type === "fitness") {
    return [
      {
        id: "antr-1",
        name: "Alexandru Popescu",
        specialty: "Fitness & Cardio",
        color: "#6366F1",
      },
      {
        id: "antr-2",
        name: "Maria Ionescu",
        specialty: "Yoga & Pilates",
        color: "#0EA5E9",
      },
      {
        id: "antr-3",
        name: "Andrei Stan",
        specialty: "Bodybuilding",
        color: "#22C55E",
      },
      {
        id: "antr-4",
        name: "Elena Dima",
        specialty: "CrossFit",
        color: "#F97316",
      },
    ]
  }
  
  // Clinic (default)
  return [
    {
      id: "dr-ionescu",
      name: "Dr. Ana Ionescu",
      specialty: "Ortodonție",
      color: "#6366F1",
    },
    {
      id: "dr-popescu",
      name: "Dr. Mihai Popescu",
      specialty: "Implantologie",
      color: "#0EA5E9",
    },
    {
      id: "dr-stan",
      name: "Dr. Irina Stan",
      specialty: "Estetică dentară",
      color: "#22C55E",
    },
    {
      id: "dr-dima",
      name: "Dr. Andrei Dima",
      specialty: "Chirurgie",
      color: "#F97316",
    },
  ]
}

// Date demo pentru servicii/tratamente/pachete
export const getDemoServices = (workspaceType) => {
  const type = normalizeWorkspaceType(workspaceType)
  
  if (type === "hotel") {
    return [
      {
        code: "SRV-001",
        name: "Cazare Single",
        duration: "1 zi",
        doctor: "Maria Popescu",
        price: "€120",
        status: "Disponibil",
      },
      {
        code: "SRV-002",
        name: "Cazare Double",
        duration: "1 zi",
        doctor: "Ion Ionescu",
        price: "€180",
        status: "Disponibil",
      },
      {
        code: "SRV-003",
        name: "Suite Premium",
        duration: "1 zi",
        doctor: "Elena Stan",
        price: "€320",
        status: "Promovat",
      },
      {
        code: "SRV-004",
        name: "Masaj relaxare",
        duration: "60 min",
        doctor: "Andrei Dima",
        price: "€80",
        status: "Disponibil",
      },
      {
        code: "SRV-005",
        name: "Breakfast buffet",
        duration: "1 zi",
        doctor: "Echipă generală",
        price: "€25",
        status: "Disponibil",
      },
    ]
  }
  
  if (type === "fitness") {
    return [
      {
        code: "PKG-001",
        name: "Abonament Standard",
        duration: "1 lună",
        doctor: "Alexandru Popescu",
        price: "€50",
        status: "Disponibil",
      },
      {
        code: "PKG-002",
        name: "Abonament Premium",
        duration: "1 lună",
        doctor: "Maria Ionescu",
        price: "€80",
        status: "Disponibil",
      },
      {
        code: "PKG-003",
        name: "Pachet Antrenament Personal",
        duration: "10 ședințe",
        doctor: "Andrei Stan",
        price: "€350",
        status: "Promovat",
      },
      {
        code: "PKG-004",
        name: "Consult nutriție",
        duration: "60 min",
        doctor: "Elena Dima",
        price: "€60",
        status: "Disponibil",
      },
      {
        code: "PKG-005",
        name: "Pachet grup",
        duration: "1 lună",
        doctor: "Echipă generală",
        price: "€40",
        status: "Disponibil",
      },
    ]
  }
  
  // Clinic (default)
  return [
    {
      code: "TR-014",
      name: "Implant complet",
      duration: "120 min",
      doctor: "Dr. Mihai Popescu",
      price: "€920",
      status: "Disponibil",
    },
    {
      code: "TR-032",
      name: "Fațete ceramice",
      duration: "90 min",
      doctor: "Dr. Irina Stan",
      price: "€740",
      status: "Necesită aprobare",
    },
    {
      code: "TR-021",
      name: "Reabilitare arcadă",
      duration: "150 min",
      doctor: "Dr. Ana Ionescu",
      price: "€1,120",
      status: "Disponibil",
    },
    {
      code: "TR-009",
      name: "Albire profesională",
      duration: "60 min",
      doctor: "Dr. Irina Stan",
      price: "€260",
      status: "Promovat",
    },
    {
      code: "TR-002",
      name: "Control periodic",
      duration: "30 min",
      doctor: "Echipă generală",
      price: "€80",
      status: "Disponibil",
    },
  ]
}

// Date demo pentru programări/rezervări
export const getDemoAppointments = (workspaceType) => {
  const type = normalizeWorkspaceType(workspaceType)
  const staff = getDemoStaff(workspaceType)
  const clients = getDemoClients(workspaceType)
  
  // Pentru hotel, programările sunt gestionate diferit
  if (type === "hotel") {
    return [
      {
        id: "rez-1",
        clientId: clients[0]?.email || "ion.popescu@email.com",
        clientName: clients[0]?.name || "Ion Popescu",
        roomId: "Camera 101",
        service: "Cazare Single",
        startDate: "2024-02-12",
        durationDays: 3,
        status: "confirmată",
      },
      {
        id: "rez-2",
        clientId: clients[1]?.email || "maria.ionescu@email.com",
        clientName: clients[1]?.name || "Maria Ionescu",
        roomId: "Camera 205",
        service: "Cazare Double",
        startDate: "2024-02-12",
        durationDays: 2,
        status: "confirmată",
      },
      {
        id: "rez-3",
        clientId: clients[2]?.email || "andrei.georgescu@email.com",
        clientName: clients[2]?.name || "Andrei Georgescu",
        roomId: "Suite 301",
        service: "Suite Premium",
        startDate: "2024-02-12",
        durationDays: 5,
        status: "confirmată",
      },
    ]
  }
  
  // Pentru fitness, returnăm programări cu clienți și ore
  if (type === "fitness") {
    return [
      {
        id: "fitness-appt-1",
        clientId: clients[0]?.email || "ion.popescu@email.com",
        clientName: clients[0]?.name || "Ion Popescu",
        trainerId: staff[0]?.id || "antr-1",
        training: "Antrenament Cardio",
        start: 9 * 60, // 09:00 în minute
        startMinutes: 9 * 60,
        duration: 60, // 60 minute
        status: "confirmată",
      },
      {
        id: "fitness-appt-2",
        clientId: clients[0]?.email || "ion.popescu@email.com",
        clientName: clients[0]?.name || "Ion Popescu",
        trainerId: staff[1]?.id || "antr-2",
        training: "Yoga",
        start: 17 * 60, // 17:00
        startMinutes: 17 * 60,
        duration: 45,
        status: "confirmată",
      },
      {
        id: "fitness-appt-3",
        clientId: clients[1]?.email || "maria.ionescu@email.com",
        clientName: clients[1]?.name || "Maria Ionescu",
        trainerId: staff[2]?.id || "antr-3",
        training: "Antrenament Personal",
        start: 10 * 60, // 10:00
        startMinutes: 10 * 60,
        duration: 90,
        status: "în curs",
      },
      {
        id: "fitness-appt-4",
        clientId: clients[2]?.email || "andrei.georgescu@email.com",
        clientName: clients[2]?.name || "Andrei Georgescu",
        trainerId: staff[2]?.id || "antr-3",
        training: "Bodybuilding",
        start: 11 * 60 + 30, // 11:30
        startMinutes: 11 * 60 + 30,
        duration: 75,
        status: "confirmată",
      },
    ]
  }
  
  // Clinic (default)
  return [
    {
      id: "appt-1",
      doctorId: staff[0]?.id || "dr-ionescu",
      patient: "Ioana Marinescu",
      treatment: "Control aparat dentar",
      start: 9 * 60,
      duration: 30,
      status: "confirmată",
    },
    {
      id: "appt-2",
      doctorId: staff[0]?.id || "dr-ionescu",
      patient: "Adrian Pavel",
      treatment: "Strângere arcuri",
      start: 10 * 60 + 30,
      duration: 45,
      status: "în curs",
    },
    {
      id: "appt-3",
      doctorId: staff[1]?.id || "dr-popescu",
      patient: "Maria Tudor",
      treatment: "Consult implant",
      start: 9 * 60 + 15,
      duration: 90,
      status: "confirmată",
    },
    {
      id: "appt-4",
      doctorId: staff[1]?.id || "dr-popescu",
      patient: "Dan Apostol",
      treatment: "Control post-operator",
      start: 11 * 60 + 30,
      duration: 45,
      status: "nouă",
    },
  ]
}

// Funcții legacy pentru compatibilitate
export const getDemoDoctors = (workspaceType) => {
  return getDemoStaff(workspaceType)
}

export const getDemoTreatments = (workspaceType) => {
  return getDemoServices(workspaceType)
}

export const getDemoPatients = (workspaceType) => {
  return getDemoClients(workspaceType)
}

