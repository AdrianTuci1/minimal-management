import EntityView from "./EntityView"
import { getDemoAppointments } from "@/config/demoData"

const AppointmentsView = () => {
  return (
    <EntityView
      entityType="appointments"
      demoDataFunction={getDemoAppointments}
    />
  )
}

export default AppointmentsView
