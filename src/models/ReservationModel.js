import { clinicAppointmentsData } from "@/config/demoCalendarData"
import { hotelReservationsData, fitnessWorkoutData } from "@/config/demoGanttData"
import { getDemoAppointments } from "@/config/demoData"

// Model de bază pentru rezervări/programări
export class BaseReservation {
  constructor(data) {
    this.id = data.id || this.generateId()
    this.title = data.title || ""
    this.date = data.date || new Date()
    this.startTime = data.startTime || ""
    this.endTime = data.endTime || ""
    this.status = data.status || "programat"
    this.notes = data.notes || ""
    this.color = data.color || "#3B82F6"
  }

  generateId() {
    return `${this.constructor.name.toLowerCase()}-${Date.now()}`
  }

  // Metodă pentru a transforma rezervarea în format pentru calendar
  toCalendarEvent() {
    return {
      id: this.id,
      title: this.title,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      notes: this.notes,
      color: this.color,
    }
  }

  // Metodă pentru a transforma rezervarea în format pentru Gantt
  toGanttItem() {
    return {
      id: this.id,
      title: this.title,
      startDate: this.date,
      duration: this.calculateDuration(),
      status: this.status,
      notes: this.notes,
      color: this.color,
    }
  }

  calculateDuration() {
    // Implementare de bază, va fi suprascrisă în clasele derivate
    return 1
  }
}

// Model pentru programări clinice
export class ClinicAppointment extends BaseReservation {
  constructor(data) {
    super(data)
    this.patient = data.patient || ""
    this.doctor = data.doctor || ""
    this.treatment = data.treatment || ""
    this.room = data.room || ""
    this.type = "clinic"
  }

  toCalendarEvent() {
    return {
      ...super.toCalendarEvent(),
      patient: this.patient,
      doctor: this.doctor,
      treatment: this.treatment,
      room: this.room,
      type: this.type,
    }
  }

  calculateDuration() {
    if (this.startTime && this.endTime) {
      const start = new Date(`2000-01-01T${this.startTime}`)
      const end = new Date(`2000-01-01T${this.endTime}`)
      return (end - start) / (1000 * 60 * 60) // durata în ore
    }
    return 1
  }
}

// Model pentru rezervări hotel
export class HotelReservation extends BaseReservation {
  constructor(data) {
    super(data)
    this.guest = data.guest || ""
    this.roomId = data.roomId || ""
    this.service = data.service || ""
    this.durationDays = data.durationDays || 1
    this.checkIn = data.checkIn || this.date
    this.checkOut = data.checkOut || this.calculateCheckOut()
    this.type = "hotel"
  }

  calculateCheckOut() {
    const checkOut = new Date(this.checkIn)
    checkOut.setDate(checkOut.getDate() + this.durationDays)
    return checkOut
  }

  toGanttItem() {
    return {
      id: this.id,
      title: `${this.guest} - ${this.service}`,
      roomId: this.roomId,
      guest: this.guest,
      service: this.service,
      startDate: this.checkIn,
      durationDays: this.durationDays,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      status: this.status,
      color: this.color,
      type: this.type,
    }
  }

  calculateDuration() {
    return this.durationDays
  }
}

// Model pentru rezervări sala de fitness
export class FitnessReservation extends BaseReservation {
  constructor(data) {
    super(data)
    this.clientName = data.clientName || ""
    this.trainer = data.trainer || ""
    this.training = data.training || ""
    this.equipment = data.equipment || ""
    this.duration = data.duration || 60 // durata în minute
    this.type = "fitness"
  }

  toCalendarEvent() {
    return {
      ...super.toCalendarEvent(),
      clientName: this.clientName,
      trainer: this.trainer,
      training: this.training,
      equipment: this.equipment,
      duration: this.duration,
      type: this.type,
    }
  }

  toGanttItem() {
    return {
      id: this.id,
      title: `${this.clientName} - ${this.training}`,
      clientName: this.clientName,
      trainer: this.trainer,
      training: this.training,
      equipment: this.equipment,
      startDate: this.date,
      duration: this.duration,
      status: this.status,
      color: this.color,
      type: this.type,
    }
  }

  calculateDuration() {
    return this.duration / 60 // convertim minutele în ore
  }
}

