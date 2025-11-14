import React from 'react';

const icons = {
  list: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 4h12v1.5H2V4zm0 3.5h12V9H2V7.5zM14 11H2v1.5h12V11z"/>
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 1v1H2v12h12V2h-2V1h-1.5v1h-5V1H4zm8.5 3v1.5h-9V4h9z"/>
    </svg>
  ),
  gantt: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 3h6v2H2V3zm0 4h10v2H2V7zm0 4h8v2H2v-2z"/>
    </svg>
  ),
  timeline: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 8h12M8 2v12M5 5l3-3 3 3M5 11l3 3 3-3"/>
    </svg>
  ),
  activity: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 8h3l2-4 3 8 2-4h2"/>
    </svg>
  ),
};

const Navigation = ({ items }) => {
  return (
    <nav className="h-[60px] bg-white border-b border-gray-200 flex items-center px-6 gap-6">
      {items.map((item) => (
        <button
          key={item.id}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
            transition-colors
            ${item.active 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <span className="flex-shrink-0">{icons[item.icon]}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;

