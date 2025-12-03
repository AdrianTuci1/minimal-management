import EntityView from "./EntityView"
import { getDemoPatients } from "@/config/demoData"
import { User, Calendar, FileText } from "lucide-react"

const PatientsView = () => {
  // Define custom tabs for patients
  const customTabs = [
                {
                  id: "details",
                  icon: User,
      label: "Detalii",
                },
                {
                  id: "appointments",
                  icon: Calendar,
      label: "Programări",
                },
                {
                  id: "treatment",
                  icon: FileText,
      label: "Plan tratament",
                },
              ]

                return (
    <EntityView
      entityType="pacienti"
      demoDataFunction={getDemoPatients}
      customTabs={customTabs}
    />
  )
}

export default PatientsView

