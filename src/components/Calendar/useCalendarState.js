import { useState, useCallback, useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay
} from 'date-fns';

export const useCalendarState = (initialView = 'week', events = []) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(initialView);

  const navigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      switch (currentView) {
        case 'day':
          return addDays(prev, 1);
        case 'week':
          return addWeeks(prev, 1);
        case 'month':
          return addMonths(prev, 1);
        case 'year':
          return addYears(prev, 1);
        default:
          return prev;
      }
    });
  }, [currentView]);

  const navigatePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      switch (currentView) {
        case 'day':
          return addDays(prev, -1);
        case 'week':
          return addWeeks(prev, -1);
        case 'month':
          return addMonths(prev, -1);
        case 'year':
          return addYears(prev, -1);
        default:
          return prev;
      }
    });
  }, [currentView]);

  const navigateToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const getEventsForView = useCallback((date) => {
    let start, end;

    switch (currentView) {
      case 'day':
        start = startOfDay(date);
        end = endOfDay(date);
        break;
      case 'week':
        start = startOfWeek(date, { weekStartsOn: 0 });
        end = endOfWeek(date, { weekStartsOn: 0 });
        break;
      case 'month':
        start = startOfMonth(date);
        end = endOfMonth(date);
        break;
      case 'year':
        start = startOfYear(date);
        end = endOfYear(date);
        break;
      default:
        return events;
    }

    return events.filter((event) => {
      const eventStart = parseISO(event.startTime);
      const eventEnd = parseISO(event.endTime);
      
      return (
        isWithinInterval(eventStart, { start, end }) ||
        isWithinInterval(eventEnd, { start, end }) ||
        (eventStart <= start && eventEnd >= end)
      );
    });
  }, [currentView, events]);

  const formatHeaderDate = useCallback((date, view) => {
    switch (view) {
      case 'day':
      case 'week':
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return format(date, 'MMMM yyyy');
    }
  }, []);

  return {
    currentDate,
    currentView,
    setCurrentView,
    navigateNext,
    navigatePrevious,
    navigateToday,
    getEventsForView,
    formatHeaderDate
  };
};

