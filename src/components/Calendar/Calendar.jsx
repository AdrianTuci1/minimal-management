import React from 'react';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import './calendar.css';

const Calendar = ({ 
  events = [], 
  currentView = 'week',
  currentDate = new Date(),
  onEventClick,
  onEventCreate,
  onEventMove,
  onEventResize,
  timezone = 'UTC'
}) => {
  const renderView = () => {
    switch (currentView) {
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onEventCreate={onEventCreate}
            onEventMove={onEventMove}
            onEventResize={onEventResize}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onEventCreate={onEventCreate}
            onEventMove={onEventMove}
            onEventResize={onEventResize}
          />
        );
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onEventCreate={onEventCreate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-content">
        {renderView()}
      </div>
    </div>
  );
};

export default Calendar;

