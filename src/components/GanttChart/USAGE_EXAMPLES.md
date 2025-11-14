# Gantt Chart Usage Examples

## Example 1: Using the Default Data

```jsx
import GanttChart from './components/GanttChart';
import ganttData from '../gantt-design-spec.json';

function App() {
  return <GanttChart data={ganttData} />;
}
```

## Example 2: Using Custom JSON Data

```jsx
import GanttChart from './components/GanttChart';
import customData from './sample-gantt-data.json';

function App() {
  return <GanttChart data={customData} />;
}
```

## Example 3: Using Dynamic Data from API

```jsx
import { useState, useEffect } from 'react';
import GanttChart from './components/GanttChart';

function App() {
  const [ganttData, setGanttData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gantt-data')
      .then(response => response.json())
      .then(data => {
        setGanttData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading gantt data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!ganttData) return <div>Error loading data</div>;

  return <GanttChart data={ganttData} />;
}
```

## Example 4: Building Data Programmatically

```jsx
import { useMemo } from 'react';
import GanttChart from './components/GanttChart';

function App() {
  const ganttData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      layout: {
        navigation: {
          items: [
            { id: 'gantt', label: 'Gantt', icon: 'gantt', active: true }
          ]
        }
      },
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        today: today.toISOString().split('T')[0],
        weekHeaders: generateWeekHeaders(startDate, endDate),
        days: generateDays(startDate, endDate)
      },
      spaces: [
        {
          id: 'my-project',
          name: 'My Project',
          color: 'purple',
          type: 'space',
          expanded: true,
          level: 0,
          timeline: {
            type: 'bar',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            color: 'purple'
          },
          children: [
            {
              id: 'task-1',
              name: 'Task 1',
              color: 'blue',
              type: 'task',
              level: 1,
              timeline: {
                type: 'bar',
                startDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0],
                endDate: new Date(today.getFullYear(), today.getMonth(), 10).toISOString().split('T')[0],
                color: 'blue'
              }
            }
          ]
        }
      ],
      todayMarker: {
        enabled: true,
        date: today.toISOString().split('T')[0]
      }
    };
  }, []);

  return <GanttChart data={ganttData} />;
}

// Helper functions
function generateWeekHeaders(startDate, endDate) {
  const weeks = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    if (weekEnd > endDate) {
      weekEnd.setTime(endDate.getTime());
    }
    
    weeks.push({
      label: `${weekStart.getDate()} ${weekStart.toLocaleDateString('en-US', { month: 'short' })} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('en-US', { month: 'short' })}`,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0]
    });
    
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return weeks;
}

function generateDays(startDate, endDate) {
  const days = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(currentDate.getDate());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}
```

## Example 5: Filtering and Customizing Data

```jsx
import { useState, useMemo } from 'react';
import GanttChart from './components/GanttChart';
import fullData from '../gantt-design-spec.json';

function App() {
  const [colorFilter, setColorFilter] = useState(null);

  const filteredData = useMemo(() => {
    if (!colorFilter) return fullData;

    const filterSpaces = (spaces) => {
      return spaces
        .map(space => ({
          ...space,
          children: space.children ? filterChildren(space.children) : []
        }))
        .filter(space => 
          space.color === colorFilter || 
          (space.children && space.children.length > 0)
        );
    };

    const filterChildren = (children) => {
      return children
        .map(child => ({
          ...child,
          children: child.children ? filterChildren(child.children) : []
        }))
        .filter(child => 
          child.color === colorFilter || 
          (child.children && child.children.length > 0)
        );
    };

    return {
      ...fullData,
      spaces: filterSpaces(fullData.spaces)
    };
  }, [colorFilter]);

  return (
    <div>
      <div className="p-4 bg-gray-100">
        <button 
          onClick={() => setColorFilter(null)}
          className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
        >
          All
        </button>
        <button 
          onClick={() => setColorFilter('purple')}
          className="px-4 py-2 mr-2 bg-purple-500 text-white rounded"
        >
          Purple
        </button>
        <button 
          onClick={() => setColorFilter('blue')}
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
        >
          Blue
        </button>
        <button 
          onClick={() => setColorFilter('green')}
          className="px-4 py-2 mr-2 bg-green-500 text-white rounded"
        >
          Green
        </button>
      </div>
      <GanttChart data={filteredData} />
    </div>
  );
}
```

## Data Structure Reference

### Minimal Required Structure

```json
{
  "layout": {
    "navigation": {
      "items": []
    }
  },
  "dateRange": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD",
    "today": "YYYY-MM-DD",
    "weekHeaders": [],
    "days": []
  },
  "items": [],
  "todayMarker": {
    "enabled": true,
    "date": "YYYY-MM-DD"
  }
}
```

**Note**: You can also use `spaces` instead of `items` for backward compatibility.

### Item Structure

```json
{
  "id": "unique-id",
  "name": "Display Name",
  "color": "purple|blue|green",
  "expanded": true,
  "level": 0,
  "timeline": {
    "type": "bar",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "color": "purple|blue|green",
    "showAvatar": false
  },
  "children": []
}
```

**Note**: All items are treated uniformly - there's no distinction between folders, groups, or tasks. Simply nest items using the `children` array to create hierarchy.

### Milestone (Dot) Timeline

```json
{
  "timeline": {
    "type": "dot",
    "date": "YYYY-MM-DD",
    "color": "purple|blue|green",
    "showAvatar": true
  }
}
```

## Tips

1. **Date Format**: Always use `YYYY-MM-DD` format for dates
2. **Colors**: Stick to `purple`, `blue`, or `green` (or extend in Tailwind config)
3. **Levels**: Start at 0 for top-level items, increment for nested children
4. **IDs**: Keep IDs unique across all items
5. **Timeline**: Set to `null` for items without timeline visualization
6. **Expanded State**: Control which items start expanded/collapsed
7. **Performance**: For large datasets (100+ tasks), consider virtualization
8. **Week Ordering**: Dates automatically display in correct order starting from your specified start date
9. **Z-Index**: Task bars automatically render above grid lines for clean visualization

