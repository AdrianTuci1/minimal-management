import React from 'react';
import TaskBar from './TaskBar';

const ChevronIcon = ({ expanded }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`transform transition-transform ${expanded ? 'rotate-90' : 'rotate-0'}`}
  >
    <path d="M6 4l4 4-4 4V4z" />
  </svg>
);

const GanttRow = ({ 
  item, 
  sidebarWidth, 
  columnWidth, 
  dateRange,
  expandedItems,
  onToggle
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.id];

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

  return (
    <div className="flex h-12 border-b border-gray-100">
      {/* Sticky sidebar cell */}
      <div 
        className="sticky left-0 z-20 flex items-center pl-4 pr-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer font-normal bg-gray-50 border-r border-gray-200"
        style={{ width: `${sidebarWidth}px` }}
        onClick={() => hasChildren && onToggle(item.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            <span className="flex-shrink-0 text-gray-400">
              <ChevronIcon expanded={isExpanded} />
            </span>
          ) : (
            <span className="w-4 flex-shrink-0" />
          )}
          
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getColorClass(item.color)}`} />
          
          {item.avatar && (
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 overflow-hidden border border-white"
              style={{ backgroundColor: item.avatar.backgroundColor }}
            >
              {item.avatar.url && (
                <img
                  src={item.avatar.url}
                  alt={`${item.name} avatar`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          )}
          
          <span className="truncate">{item.name}</span>
        </div>
      </div>

      {/* Timeline cell - scrolls horizontally */}
      <div className="relative flex-1 bg-white hover:bg-gray-50 z-0" style={{ minWidth: `${allDates.length * columnWidth}px` }}>
        <TaskBar
          task={item}
          startDate={dateRange.start}
          columnWidth={columnWidth}
          days={allDates}
        />
        
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

