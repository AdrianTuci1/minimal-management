import React from 'react';

const TaskBar = ({ task, startDate, columnWidth, days }) => {
  if (!task.timeline) return null;

  const getColorClass = (color, type = 'bg') => {
    // Status-based colors for reservations
    const statusColors = {
      emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-500/20' },
      amber: { bg: 'bg-amber-500', light: 'bg-amber-500/20' },
      blue: { bg: 'bg-blue-500', light: 'bg-blue-500/20' },
      red: { bg: 'bg-red-500', light: 'bg-red-500/20' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-500/20' },
    };
    
    // Legacy colors for backward compatibility
    const legacyColors = {
      purple: { bg: 'bg-purple-primary', light: 'bg-purple-light' },
      blue: { bg: 'bg-blue-primary', light: 'bg-blue-light' },
      green: { bg: 'bg-green-primary', light: 'bg-green-light' },
    };
    
    return statusColors[color]?.[type] || legacyColors[color]?.[type] || 'bg-gray-400';
  };

  const calculatePosition = (date) => {
    const target = new Date(date);
    const start = new Date(startDate);
    const diffTime = target - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * columnWidth;
  };

  if (task.timeline.type === 'dot') {
    const left = calculatePosition(task.timeline.date);
    
    return (
      <div
        className="absolute flex items-center z-30"
        style={{
          left: `${left + columnWidth / 2 - 20}px`,
          top: '4px',
        }}
      >
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${getColorClass(task.timeline.color, 'bg')}
            hover:opacity-90 cursor-pointer transition-opacity
            shadow-sm
          `}
        >
          {task.avatar && task.timeline.showAvatar && (
            <div
              className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
              style={{ backgroundColor: task.avatar.backgroundColor }}
            >
              {task.avatar.url && (
                <img
                  src={task.avatar.url}
                  alt={`${task.name} avatar`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (task.timeline.type === 'bar') {
    const left = calculatePosition(task.timeline.startDate);
    const right = calculatePosition(task.timeline.endDate);
    const width = right - left + columnWidth;
    
    // Check if reservation is 1 night (duration <= 1 day)
    const start = new Date(task.timeline.startDate);
    const end = new Date(task.timeline.endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const isOneNight = durationDays <= 1;

    // For 1 night reservations, show only avatar (smaller, circular)
    if (isOneNight) {
      return (
        <div
          className="absolute flex items-center z-30"
          style={{
            left: `${left + columnWidth / 2 - 16}px`,
            top: '4px',
          }}
        >
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${getColorClass(task.timeline.color, 'bg')}
              hover:opacity-90 cursor-pointer transition-opacity
              shadow-sm border-2 border-white
            `}
          >
            {task.avatar && (
              <span className="text-white text-xs font-bold">
                {task.avatar.initials || task.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      );
    }

    // For longer reservations, show bar with avatar and name
    return (
      <div
        className={`
          absolute h-8 rounded-full flex items-center px-3 gap-2 z-30
          ${getColorClass(task.timeline.color, 'bg')}
          hover:opacity-90 cursor-pointer transition-all
          shadow-sm
        `}
        style={{
          left: `${left}px`,
          width: `${width}px`,
          top: '8px',
        }}
      >
        {task.avatar && task.timeline.showAvatar && (
          <div
            className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: task.avatar.backgroundColor }}
          >
            {task.avatar.url ? (
              <img
                src={task.avatar.url}
                alt={`${task.name} avatar`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-white text-[10px] font-bold">
                {task.avatar.initials || task.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        )}
        
        {width > 80 && (
          <span className="text-white text-xs font-medium truncate">
            {task.name}
          </span>
        )}
      </div>
    );
  }

  return null;
};

export default TaskBar;

