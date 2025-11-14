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
  parseISO
} from 'date-fns';

const MonthView = ({ currentDate, events, onEventClick, onEventCreate }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.startTime);
      return isSameDay(eventStart, day);
    }).slice(0, 3); // Max 3 events visible
  };

  const getEventColor = (color) => {
    return color || 'blue';
  };

  return (
    <div className="month-view">
      <div className="month-weekday-header">
        {weekdays.map((weekday) => (
          <div key={weekday} className="month-weekday">
            {weekday}
          </div>
        ))}
      </div>

      <div className="month-grid">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);
          const hasMoreEvents = events.filter((event) => {
            const eventStart = parseISO(event.startTime);
            return isSameDay(eventStart, day);
          }).length > 3;

          return (
            <div
              key={day.toISOString()}
              className={`month-day-cell ${!isCurrentMonth ? 'other-month' : ''}`}
              onClick={() => onEventCreate && onEventCreate(day)}
            >
              <span className={`month-date-number ${isToday ? 'current-day' : ''}`}>
                {format(day, 'd')}
              </span>

              <div className="month-events-list">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="month-event-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick && onEventClick(event);
                    }}
                  >
                    <span
                      className="event-indicator"
                      style={{
                        backgroundColor: `var(--event-${getEventColor(event.color)}-badge)`
                      }}
                    ></span>
                    <span className="event-title">{event.title}</span>
                    <span className="event-time">
                      {format(parseISO(event.startTime), 'h:mm a')}
                    </span>
                  </div>
                ))}
                {hasMoreEvents && (
                  <div className="more-events-indicator">
                    +{events.filter((event) => isSameDay(parseISO(event.startTime), day)).length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

