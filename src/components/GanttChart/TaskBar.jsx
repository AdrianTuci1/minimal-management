import React from 'react';

const TaskBar = ({ task, startDate, columnWidth, days }) => {
  if (!task.timeline) return null;

  const getColorClass = (color, type = 'bg') => {
    const colors = {
      purple: { bg: 'bg-purple-primary', light: 'bg-purple-light' },
      blue: { bg: 'bg-blue-primary', light: 'bg-blue-light' },
      green: { bg: 'bg-green-primary', light: 'bg-green-light' },
    };
    return colors[color]?.[type] || 'bg-gray-400';
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
            className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0 overflow-hidden"
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

