// Configurații pentru diferite tipuri de workspace
// Fiecare tip definește etichete personalizate pentru entități și meniuri

// Map pentru ID-urile din Dashboard către tipurile de configurare
export const workspaceTypeMap = {
  "clinica-dentara": "clinic",
  "sala-fitness": "fitness",
  "hotel": "hotel",
  "salon": "clinic", // Default la clinic pentru salon
  "reparatii": "clinic", // Default la clinic pentru reparații
}

export const workspaceTypes = {
  clinic: {
    id: "clinic",
    name: "Clinică",
    labels: {
      // Etichete pentru entități generice
      clients: "Pacienți",
      staff: "Medici",
      services: "Tratamente",
      appointments: "Programări",
      leads: "Lead-uri",

      // Etichete pentru acțiuni
      addClient: "Adaugă pacient",
      addStaff: "Adaugă medic",
      addService: "Adaugă tratament",
      addAppointment: "Adaugă programare",
      addLead: "Adaugă lead",

      // Etichete pentru câmpuri
      specialty: "Specializare",
      cabinet: "Cabinet",
      client: "Pacient",
      staff: "Medic",
      service: "Tratament",
      appointment: "Programare",
      lead: "Lead",
      recommendedStaff: "Medic recomandat",
      clientsToday: "Pacienți azi",
      activeServices: "Tratamente active",
      nextAppointment: "Programare următoare",
    },
    menuItems: [
      { id: "kpi", label: "Home", icon: "Home" },
      { id: "appointments", label: "Programari", icon: "CalendarDays" },
      { id: "services", label: "Tratamente", icon: "Wand2" },
      { id: "clients", label: "Pacienti", icon: "Users" },
      { id: "staff", label: "Medici", icon: "UserCog" },
      { id: "automatizari", label: "Automatizari", icon: "Zap" },
      { id: "setari", label: "Setari", icon: "Settings" },
    ],
    // Componente personalizate (opțional, pentru viitor)
    components: {
      appointments: "Whiteboard", // Componenta default pentru programări
    },
  },

  fitness: {
    id: "fitness",
    name: "Sala de sport",
    labels: {
      // Etichete pentru entități generice
      clients: "Clienți",
      staff: "Antrenori",
      services: "Pachete",
      appointments: "Programări",

      // Etichete pentru acțiuni
      addClient: "Adaugă client",
      addStaff: "Adaugă antrenor",
      addService: "Adaugă pachet",
      addAppointment: "Adaugă programare",

      // Etichete pentru câmpuri
      specialty: "Specializare",
      cabinet: "Zonă",
      client: "Client",
      staff: "Antrenor",
      service: "Pachet",
      appointment: "Programare",
      recommendedStaff: "Antrenor recomandat",
      clientsToday: "Clienți azi",
      activeServices: "Pachete active",
      nextAppointment: "Programare următoare",
    },
    menuItems: [
      { id: "kpi", label: "Home", icon: "Home" },
      { id: "appointments", label: "Programari", icon: "CalendarDays" },
      { id: "services", label: "Pachete", icon: "Wand2" },
      { id: "clients", label: "Clienți", icon: "Users" },
      { id: "staff", label: "Antrenori", icon: "UserCog" },
      { id: "automatizari", label: "Automatizari", icon: "Zap" },
      { id: "setari", label: "Setari", icon: "Settings" },
    ],
    components: {
      appointments: "Whiteboard",
    },
  },

  hotel: {
    id: "hotel",
    name: "Hotel",
    labels: {
      // Etichete pentru entități generice
      clients: "Clienți",
      staff: "Personal",
      services: "Servicii",
      appointments: "Rezervări",

      // Etichete pentru acțiuni
      addClient: "Adaugă client",
      addStaff: "Adaugă personal",
      addService: "Adaugă serviciu",
      addAppointment: "Adaugă rezervare",

      // Etichete pentru câmpuri
      specialty: "Departament",
      cabinet: "Sector",
      client: "Client",
      staff: "Personal",
      service: "Serviciu",
      appointment: "Rezervare",
      recommendedStaff: "Personal recomandat",
      clientsToday: "Clienți azi",
      activeServices: "Servicii active",
      nextAppointment: "Rezervare următoare",
    },
    menuItems: [
      { id: "kpi", label: "Home", icon: "Home" },
      { id: "appointments", label: "Rezervări", icon: "CalendarDays" },
      { id: "services", label: "Servicii", icon: "Wand2" },
      { id: "clients", label: "Clienți", icon: "Users" },
      { id: "staff", label: "Personal", icon: "UserCog" },
      { id: "automatizari", label: "Automatizari", icon: "Zap" },
      { id: "setari", label: "Setari", icon: "Settings" },
    ],
    components: {
      appointments: "HotelWhiteboard", // Whiteboard orizontal cu camere de hotel
    },
  },
}

// Funcție helper pentru a obține configurația unui tip de workspace
// Acceptă atât ID-uri din Dashboard cât și tipuri directe
export const getWorkspaceConfig = (workspaceType) => {
  // Verifică dacă este un ID din Dashboard și îl convertește
  const mappedType = workspaceTypeMap[workspaceType] || workspaceType
  return workspaceTypes[mappedType] || workspaceTypes.clinic
}

// Funcție helper pentru a obține eticheta pentru o entitate în contextul unui tip de workspace
export const getLabel = (workspaceType, key) => {
  const config = getWorkspaceConfig(workspaceType)
  return config.labels[key] || key
}

// Funcție helper pentru a obține meniul pentru un tip de workspace
export const getMenuItems = (workspaceType) => {
  const config = getWorkspaceConfig(workspaceType)
  return config.menuItems
}