// Factory pentru crearea rezervărilor în funcție de tip
export class ReservationFactory {
  static create(type, data) {
    switch (type) {
      case "clinic":
        return new ClinicAppointment(data)
      case "hotel":
        return new HotelReservation(data)
      case "fitness":
        return new FitnessReservation(data)
      default:
        return new BaseReservation(data)
    }
  }
}

// Model pentru gestionarea rezervărilor
export class ReservationModel {
  constructor(workspaceType) {
    this.workspaceType = workspaceType
    this.reservations = []
    this.listeners = []
    this.initializeData()
  }

  initializeData() {
    switch (this.workspaceType) {
      case "clinic":
      case "clinica-dentara":
        this.reservations = clinicAppointmentsData.map(item => 
          new ClinicAppointment({
            id: item.id,
            title: `${item.patient} - ${item.treatment}`,
            date: new Date(item.date),
            startTime: item.startTime,
            endTime: item.endTime,
            patient: item.patient,
            doctor: item.doctor,
            treatment: item.treatment,
            room: item.room,
            status: item.status,
            color: item.color,
          })
        )
        break
      case "hotel":
        this.reservations = hotelReservationsData.map(item => 
          new HotelReservation({
            id: item.id,
            title: `${item.guest} - ${item.service}`,
            guest: item.guest,
            roomId: item.roomId,
            service: item.service,
            durationDays: item.durationDays,
            checkIn: new Date(item.startDate),
            status: item.status,
          })
        )
        break
      case "fitness":
        this.reservations = fitnessWorkoutData.map(item => 
          new FitnessReservation({
            id: item.id,
            title: `${item.clientName} - ${item.training}`,
            date: new Date(item.date),
            startTime: item.startTime,
            endTime: item.endTime,
            clientName: item.clientName,
            trainer: item.trainer,
            training: item.training,
            equipment: item.equipment,
            duration: item.duration,
            status: item.status,
            color: item.color,
          })
        )
        break
      default:
        // Pentru alte tipuri de workspace, folosim datele demo standard
        const demoAppointments = getDemoAppointments(this.workspaceType)
        this.reservations = demoAppointments.map(item => 
          new ClinicAppointment({
            id: item.id,
            title: `${item.patient} - ${item.treatment}`,
            date: new Date(item.date),
            startTime: item.startTime,
            endTime: item.endTime,
            patient: item.patient,
            doctor: item.doctor,
            treatment: item.treatment,
            room: item.room,
            status: item.status,
            color: item.color,
          })
        )
    }
  }

  // Metode pentru managementul stării
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  // Metode pentru operații CRUD
  addReservation(type, data) {
    const reservation = ReservationFactory.create(type, data)
    this.reservations.push(reservation)
    this.notifyListeners()
    return reservation
  }

  updateReservation(id, data) {
    const index = this.reservations.findIndex(r => r.id === id)
    if (index !== -1) {
      this.reservations[index] = { ...this.reservations[index], ...data }
      this.notifyListeners()
      return this.reservations[index]
    }
    return null
  }

  deleteReservation(id) {
    const index = this.reservations.findIndex(r => r.id === id)
    if (index !== -1) {
      const deleted = this.reservations.splice(index, 1)[0]
      this.notifyListeners()
      return deleted
    }
    return null
  }

  getReservations() {
    return this.reservations
  }

  // Metode pentru a obține datele în formatul necesar pentru componente
  getCalendarEvents() {
    return this.reservations.map(r => r.toCalendarEvent())
  }

  getGanttItems() {
    return this.reservations.map(r => r.toGanttItem())
  }

  // Metode pentru filtrare
  getReservationsByDate(date) {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    
    const nextDate = new Date(targetDate)
    nextDate.setDate(nextDate.getDate() + 1)
    
    return this.reservations.filter(r => {
      const reservationDate = new Date(r.date)
      return reservationDate >= targetDate && reservationDate < nextDate
    })
  }

  getReservationsByDateRange(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return this.reservations.filter(r => {
      const reservationDate = new Date(r.date)
      return reservationDate >= start && reservationDate <= end
    })
  }

  getReservationsByRoom(roomId) {
    return this.reservations.filter(r => r.roomId === roomId)
  }

  getReservationsByDoctor(doctor) {
    return this.reservations.filter(r => r.doctor === doctor)
  }

  getReservationsByPatient(patient) {
    return this.reservations.filter(r => r.patient === patient)
  }
}

export default ReservationModel
