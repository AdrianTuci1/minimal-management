import { useState, useEffect, useMemo } from 'react';

export const useGanttState = (spaces) => {
  const [expandedItems, setExpandedItems] = useState({});

  // Initialize expanded state from spaces data
  useEffect(() => {
    const initExpanded = {};
    
    const processItem = (item) => {
      if (item.expanded !== undefined) {
        initExpanded[item.id] = item.expanded;
      }
      if (item.children) {
        item.children.forEach(processItem);
      }
    };

    spaces.forEach(processItem);
    setExpandedItems(initExpanded);
  }, [spaces]);

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return {
    expandedItems,
    toggleExpanded,
  };
};

export const useResponsiveColumns = () => {
  const [columnWidth, setColumnWidth] = useState(48);
  const [sidebarWidth, setSidebarWidth] = useState(80); // Reduced from 275 to 80 for room numbers only

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        // Mobile
        setColumnWidth(36);
        setSidebarWidth(60);
      } else if (width < 1024) {
        // Tablet
        setColumnWidth(40);
        setSidebarWidth(70);
      } else {
        // Desktop - narrow sidebar for room numbers only
        setColumnWidth(48);
        setSidebarWidth(80);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { columnWidth, sidebarWidth };
};

