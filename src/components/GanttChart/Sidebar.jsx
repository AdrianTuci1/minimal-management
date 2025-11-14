import React from 'react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ items, expandedItems, onToggle, hideHeader = false }) => {
  if (hideHeader) {
    // When used in the new layout, just render items
    return (
      <>
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            level={0}
            onToggle={onToggle}
            expandedItems={expandedItems}
          />
        ))}
      </>
    );
  }

  // Legacy layout with header
  return (
    <div className="bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="h-24 flex items-center px-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-30">
        <span className="text-sm font-semibold text-gray-500">Tasks</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            level={0}
            onToggle={onToggle}
            expandedItems={expandedItems}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

