import React from 'react';
import TimelineHeader from './TimelineHeader';
import TimelineRow from './TimelineRow';
import TodayMarker from './TodayMarker';

const Timeline = ({ 
  items, 
  dateRange, 
  expandedItems, 
  columnWidth,
  todayMarker,
  hideHeader = false
}) => {
  return (
    <div className="relative min-w-max">
      {/* Sticky header */}
      {!hideHeader && (
        <div className="sticky top-0 z-40">
          <TimelineHeader
            weekHeaders={dateRange.weekHeaders}
            days={dateRange.days}
            dateRange={dateRange}
            columnWidth={columnWidth}
          />
        </div>
      )}

      {/* Timeline rows */}
      <div className="relative">
        {items.map((item) => (
          <TimelineRow
            key={item.id}
            item={item}
            level={0}
            startDate={dateRange.start}
            columnWidth={columnWidth}
            dateRange={dateRange}
            expandedItems={expandedItems}
          />
        ))}

        {todayMarker.enabled && (
          <TodayMarker
            todayDate={todayMarker.date}
            startDate={dateRange.start}
            columnWidth={columnWidth}
            dateRange={dateRange}
          />
        )}
      </div>
    </div>
  );
};

export default Timeline;

