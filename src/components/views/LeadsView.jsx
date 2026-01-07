import EntityView from "./EntityView"
import { getDemoLeads } from "@/config/demoData"
import { UserPlus, MessageSquare, Clock } from "lucide-react"

const LeadsView = () => {
    // Define custom tabs for leads if needed
    const customTabs = [
        {
            id: "details",
            icon: UserPlus,
            label: "Detalii Lead",
        },
        {
            id: "notes",
            icon: MessageSquare,
            label: "Notițe & Istoric",
        },
        {
            id: "activity",
            icon: Clock,
            label: "Activitate",
        },
    ]

    return (
        <EntityView
            entityType="leads"
            demoDataFunction={getDemoLeads}
            customTabs={customTabs}
        />
    )
}

export default LeadsView
