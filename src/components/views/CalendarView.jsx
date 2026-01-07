import React, { useMemo, useEffect, useState } from "react"
import Calendar from "../Calendar"
import GanttChart from "../GanttChart"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { useActionBarModel } from "@/models/ActionBarModel"
import ReservationModel from "@/models/ReservationModel"

const CalendarView = () => {
  const {
    selectedDate,
    calendarView,
    openDrawer
  } = useAppStore()
  const { workspaceType, config } = useWorkspaceConfig()

  // Folosește modelul pentru a obține informații despre calendar
  const { calendarType } = useActionBarModel()

  // Debug pentru a verifica valoarea calendarType
  console.log("CalendarType:", calendarType, "WorkspaceType:", workspaceType, "Config:", config)

  // Stare pentru modelul de rezervări
  const [reservationModel, setReservationModel] = useState(null)
  const [reservations, setReservations] = useState([])

  // Inițializează modelul de rezervări
  useEffect(() => {
    const model = new ReservationModel(workspaceType)
    setReservationModel(model)

    // Abonează-te la schimbări
    const unsubscribe = model.subscribe(() => {
      setReservations(model.getReservations())
    })

    // Setează rezervările inițiale
    setReservations(model.getReservations())

    return unsubscribe
  }, [workspaceType])

  // Determină ce date să folosească în funcție de tipul de calendar
  const calendarData = useMemo(() => {
    if (!reservationModel) return []

    switch (calendarType) {
      case "hotel":
        return reservationModel.getGanttItems()
      case "fitness":
        return reservationModel.getGanttItems()
      case "clinic":
      default:
        return reservationModel.getCalendarEvents()
    }
  }, [reservationModel, calendarType])

  // Handler pentru click pe un eveniment
  const handleEventClick = (event) => {
    openDrawer("appointments", event, "edit")
  }

  // Handler pentru creare eveniment
  const handleEventCreate = (date, hour) => {
    const initialData = {
      date: date,
      time: hour || "09:00",
    }
    openDrawer("appointments", initialData, "create")
  }

  // Handler pentru salvare rezervare
  const handleSaveReservation = (data) => {
    if (!reservationModel) return null

    const isCreateMode = data.id === undefined || data.id === null

    if (isCreateMode) {
      return reservationModel.addReservation(calendarType, data)
    } else {
      return reservationModel.updateReservation(data.id, data)
    }
  }

  // Handler pentru ștergere rezervare
  const handleDeleteReservation = (id) => {
    if (!reservationModel) return null

    return reservationModel.deleteReservation(id)
  }

  // Determină ce componentă să randeze în funcție de tipul de calendar
  const renderCalendar = () => {
    switch (calendarType) {
      case "hotel":
        return (
          <div className="w-full h-full">
            <GanttChart
              data={calendarData}
              onEventClick={handleEventClick}
              onEventCreate={handleEventCreate}
              onSave={handleSaveReservation}
              onDelete={handleDeleteReservation}
              workspaceType={workspaceType}
            />
          </div>
        )
      case "fitness":
        return (
          <div className="w-full h-full">
            <GanttChart
              data={calendarData}
              onEventClick={handleEventClick}
              onEventCreate={handleEventCreate}
              onSave={handleSaveReservation}
              onDelete={handleDeleteReservation}
              workspaceType={workspaceType}
            />
          </div>
        )
      case "clinic":
      default:
        return (
          <div className="w-full h-full">
            <Calendar
              events={calendarData}
              currentView={calendarView}
              currentDate={selectedDate}
              onEventClick={handleEventClick}
              onEventCreate={handleEventCreate}
              onSave={handleSaveReservation}
              onDelete={handleDeleteReservation}
              workspaceType={workspaceType}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden">
      {renderCalendar()}
    </div>
  )
}

export default CalendarView
