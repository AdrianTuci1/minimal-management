import React, { useMemo, useState } from "react"
import { format, startOfWeek as startOfWeekFn, endOfWeek } from "date-fns"
import { ro } from "date-fns/locale"
import useAppStore from "@/store/appStore"
import { useActionBarModel } from "@/models/ActionBarModel"

// Imported Components
import DateNavigation from "./action-bar/DateNavigation"
import ViewSwitch from "./action-bar/ViewSwitch"
import AppointmentFilters from "./action-bar/AppointmentFilters"
import FilterMenu from "./action-bar/FilterMenu"
import SearchInput from "./action-bar/SearchInput"
import ActionButtons from "./action-bar/ActionButtons"

const ActionBar = ({ actions = [] }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState(null)

  const {
    selectedDate,
    selectedDateRange,
    setSelectedDateRange,
    calendarView,
  } = useAppStore()

  const {
    hasActionBar,
    hasCalendarControls,
    calendarType
  } = useActionBarModel()

  const isHotelReservations = calendarType === "hotel"
  const isClinicCalendar = calendarType === "clinic"

  // Date Formatting Logic
  const formattedDate = useMemo(() => {
    if (isClinicCalendar) {
      switch (calendarView) {
        case 'day':
          return format(selectedDate, "EEEE, d MMM", { locale: ro })
        case 'week': {
          const weekStart = startOfWeekFn(selectedDate, { weekStartsOn: 1 })
          const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
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

  // Normalize date range for calendar
  const normalizedDateRange = useMemo(() => {
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

  // Handlers
  const handleCalendarOpenChange = (open) => {
    if (open) {
      setTempDateRange(selectedDateRange)
      setIsCalendarOpen(true)
    } else {
      if (tempDateRange?.from && tempDateRange?.to) {
        setSelectedDateRange(tempDateRange)
        setTempDateRange(null)
        setIsCalendarOpen(false)
      }
    }
  }

  const handleDateRangeSelect = (range) => {
    if (range) {
      setTempDateRange(range)
      if (range.from && range.to) {
        setSelectedDateRange(range)
        setTempDateRange(null)
        setIsCalendarOpen(false)
      }
    }
  }

  if (!hasActionBar) {
    return null
  }

  // Remove flex-wrap when showing search input to ensure elements stay on the same row as requested
  const containerClassName = hasCalendarControls
    ? "flex flex-wrap items-center gap-2 px-2 py-1"
    : "flex items-center gap-2 px-2 py-1"

  return (
    <div className={containerClassName}>
      {hasCalendarControls ? (
        <>
          <DateNavigation
            isHotelReservations={isHotelReservations}
            isClinicCalendar={isClinicCalendar}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
            handleCalendarOpenChange={handleCalendarOpenChange}
            handleDateRangeSelect={handleDateRangeSelect}
            normalizedDateRange={normalizedDateRange}
            formattedDate={formattedDate}
            formattedDateRange={formattedDateRange}
          />
          <ViewSwitch
            isHotelReservations={isHotelReservations}
            isClinicCalendar={isClinicCalendar}
          />
          {isClinicCalendar && <AppointmentFilters />}
        </>
      ) : (
        <SearchInput />
      )}

      <FilterMenu />
      <ActionButtons actions={actions} />
    </div>
  )
}

export default ActionBar