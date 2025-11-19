import React, { useRef, useEffect } from 'react';
import Navigation from './Navigation';
import TimelineHeader from './TimelineHeader';
import GanttRow from './GanttRow';
import TodayMarker from './TodayMarker';
import { useResponsiveColumns } from './useGanttState';

const HEADER_HEIGHT = 0;

const GanttChart = ({ data }) => {
  // Support both 'items' and 'spaces' for backward compatibility
  const items = data.items || data.spaces || [];
  
  const { columnWidth, sidebarWidth } = useResponsiveColumns();
  
  const timelineScrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);

  // Flatten items for rendering - only include rooms, not reservations as separate rows
  // Reservations will be rendered on the same row as their parent room
  const flattenItems = (items, level = 0) => {
    const result = [];
    for (const item of items) {
      // Only add rooms to the flat list, not reservations
      if (item.type === 'room' || level === 0) {
        result.push({ ...item, level });
      }
      // Don't add children as separate rows - they'll be rendered in the same row
    }
    return result;
  };

  const flatItems = flattenItems(items);

  // Drag to scroll (both axes)
  useEffect(() => {
    const el = timelineScrollRef.current;
    if (!el) return;

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      startXRef.current = e.pageX - el.offsetLeft;
      startYRef.current = e.pageY - el.offsetTop;
      scrollLeftRef.current = el.scrollLeft;
      scrollTopRef.current = el.scrollTop;
      el.classList.add('cursor-grabbing');
      el.classList.remove('cursor-grab');
    };

    const onMouseLeave = () => {
      isDraggingRef.current = false;
      el.classList.remove('cursor-grabbing');
      el.classList.add('cursor-grab');
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      el.classList.remove('cursor-grabbing');
      el.classList.add('cursor-grab');
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const y = e.pageY - el.offsetTop;
      el.scrollLeft = scrollLeftRef.current - (x - startXRef.current);
      el.scrollTop = scrollTopRef.current - (y - startYRef.current);
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navigation */}
      {/* <Navigation items={data.layout.navigation.items} /> */}

      {/* Main content area */}
      <div className="relative flex-1 overflow-hidden">
        {/* No separate header needed - it's inside scroll container now */}

        {/* Scrollable content area - ONE vertical scroll for both sidebar and timeline */}
        <div 
          ref={timelineScrollRef}
          className="absolute bottom-0 left-0 right-0 overflow-auto cursor-grab"
          style={{ 
            top: `${HEADER_HEIGHT}px`
          }}
        >
          <div className="relative min-w-max">
            {/* Sticky timeline header - inside scroll container */}
            <div className="sticky top-0 z-30 flex h-24 border-b border-gray-200">
              {/* Sidebar header */}
              <div 
                className="sticky left-0 z-40 bg-gray-50 border-r border-gray-200 flex items-center justify-center"
                style={{ width: `${sidebarWidth}px` }}
              >
                <span className="text-xs font-semibold text-gray-500">Camere</span>
              </div>
              
              {/* Timeline header */}
              <div className="bg-white z-30">
                <TimelineHeader
                  weekHeaders={data.dateRange.weekHeaders}
                  days={data.dateRange.days}
                  dateRange={data.dateRange}
                  columnWidth={columnWidth}
                />
              </div>
            </div>

            {/* Rows */}
            {flatItems.map((item, index) => (
              <GanttRow
                key={item.id}
                item={item}
                sidebarWidth={sidebarWidth}
                columnWidth={columnWidth}
                dateRange={data.dateRange}
              />
            ))}

            {/* Today marker */}
            {data.todayMarker.enabled && (
              <div 
                className="absolute pointer-events-none"
                style={{ 
                  left: `${sidebarWidth}px`,
                  top: `${HEADER_HEIGHT}px`,
                  bottom: 0
                }}
              >
                <TodayMarker
                  todayDate={data.todayMarker.date}
                  startDate={data.dateRange.start}
                  columnWidth={columnWidth}
                  dateRange={data.dateRange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

