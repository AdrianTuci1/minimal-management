import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search, CalendarIcon, ChevronLeft, ChevronRight, Plus, CalendarCheck, CalendarDays, CalendarClock, CalendarRange } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import React, { useMemo, useState } from "react"
import { format, startOfWeek as startOfWeekFn, endOfWeek } from "date-fns"
import { ro } from "date-fns/locale"
import { addDays, startOfWeek } from "date-fns"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { getFilterColumns } from "@/config/tableColumns"

const ActionBar = ({ actions = [] }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [filters, setFilters] = useState({})
  const [tempDateRange, setTempDateRange] = useState(null) // Stocare temporară pentru selecție
  
  const { 
    activeMenu, 
    selectedDate, 
    setSelectedDate, 
    shiftDate, 
    jumpToToday,
    selectedDateRange,
    setSelectedDateRange,
    calendarView,
    setCalendarView,
    navigateCalendar,
  } = useAppStore()
  const { workspaceType, config } = useWorkspaceConfig()

  const isHotelReservations = activeMenu === "programari" && (config?.id === "hotel" || workspaceType === "hotel")
  const isClinicCalendar = activeMenu === "programari" && (config?.id === "clinic" || workspaceType === "clinic" || workspaceType === "clinica-dentara")

  const formattedDate = useMemo(() => {
    if (isClinicCalendar) {
      switch (calendarView) {
        case 'day':
          return format(selectedDate, "EEEE, d MMM", { locale: ro })
        case 'week': {
          const weekStart = startOfWeekFn(selectedDate, { weekStartsOn: 1 }) // Monday
          const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }) // Sunday
          const startDay = format(weekStart, "d", { locale: ro })
          const endDay = format(weekEnd, "d", { locale: ro })
          const month = format(weekEnd, "MMM", { locale: ro })
          return `${startDay}-${endDay} ${month}`
        }
        case 'month':
          return format(selectedDate, "MMMM yyyy", { locale: ro })
        default:
          return format(selectedDate, "EEEE, d MMM", { locale: ro })
      }
    }
    return format(selectedDate, "EEEE, d MMM", { locale: ro })
  }, [selectedDate, calendarView, isClinicCalendar])

  const formattedDateRange = useMemo(() => {
    if (!selectedDateRange?.from) return ""
    const fromDate = selectedDateRange.from instanceof Date 
      ? selectedDateRange.from 
      : new Date(selectedDateRange.from)
    const fromFormatted = format(fromDate, "d MMM", { locale: ro })
    if (selectedDateRange.to) {
      const toDate = selectedDateRange.to instanceof Date 
        ? selectedDateRange.to 
        : new Date(selectedDateRange.to)
      const toFormatted = format(toDate, "d MMM", { locale: ro })
      return `${fromFormatted} - ${toFormatted}`
    }
    return fromFormatted
  }, [selectedDateRange])

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

  // Normalize date range pentru Calendar
  const normalizedDateRange = useMemo(() => {
    // Folosește tempDateRange dacă există, altfel folosește selectedDateRange
    const rangeToUse = tempDateRange || selectedDateRange
    if (!rangeToUse) return undefined
    
    const from = rangeToUse.from 
      ? (rangeToUse.from instanceof Date ? rangeToUse.from : new Date(rangeToUse.from))
      : undefined
    const to = rangeToUse.to 
      ? (rangeToUse.to instanceof Date ? rangeToUse.to : new Date(rangeToUse.to))
      : undefined
    
    if (!from) return undefined
    
    return { from, to }
  }, [tempDateRange, selectedDateRange])

  // Handler pentru deschiderea calendarului
  const handleCalendarOpenChange = (open) => {
    if (open) {
      // Când se deschide, inițializează tempDateRange cu valoarea curentă
      setTempDateRange(selectedDateRange)
      setIsCalendarOpen(true)
    } else {
      // Când se încearcă să se închidă, verifică dacă ambele date sunt selectate
      if (tempDateRange?.from && tempDateRange?.to) {
        // Ambele date sunt selectate, salvează și închide
        setSelectedDateRange(tempDateRange)
        setTempDateRange(null)
        setIsCalendarOpen(false)
      } else {
        // Nu sunt selectate ambele date, previne închiderea
        // Nu schimbăm isCalendarOpen, calendarul rămâne deschis
      }
    }
  }

  // Handler pentru selecția datei
  const handleDateRangeSelect = (range) => {
    if (range) {
      setTempDateRange(range)
      // Dacă ambele date sunt selectate, salvează și închide automat
      if (range.from && range.to) {
        setSelectedDateRange(range)
        setTempDateRange(null)
        setIsCalendarOpen(false)
      }
    }
  }

  const filterColumns = useMemo(() => getFilterColumns(activeMenu, workspaceType), [activeMenu, workspaceType])
  const hasFilters = filterColumns.length > 0

  const handleFilterToggle = (columnId) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length
  }, [filters])

  const viewLabels = {
    day: "Zi",
    week: "Săptămână",
    month: "Lună"
  }

  const viewButtonLabels = {
    day: "1",
    week: "7",
    month: "30-31"
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2">
      {activeMenu === "programari" ? (
        isHotelReservations ? (
          <>
            <div className="flex items-center rounded-xl border border-border/80 bg-muted/40">
              <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => shiftDateRange(-1)}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Săptămâna anterioară</span>
              </Button>
              <Popover open={isCalendarOpen} onOpenChange={handleCalendarOpenChange}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-10 min-w-[180px] items-center justify-start gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium">
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
        ) : isClinicCalendar ? (
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
                    captionLayout={calendarView === 'month' ? 'dropdown-months' : 'label'}
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
            
            {/* View Selector pentru Calendar */}
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
          </>
        ) : (
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
      ) : (
        <div className="relative w-full max-w-xs">
          <Input className="h-10 w-full rounded-xl border-border/70 pr-10" placeholder="Caută în listă" />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      )}
      
      {hasFilters && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 rounded-xl px-3" type="button">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
              <span className="sr-only">Filtre</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filtrează coloane</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={filters[column.id] || false}
                onCheckedChange={() => handleFilterToggle(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
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
    </div>
  )
}

export default ActionBar