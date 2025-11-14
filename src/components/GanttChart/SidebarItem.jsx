import React from 'react';

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

const SidebarItem = ({ item, level, onToggle, expandedItems }) => {
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

  return (
    <>
      <div
        className="h-12 flex items-center pl-4 pr-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer font-normal"
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
              className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.avatar.backgroundColor }}
            />
          )}
          
          <span className="truncate">{item.name}</span>
        </div>
      </div>

      {hasChildren && isExpanded && item.children.map((child) => (
        <SidebarItem
          key={child.id}
          item={child}
          level={level + 1}
          onToggle={onToggle}
          expandedItems={expandedItems}
        />
      ))}
    </>
  );
};

export default SidebarItem;

