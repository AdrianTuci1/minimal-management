import EntityView from "./EntityView"
import { getDemoServices } from "@/config/demoData"

const ServicesView = () => {
  return (
    <EntityView
      entityType="services"
      demoDataFunction={getDemoServices}
    />
  )
}

export default ServicesView
