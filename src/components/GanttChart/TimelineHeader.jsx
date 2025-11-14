import React from 'react';

const TimelineHeader = ({ weekHeaders, days, dateRange, columnWidth }) => {
  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[date.getDay()];
  };

  const getDayNumber = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
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
    <div className="border-b border-gray-200 bg-white">
      {/* Week headers */}
      <div className="h-12 flex border-b border-gray-200">
        {weekHeaders.map((week, index) => {
          const startDate = new Date(week.startDate);
          const endDate = new Date(week.endDate);
          const daysInWeek = allDates.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= startDate && date <= endDate;
          }).length;
          
          return (
            <div
              key={index}
              className="flex items-center justify-center border-r border-gray-200 text-sm font-semibold text-gray-700"
              style={{ width: `${daysInWeek * columnWidth}px` }}
            >
              {week.label}
            </div>
          );
        })}
      </div>

      {/* Day numbers */}
      <div className="h-12 flex">
        {allDates.map((dateStr, index) => {
          const dayOfWeek = getDayOfWeek(dateStr);
          const dayNumber = getDayNumber(dateStr);
          const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
          
          return (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center border-r border-gray-100
                ${isWeekend ? 'bg-gray-50' : ''}
              `}
              style={{ width: `${columnWidth}px` }}
            >
              <span className="text-xs text-gray-500">{dayOfWeek}</span>
              <span className="text-sm font-medium text-gray-900">{dayNumber}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineHeader;

