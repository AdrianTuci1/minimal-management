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
      // Etichete pentru entități
      doctors: "Medici",
      patients: "Pacienți",
      treatments: "Tratamente",
      appointments: "Programări",
      
      // Etichete pentru acțiuni
      addDoctor: "Adaugă medic",
      addPatient: "Adaugă pacient",
      addTreatment: "Adaugă tratament",
      
      // Etichete pentru câmpuri
      specialty: "Specializare",
      cabinet: "Cabinet",
      doctor: "Medic",
      patient: "Pacient",
      treatment: "Tratament",
      recommendedDoctor: "Medic recomandat",
      patientsToday: "Pacienți azi",
      activeTreatments: "Tratamente active",
      nextAppointment: "Programare următoare",
    },
    menuItems: [
      { id: "kpi", label: "KPI", icon: "Activity" },
      { id: "programari", label: "Programari", icon: "CalendarDays" },
      { id: "tratamente", label: "Tratamente", icon: "Wand2" },
      { id: "pacienti", label: "Pacienti", icon: "Users" },
      { id: "medici", label: "Medici", icon: "UserCog" },
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
      doctors: "Antrenori",
      patients: "Clienți",
      treatments: "Pachete",
      appointments: "Programări",
      
      addDoctor: "Adaugă antrenor",
      addPatient: "Adaugă client",
      addTreatment: "Adaugă pachet",
      
      specialty: "Specializare",
      cabinet: "Zonă",
      doctor: "Antrenor",
      patient: "Client",
      treatment: "Pachet",
      recommendedDoctor: "Antrenor recomandat",
      patientsToday: "Clienți azi",
      activeTreatments: "Pachete active",
      nextAppointment: "Programare următoare",
    },
    menuItems: [
      { id: "kpi", label: "KPI", icon: "Activity" },
      { id: "programari", label: "Programari", icon: "CalendarDays" },
      { id: "tratamente", label: "Pachete", icon: "Wand2" },
      { id: "pacienti", label: "Clienți", icon: "Users" },
      { id: "medici", label: "Antrenori", icon: "UserCog" },
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
      doctors: "Personal",
      patients: "Clienți",
      treatments: "Servicii",
      appointments: "Rezervări",
      
      addDoctor: "Adaugă personal",
      addPatient: "Adaugă client",
      addTreatment: "Adaugă serviciu",
      
      specialty: "Departament",
      cabinet: "Sector",
      doctor: "Personal",
      patient: "Client",
      treatment: "Serviciu",
      recommendedDoctor: "Personal recomandat",
      patientsToday: "Clienți azi",
      activeTreatments: "Servicii active",
      nextAppointment: "Rezervare următoare",
    },
    menuItems: [
      { id: "kpi", label: "KPI", icon: "Activity" },
      { id: "programari", label: "Rezervări", icon: "CalendarDays" },
      { id: "tratamente", label: "Servicii", icon: "Wand2" },
      { id: "pacienti", label: "Clienți", icon: "Users" },
      { id: "medici", label: "Personal", icon: "UserCog" },
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

