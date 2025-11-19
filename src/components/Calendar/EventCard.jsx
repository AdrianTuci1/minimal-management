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
      <div className="event-title">{title}</div>

      <div className="event-card-footer">
      {attendees.length > 0 && view !== 'month' && (
          <div className="event-attendees">
            {attendees.slice(0, 3).map((attendee, index) => (
              <img
                key={attendee.id || index}
                src={attendee.avatar}
                alt={attendee.name}
                className="attendee-avatar"
                title={attendee.name}
              />
            ))}
            {attendees.length > 3 && (
              <div className="attendee-more">+{attendees.length - 3}</div>
            )}
          </div>
        )}
        <div className="event-time-row">
          <span className="event-time-badge">
            {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
          </span>
        </div>

      </div>
    </div>
  );
};

export default EventCard;

