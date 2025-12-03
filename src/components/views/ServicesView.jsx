import EntityView from "./EntityView"
import { getDemoServices } from "@/config/demoData"

const ServicesView = () => {
  // Debug pentru a verifica ce se întâmplă
  console.log("ServicesView rendered")
  
  return (
    <EntityView
      entityType="services"
      demoDataFunction={getDemoServices}
    />
  )
}

export default ServicesView
