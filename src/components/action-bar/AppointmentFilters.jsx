import React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

const AppointmentFilters = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 rounded-xl px-3" type="button">
                    <span className="font-semibold">Filtru</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>Filtrează programări</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>
                    Doar programările mele
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                    Doar de astăzi
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                    Doar confirmate
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AppointmentFilters
