import React from 'react';
import TaskBar from './TaskBar';

const TimelineRow = ({ item, level, startDate, columnWidth, dateRange, expandedItems }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.id];

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
    <>
      <div className="h-12 border-b border-gray-100 relative bg-white hover:bg-gray-50">
        <TaskBar
          task={item}
          startDate={startDate}
          columnWidth={columnWidth}
          days={allDates}
        />
        
        {/* Day columns - lower z-index */}
        <div className="absolute inset-0 flex pointer-events-none z-10">
          {allDates.map((date, index) => (
            <div
              key={index}
              className="border-r border-gray-100"
              style={{ width: `${columnWidth}px` }}
            />
          ))}
        </div>
      </div>

      {hasChildren && isExpanded && item.children.map((child) => (
        <TimelineRow
          key={child.id}
          item={child}
          level={level + 1}
          startDate={startDate}
          columnWidth={columnWidth}
          dateRange={dateRange}
          expandedItems={expandedItems}
        />
      ))}
    </>
  );
};

export default TimelineRow;

