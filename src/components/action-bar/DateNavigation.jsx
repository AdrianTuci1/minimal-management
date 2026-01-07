import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, startOfWeek } from "date-fns"
import { ro } from "date-fns/locale"
import useAppStore from "@/store/appStore"

const DateNavigation = ({
    isHotelReservations,
    isClinicCalendar,
    isCalendarOpen,
    setIsCalendarOpen,
    handleCalendarOpenChange,
    handleDateRangeSelect,
    normalizedDateRange,
    formattedDateRange,
    formattedDate
}) => {
    const {
        selectedDate,
        setSelectedDate,
        shiftDate,
        jumpToToday,
        selectedDateRange,
        setSelectedDateRange,
        navigateCalendar,
    } = useAppStore()

    const shiftDateRange = (weeks) => {
        const currentFrom = selectedDateRange?.from
            ? (selectedDateRange.from instanceof Date ? selectedDateRange.from : new Date(selectedDateRange.from))
            : startOfWeek(new Date(), { weekStartsOn: 1 })
        const newFrom = addDays(currentFrom, weeks * 7)
        const newTo = addDays(newFrom, 6)
        setSelectedDateRange({ from: newFrom, to: newTo })
    }

    const jumpToCurrentWeek = () => {
        const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
        setSelectedDateRange({ from: monday, to: addDays(monday, 6) })
    }

    if (isHotelReservations) {
        return (
            <>
                <div className="flex items-center rounded-xl border border-border/80 bg-muted/40">
                    <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => shiftDateRange(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Săptămâna anterioară</span>
                    </Button>
                    <Popover open={isCalendarOpen} onOpenChange={handleCalendarOpenChange}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-10 min-w-[180px] items-center justify-start gap-2 rounded-lg px-4 py-1 text-left text-sm font-medium">
                                <span className="font-semibold text-foreground">{formattedDateRange}</span>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto rounded-lg border-border/80 bg-white p-0 shadow-xl">
                            <Calendar
                                mode="range"
                                selected={normalizedDateRange}
                                onSelect={handleDateRangeSelect}
                                locale={ro}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => shiftDateRange(1)}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Săptămâna următoare</span>
                    </Button>
                </div>
                <Button variant="outline" className="h-10 rounded-xl px-3" onClick={jumpToCurrentWeek}>
                    <CalendarCheck className="h-4 w-4" />
                    <span className="sr-only">Săptămâna curentă</span>
                </Button>
            </>
        )
    }

    if (isClinicCalendar) {
        return (
            <>
                <div className="flex items-center rounded-xl border border-border/80 bg-muted/40">
                    <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => navigateCalendar(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Anterior</span>
                    </Button>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-10 min-w-[140px] items-center justify-start gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium">
                                <span className="font-semibold capitalize text-foreground">{formattedDate}</span>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto rounded-lg border-border/80 bg-white p-0 shadow-xl">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(value) => {
                                    if (value) {
                                        setSelectedDate(value)
                                    }
                                    setIsCalendarOpen(false)
                                }}
                                locale={ro}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => navigateCalendar(1)}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Următorul</span>
                    </Button>
                </div>
                <Button variant="outline" className="h-10 rounded-xl px-3" onClick={jumpToToday}>
                    <CalendarCheck className="h-4 w-4" />
                    <span className="sr-only">Astăzi</span>
                </Button>
            </>
        )
    }

    // Default / Other calendar types
    return (
        <>
            <div className="flex items-center rounded-xl border border-border/80 bg-muted/40">
                <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => shiftDate(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                </Button>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-10 min-w-[90px] items-center justify-start gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium">
                            <span className="font-semibold capitalize text-foreground">{formattedDate}</span>
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto rounded-lg border-border/80 bg-white p-0 shadow-xl">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(value) => {
                                if (value) {
                                    setSelectedDate(value)
                                }
                                setIsCalendarOpen(false)
                            }}
                            locale={ro}
                        />
                    </PopoverContent>
                </Popover>
                <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => shiftDate(1)}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Următorul</span>
                </Button>
            </div>
            <Button variant="outline" className="h-10 rounded-xl px-3" onClick={jumpToToday}>
                <CalendarCheck className="h-4 w-4" />
                <span className="sr-only">Astăzi</span>
            </Button>
        </>
    )
}

export default DateNavigation
