import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MiniCalendar = ({ currentDate, events }) => {
  const [displayMonth, setDisplayMonth] = useState(currentDate);

  const monthStart = startOfMonth(displayMonth);
  const monthEnd = endOfMonth(displayMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();

  const hasEvents = (day) => {
    return events.some((event) => {
      const eventStart = parseISO(event.startTime);
      return isSameDay(eventStart, day);
    });
  };

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <span className="mini-calendar-month">
          {format(displayMonth, 'MMMM yyyy')}
        </span>
        <div className="mini-calendar-nav">
          <button
            className="mini-nav-button"
            onClick={() => setDisplayMonth(addMonths(displayMonth, -1))}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="mini-nav-button"
            onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mini-calendar-weekdays">
        {weekdays.map((weekday, index) => (
          <div key={index} className="mini-weekday">
            {weekday}
          </div>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, displayMonth);
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, currentDate);
          const dayHasEvents = hasEvents(day);

          return (
            <div
              key={day.toISOString()}
              className={`mini-day ${!isCurrentMonth ? 'other-month' : ''} ${
                isToday ? 'current-day' : ''
              } ${isSelected ? 'selected-day' : ''}`}
            >
              {format(day, 'd')}
              {dayHasEvents && <div className="mini-event-indicator"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;

