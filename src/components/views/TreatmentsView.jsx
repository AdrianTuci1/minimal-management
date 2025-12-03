import EntityView from "./EntityView"
import { getDemoTreatments } from "@/config/demoData"
import { FileText } from "lucide-react"

const TreatmentsView = () => {
  // Define custom tabs for treatments
  const customTabs = [
    {
      id: "details",
      icon: FileText,
      label: "Detalii",
    },
  ]

  // Define custom renderer for status column
  const customRenderers = {
    status: (item) => {
const statusTone = {
  Disponibil: "bg-emerald-500/10 text-emerald-600",
  "Necesită aprobare": "bg-amber-500/10 text-amber-600",
  Promovat: "bg-blue-500/10 text-blue-600",
}

      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${
            statusTone[item.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {item.status}
        </span>
      )
    }
  }

  return (
    <EntityView
      entityType="tratamente"
      demoDataFunction={getDemoTreatments}
      customTabs={customTabs}
      customRenderers={customRenderers}
                  />
  )
}

export default TreatmentsView

