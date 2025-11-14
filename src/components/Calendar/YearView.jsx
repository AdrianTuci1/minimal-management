import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
  setMonth
} from 'date-fns';

const MiniMonth = ({ date, events, onDayClick }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const hasEvents = (day) => {
    return events.some((event) => {
      const eventStart = parseISO(event.startTime);
      return isSameDay(eventStart, day);
    });
  };

  const today = new Date();

  return (
    <div className="year-month-mini">
      <div className="year-month-header">
        {format(date, 'MMMM')}
      </div>
      <div className="year-month-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="year-weekday-mini">{day}</div>
        ))}
      </div>
      <div className="year-month-grid">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, date);
          const isToday = isSameDay(day, today);
          const dayHasEvents = hasEvents(day);

          return (
            <div
              key={day.toISOString()}
              className={`year-day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onDayClick && onDayClick(day)}
            >
              {format(day, 'd')}
              {dayHasEvents && <div className="year-event-dot"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const YearView = ({ currentDate, events, onEventClick }) => {
  const months = Array.from({ length: 12 }, (_, i) => setMonth(currentDate, i));

  return (
    <div className="year-view">
      <div className="year-grid">
        {months.map((month) => (
          <MiniMonth
            key={month.toISOString()}
            date={month}
            events={events}
            onDayClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};

export default YearView;

