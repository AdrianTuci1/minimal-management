import React from "react"
import { Button } from "@/components/ui/button"
import { CalendarDays, CalendarRange, CalendarClock } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import useAppStore from "@/store/appStore"

const ViewSwitch = ({ isHotelReservations, isClinicCalendar }) => {
    const { calendarView, setCalendarView } = useAppStore()

    const viewButtonLabels = {
        day: "1",
        week: "7",
        month: "30-31"
    }

    if (isHotelReservations) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 rounded-xl px-3 gap-2" type="button">
                        <span className="font-semibold">Săptămână</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuLabel>Vizualizare rezervări</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value="week" onValueChange={() => { }}>
                        <DropdownMenuRadioItem value="week">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            Săptămână
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="month">
                            <CalendarRange className="h-4 w-4 mr-2" />
                            Lună
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    if (isClinicCalendar) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 rounded-xl px-3 gap-2" type="button">
                        <span className="font-semibold">{viewButtonLabels[calendarView]}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuLabel>Vizualizare</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={calendarView} onValueChange={setCalendarView}>
                        <DropdownMenuRadioItem value="day">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            Zi
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="week">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            Săptămână
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="month">
                            <CalendarRange className="h-4 w-4 mr-2" />
                            Lună
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return null
}

export default ViewSwitch
