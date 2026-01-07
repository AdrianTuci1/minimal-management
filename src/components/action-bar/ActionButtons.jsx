import React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const ActionButtons = ({ actions = [] }) => {
    return (
        <>
            {actions.map((action) => (
                <Button
                    key={action.id}
                    variant={action.variant ?? "default"}
                    className="h-10 rounded-xl px-3"
                    onClick={action.onClick}
                    type="button"
                >
                    {action.icon ? (
                        <action.icon className="h-4 w-4" />
                    ) : action.label?.includes("Adaugă") || action.label?.includes("Creează") ? (
                        <Plus className="h-4 w-4" />
                    ) : (
                        action.label
                    )}
                    {!action.label?.includes("Adaugă") && !action.label?.includes("Creează") && !action.icon && (
                        <span className="sr-only">{action.label}</span>
                    )}
                </Button>
            ))}
        </>
    )
}

export default ActionButtons
