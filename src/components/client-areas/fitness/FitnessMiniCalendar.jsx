import * as React from "react"
import {
  format,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns"
import { ro } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DAYS_OF_WEEK = [
  { key: "mon", label: "L" },
  { key: "tue", label: "M" },
  { key: "wed", label: "M" },
  { key: "thu", label: "J" },
  { key: "fri", label: "V" },
  { key: "sat", label: "S" },
  { key: "sun", label: "D" },
]

function FitnessMiniCalendar({ selectedDate, onDateSelect }) {
  const [currentWeek, setCurrentWeek] = React.useState(() => {
    const date = selectedDate || new Date()
    return startOfWeek(date, { weekStartsOn: 1 })
  })

  React.useEffect(() => {
    if (selectedDate) {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
      const currentWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
      if (format(weekStart, "yyyy-MM-dd") !== format(currentWeekStart, "yyyy-MM-dd")) {
        setCurrentWeek(weekStart)
      }
    }
  }, [selectedDate])

  const handleDateSelect = (date) => {
    onDateSelect?.(date)
  }

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  })

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    return format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  }

  const weekRangeText = format(weekStart, "d MMM", { locale: ro }) + " - " + format(weekEnd, "d MMM yyyy", { locale: ro })

  return (
    <div className="w-full border border-border bg-card rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold text-foreground">
          {weekRangeText}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center border-b border-border bg-muted/30">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="text-xs font-medium text-muted-foreground py-2"
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((day) => {
          const isSelected = isDateSelected(day)
          const isTodayDate = isToday(day)

          return (
            <Button
              key={day.toString()}
              variant="ghost"
              className={cn(
                "h-12 w-full rounded-none font-normal",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isTodayDate && !isSelected && "bg-accent text-accent-foreground",
                !isSelected && "hover:bg-muted"
              )}
              onClick={() => handleDateSelect(day)}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default FitnessMiniCalendar

