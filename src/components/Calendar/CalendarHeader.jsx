import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarHeader = ({
  currentDate,
  currentView,
  onViewChange,
  onNavigateNext,
  onNavigatePrevious,
  onToday,
  onAddEvent,
  headerDateText
}) => {
  const views = ['day', 'week', 'month', 'year'];

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <h2 className="calendar-header-title">{headerDateText}</h2>
      </div>

      <div className="calendar-header-center">
        <div className="view-switcher">
          {views.map((view) => (
            <button
              key={view}
              className={`view-button ${currentView === view ? 'active' : ''}`}
              onClick={() => onViewChange(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-header-right">
        <button className="nav-button" onClick={onNavigatePrevious} aria-label="Previous">
          <ChevronLeft size={20} />
        </button>
        <button className="today-button" onClick={onToday}>
          Today
        </button>
        <button className="nav-button" onClick={onNavigateNext} aria-label="Next">
          <ChevronRight size={20} />
        </button>
        {onAddEvent && (
          <button className="add-event-button" onClick={onAddEvent}>
            <Plus size={16} />
            Add Event
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;

