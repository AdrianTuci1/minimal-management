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
    const dayEvents = events.filter((event) => {
      const eventStart = parseISO(event.startTime);
      return isSameDay(eventStart, day);
    });

    return calculateEventLayout(dayEvents);
  };

  /**
   * Calculates layout for events to handle overlaps with indented stacking.
   * Shorter events appear on top (higher z-index).
   */
  const calculateEventLayout = (events) => {
    // 1. Sort events by start time, then duration (longer first for placement)
    const sortedEvents = [...events].sort((a, b) => {
      const startA = parseISO(a.startTime).getTime();
      const startB = parseISO(b.startTime).getTime();
      if (startA !== startB) return startA - startB;

      const endA = parseISO(a.endTime).getTime();
      const endB = parseISO(b.endTime).getTime();
      // Sort longer events first for stable background placement
      return (endB - startB) - (endA - startA);
    });

    // 2. Assign overlapping groups and indentation
    const columns = [];

    sortedEvents.forEach(event => {
      const start = parseISO(event.startTime);
      const end = parseISO(event.endTime);
      const startMs = start.getTime();
      const endMs = end.getTime();

      let placed = false;
      // Try to place in the first available column (waterfall/indent effect)
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const hasOverlap = col.some(e => {
          const eStart = parseISO(e.startTime).getTime();
          const eEnd = parseISO(e.endTime).getTime();
          return (startMs < eEnd && endMs > eStart);
        });

        if (!hasOverlap) {
          col.push(event);
          // Store the column index as indentation level
          event._layout = { indentLevel: i };
          placed = true;
          break;
        }
      }

      if (!placed) {
        // Create new column/indent level
        columns.push([event]);
        event._layout = { indentLevel: columns.length - 1 };
      }
    });

    const totalIndents = columns.length;

    // 3. Finalize visualization props
    return sortedEvents.map(event => {
      return {
        ...event,
        _layout: {
          ...event._layout,
          totalIndents
        }
      };
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

    const layout = event._layout || { indentLevel: 0, totalIndents: 1 };

    // Indent logic:
    // Indent 10% for each level to the right
    const indentPercent = 10;
    const left = layout.indentLevel * indentPercent;
    const width = 100 - left; // Occupy remaining space

    return {
      top: startMinutes * pixelsPerMinute,
      height: Math.max(duration * pixelsPerMinute, 60), // Minimum 60px (15 min)
      width: `${width}%`,
      left: `${left}%`,
      zIndex: layout.indentLevel + 1 // Simple z-index based on indent order
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
                        height: `${position.height}px`,
                        width: position.width,
                        left: position.left,
                        zIndex: position.zIndex,
                        position: 'absolute',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
