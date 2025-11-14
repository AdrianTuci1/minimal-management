import React from 'react';

const TodayMarker = ({ todayDate, startDate, columnWidth, dateRange }) => {
  const calculatePosition = (date) => {
    const target = new Date(date);
    const start = new Date(startDate);
    const diffTime = target - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * columnWidth + columnWidth / 2;
  };

  const left = calculatePosition(todayDate);
  const todayDay = new Date(todayDate).getDate();

  return (
    <div
      className="absolute top-0 bottom-0 z-10 pointer-events-none"
      style={{ left: `${left}px` }}
    >
      {/* Vertical line */}
      <div className="absolute w-0.5 h-full bg-orange-400" />
      
      {/* Today label */}
      <div className="absolute top-24 -translate-x-1/2">
        <div className="bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
          Today {todayDay}
        </div>
      </div>
    </div>
  );
};

export default TodayMarker;

