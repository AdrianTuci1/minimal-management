import React from 'react';
import { format, parseISO } from 'date-fns';

const EventCard = ({ event, view, style, onClick }) => {
  const { title, startTime, endTime, color = 'blue', attendees = [] } = event;

  const start = parseISO(startTime);
  const end = parseISO(endTime);

  const colorClass = `event-${color}`;

  return (
    <div
      className={`event-card ${colorClass} event-card-${view}`}
      style={style}
      onClick={onClick}
    >
      <div className="event-content flex flex-col h-full">
        {/* Header - Treatment (Primary) */}
        {event.treatment && (
          <div className="event-title font-semibold text-sm leading-tight">
            {event.treatment}
          </div>
        )}

        {/* Body - Patient (Secondary) */}
        <div className="event-subtitle text-xs opacity-90 truncate mt-0.5">
          {event.patient ? event.patient : title}
        </div>

        {/* Footer info - Attendees above Time, Bottom-Left */}
        <div className="event-card-footer mt-auto flex flex-col items-start gap-1">
          {attendees.length > 0 && (
            <div className="event-attendees flex -space-x-1 mb-0.5">
              {attendees.slice(0, 3).map((attendee, index) => (
                <img
                  key={attendee.id || index}
                  src={attendee.avatar || `https://ui-avatars.com/api/?name=${attendee.name || 'U'}&background=random`}
                  alt={attendee.name}
                  className="w-4 h-4 rounded-full border border-white dark:border-gray-800"
                  title={attendee.name}
                />
              ))}
              {attendees.length > 3 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 text-[8px] flex items-center justify-center border border-white">
                  +{attendees.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="event-time-row text-[10px] opacity-75 font-medium">
            {format(start, 'h:mm a')}
            {view === 'day' && ` - ${format(end, 'h:mm a')}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

