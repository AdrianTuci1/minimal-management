import EntityView from "./EntityView"
import { getDemoPatients } from "@/config/demoData"

const ClientsView = () => {
  return (
    <EntityView
      entityType="clients"
      demoDataFunction={getDemoPatients}
    />
  )
}

export default ClientsView
