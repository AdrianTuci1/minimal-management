import React, { useRef, useEffect } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import EventCard from './EventCard';
import TodayMarker from './TodayMarker';

const DayView = ({ currentDate, events, onEventClick, onEventCreate }) => {
  const gridRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date();

  useEffect(() => {
    // Scroll to 8 AM on mount
    if (gridRef.current) {
      const headerHeight = 56; // day-header-single height
      const hourHeight = 240; // Matches --hour-height
      const scrollTo = 8 * hourHeight + headerHeight; // 8 AM in pixels
      gridRef.current.scrollTop = scrollTo;
    }
  }, []);

  const getEventsForDay = () => {
    return events.filter((event) => {
      const eventStart = parseISO(event.startTime);
      return isSameDay(eventStart, currentDate);
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

  const isToday = isSameDay(currentDate, today);

  return (
    <div className="day-view">
      <div className="day-view-scroll-container" ref={gridRef}>
        <div className="day-view-header">
          <div className="time-column-header"></div>
          <div className={`day-header-single ${isToday ? 'today' : ''}`}>
            <span className="weekday">{format(currentDate, 'EEEE')}</span>
            <span className={`date ${isToday ? 'current-day' : ''}`}>
              {format(currentDate, 'd')}
            </span>
          </div>
        </div>

        <div className="day-grid-wrapper">
          <div className="day-grid">
            {hours.map((hour) => {
              return (
                <React.Fragment key={hour}>
                  <div className="time-label">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </div>
                  <div
                    className="time-slot-day"
                    onClick={() => onEventCreate && onEventCreate(currentDate, hour)}
                  >
                    <div className="quarter-line quarter-1"></div>
                    <div className="quarter-line quarter-2"></div>
                    <div className="quarter-line quarter-3"></div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="day-events-container">
            <div className="day-events-column" style={{ gridColumn: 2, gridRow: '1 / -1' }}>
              {getEventsForDay().map((event) => {
                const position = calculateEventPosition(event);
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    view="day"
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
          </div>
          
          {isToday && <TodayMarker columnIndex={2} />}
        </div>
      </div>
    </div>
  );
};

export default DayView;

