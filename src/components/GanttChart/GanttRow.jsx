import React from 'react';
import TaskBar from './TaskBar';

const GanttRow = ({ 
  item, 
  sidebarWidth, 
  columnWidth, 
  dateRange
}) => {

  const getColorClass = (color) => {
    const colors = {
      purple: 'bg-purple-primary',
      blue: 'bg-blue-primary',
      green: 'bg-green-primary',
    };
    return colors[color] || 'bg-gray-400';
  };

  // Generate all dates from start to end
  const generateDateRange = () => {
    const dates = [];
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const allDates = generateDateRange();

  // Extract room number from name or id for rooms - return only the number
  const getRoomNumber = () => {
    if (item.type === 'room') {
      // Extract number from "Camera 101" -> "101" or from id "room-101" -> "101"
      const nameMatch = item.name.match(/Camera\s+(\d+)/);
      const idMatch = item.id.match(/room-(\d+)/);
      const match = nameMatch || idMatch;
      if (match) {
        return match[1]; // Return only the number
      }
      // Fallback: try to extract any number from name
      const fallbackMatch = item.name.match(/(\d+)/);
      return fallbackMatch ? fallbackMatch[1] : item.name.replace('Camera ', '').trim();
    }
    return '';
  };

  // Only render rows for rooms, not for reservations
  // Reservations are rendered on the same row as their parent room
  if (item.type === 'reservation' || item.level > 0) {
    return null; // Don't render separate rows for reservations
  }

  return (
    <div className="flex h-12 border-b border-gray-100">
      {/* Sticky sidebar cell - only show for rooms */}
      <div 
        className="sticky left-0 z-20 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold bg-gray-50 border-r border-gray-200"
        style={{ width: `${sidebarWidth}px`, padding: '0 8px' }}
      >
        {item.avatar && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: item.avatar.backgroundColor }}
          >
            {item.avatar.initials || 'R'}
          </div>
        )}
        <span className="truncate">{getRoomNumber()}</span>
      </div>

      {/* Timeline cell - scrolls horizontally */}
      <div className="relative flex-1 bg-white hover:bg-gray-50 z-0" style={{ minWidth: `${allDates.length * columnWidth}px` }}>
        {/* Render reservations - always show them, not dependent on expanded state */}
        {item.type === 'room' && item.children && item.children.length > 0 && (
          <>
            {item.children.map((reservation) => (
              <TaskBar
                key={reservation.id}
                task={reservation}
                startDate={dateRange.start}
                columnWidth={columnWidth}
                days={allDates}
              />
            ))}
          </>
        )}
        
        {/* Day columns - grid lines */}
        <div className="absolute inset-0 flex pointer-events-none z-5">
          {allDates.map((date, index) => (
            <div
              key={index}
              className="border-r border-gray-100"
              style={{ width: `${columnWidth}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttRow;

