import React, { useRef, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import EventCard from './EventCard';
import TodayMarker from './TodayMarker';

const WeekView = ({ currentDate, events, onEventClick, onEventCreate }) => {
  const gridRef = useRef(null);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date();

  useEffect(() => {
    // Scroll to 8 AM on mount
    if (gridRef.current) {
      const headerHeight = 48; // day-header-height
      const hourHeight = 240; // Matches --hour-height
      const scrollTo = 8 * hourHeight + headerHeight; // 8 AM in pixels
      gridRef.current.scrollTop = scrollTo;
    }
  }, []);

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.startTime);
      return isSameDay(eventStart, day);
    });
  };

  const calculateEventPosition = (event) => {
    const start = parseISO(event.startTime);
    const end = parseISO(event.endTime);
    
    const hourHeight = 240; // Matches --hour-height
    const pixelsPerMinute = hourHeight / 60; // 4 pixels per minute
    
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const duration = endMinutes - startMinutes;
    
    return {
      top: startMinutes * pixelsPerMinute,
      height: Math.max(duration * pixelsPerMinute, 60) // Minimum 60px (15 min)
    };
  };

  const isToday = (day) => isSameDay(day, today);

  return (
    <div className="week-view">
      <div className="week-view-scroll-container" ref={gridRef}>
        <div className="week-header">
          <div className="time-column-header"></div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`day-header ${isToday(day) ? 'today' : ''}`}
            >
              <span className="weekday">{format(day, 'EEE')}</span>
              <span className={`date ${isToday(day) ? 'current-day' : ''}`}>
                {format(day, 'd')}
              </span>
            </div>
          ))}
        </div>

        <div className="week-grid-wrapper">
          <div className="week-grid">
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="time-label">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                {weekDays.map((day) => {
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="time-slot"
                      onClick={() => onEventCreate && onEventCreate(day, hour)}
                    >
                      <div className="quarter-line quarter-1"></div>
                      <div className="quarter-line quarter-2"></div>
                      <div className="quarter-line quarter-3"></div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="week-events-container">
            {weekDays.map((day, dayIndex) => (
              <div
                key={`events-${day.toISOString()}`}
                className="day-events-column"
                style={{
                  gridColumn: dayIndex + 2,
                  gridRow: '1 / -1'
                }}
              >
                {getEventsForDay(day).map((event) => {
                  const position = calculateEventPosition(event);
                  return (
                    <EventCard
                      key={event.id}
                      event={event}
                      view="week"
                      style={{
                        top: `${position.top}px`,
                        height: `${position.height}px`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick(event);
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          
          {weekDays.map((day, index) => (
            isToday(day) && <TodayMarker key={`marker-${index}`} columnIndex={index + 2} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;

