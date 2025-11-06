"use client";

import * as React from "react";
import {
  format,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  isPast,
} from "date-fns";
import { ro } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DAYS_OF_WEEK = [
  { key: "mon", label: "L" },
  { key: "tue", label: "M" },
  { key: "wed", label: "M" },
  { key: "thu", label: "J" },
  { key: "fri", label: "V" },
  { key: "sat", label: "S" },
  { key: "sun", label: "D" },
];

interface MiniCalendarProps {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  disabledDates?: (date: Date) => boolean;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDate: externalSelectedDate,
  onDateSelect,
  disabledDates,
}) => {
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date | null>(new Date());
  const [currentWeek, setCurrentWeek] = React.useState<Date>(() => {
    const date = externalSelectedDate || new Date();
    return startOfWeek(date, { weekStartsOn: 1 });
  });

  const selectedDate = externalSelectedDate !== undefined ? externalSelectedDate : internalSelectedDate;

  React.useEffect(() => {
    if (externalSelectedDate) {
      const weekStart = startOfWeek(externalSelectedDate, { weekStartsOn: 1 });
      const currentWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      // Only update if the selected date is in a different week
      if (format(weekStart, "yyyy-MM-dd") !== format(currentWeekStart, "yyyy-MM-dd")) {
        setCurrentWeek(weekStart);
      }
    }
  }, [externalSelectedDate]);

  const handleDateSelect = (date: Date) => {
    if (disabledDates && disabledDates(date)) return;
    setInternalSelectedDate(date);
    onDateSelect?.(date);
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Luni
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const isDateDisabled = (date: Date) => {
    if (disabledDates) return disabledDates(date);
    const dateCopy = new Date(date);
    dateCopy.setHours(0, 0, 0, 0);
    return isPast(dateCopy) && !isToday(date);
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
  };

  const weekRangeText = format(weekStart, "d MMM", { locale: ro }) + " - " + format(weekEnd, "d MMM yyyy", { locale: ro });

  return (
    <div className="w-full border border-border bg-background rounded-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold text-foreground">
          {weekRangeText}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center border-b border-border">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="text-xs font-medium text-muted-foreground py-1"
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((day) => {
          const isDisabled = isDateDisabled(day);
          const isSelected = isDateSelected(day);
          const isTodayDate = isToday(day);

          return (
            <Button
              key={day.toString()}
              variant="ghost"
              className={cn(
                "h-10 w-full rounded-none font-normal p-0",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isTodayDate && !isSelected && "bg-accent text-accent-foreground",
                isDisabled && "opacity-50 cursor-not-allowed",
                !isDisabled && !isSelected && "hover:bg-muted"
              )}
              disabled={isDisabled}
              onClick={() => handleDateSelect(day)}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </Button>
          );
        })}
      </div>
    </div>
  );
};