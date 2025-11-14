import React, { useState, useEffect } from 'react';

const TodayMarker = ({ columnIndex }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  // Calculate position based on hour height
  const hourHeight = 240; // Matches --hour-height
  const pixelsPerMinute = hourHeight / 60; // 4 pixels per minute
  const topPosition = totalMinutes * pixelsPerMinute;

  return (
    <div
      className="today-marker"
      style={{
        top: `${topPosition}px`,
        gridColumn: columnIndex + 1
      }}
    >
      <div className="today-marker-dot"></div>
      <div className="today-marker-line"></div>
    </div>
  );
};

export default TodayMarker;

