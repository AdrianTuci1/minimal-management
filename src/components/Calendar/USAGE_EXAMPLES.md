# Calendar Component - Usage Guide

A comprehensive calendar component with multiple views (Day, Week, Month, Year), event management, and full JSON data support.

## Features

- ✅ **Multiple Views**: Day, Week, Month, and Year views
- ✅ **Event Management**: Display and manage events with color coding
- ✅ **Responsive Design**: Fully responsive for desktop, tablet, and mobile
- ✅ **JSON Data Support**: Pass events as JSON data
- ✅ **Color-Coded Events**: 8 predefined color schemes (blue, green, orange, pink, purple, red, teal, yellow)
- ✅ **Attendee Avatars**: Display attendees on events
- ✅ **Today Marker**: Live indicator showing current time
- ✅ **Mini Calendar**: Quick date navigation in Day view
- ✅ **Keyboard Navigation**: Support for keyboard shortcuts

## Installation

Make sure you have the required dependencies:

```bash
npm install date-fns lucide-react
```

## Basic Usage

```jsx
import React from 'react';
import Calendar from './components/Calendar';
import eventsData from './sample-calendar-data.json';

function App() {
  return (
    <Calendar
      events={eventsData.events}
      initialView="week"
    />
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `Array` | `[]` | Array of event objects |
| `initialView` | `string` | `'week'` | Initial view ('day', 'week', 'month', 'year') |
| `onEventClick` | `function` | - | Callback when event is clicked |
| `onEventCreate` | `function` | - | Callback when creating new event |
| `onEventMove` | `function` | - | Callback when event is moved |
| `onEventResize` | `function` | - | Callback when event is resized |
| `timezone` | `string` | `'UTC'` | Timezone for events |

## Event Data Structure

```json
{
  "id": "evt-1",
  "title": "Team Meeting",
  "startTime": "2025-11-17T11:00:00Z",
  "endTime": "2025-11-17T12:00:00Z",
  "color": "blue",
  "allDay": false,
  "attendees": [
    {
      "id": "user-1",
      "name": "John Doe",
      "avatar": "https://i.pravatar.cc/150?img=1"
    }
  ]
}
```

### Required Fields
- `id`: Unique identifier (string)
- `title`: Event title (string)
- `startTime`: ISO 8601 date-time string
- `endTime`: ISO 8601 date-time string

### Optional Fields
- `color`: Event color theme (blue|green|orange|pink|purple|red|teal|yellow)
- `allDay`: Boolean indicating all-day event
- `attendees`: Array of attendee objects

## Color Themes

The calendar supports 8 color themes:

- `blue` (default)
- `green`
- `orange`
- `pink`
- `purple`
- `red`
- `teal`
- `yellow`

## Examples

### Example 1: Basic Calendar with Events

```jsx
import Calendar from './components/Calendar';

const events = [
  {
    id: "1",
    title: "Team Meeting",
    startTime: "2025-11-17T10:00:00Z",
    endTime: "2025-11-17T11:00:00Z",
    color: "blue"
  },
  {
    id: "2",
    title: "Project Review",
    startTime: "2025-11-17T14:00:00Z",
    endTime: "2025-11-17T15:30:00Z",
    color: "green"
  }
];

function App() {
  return <Calendar events={events} />;
}
```

### Example 2: With Event Handlers

```jsx
import Calendar from './components/Calendar';

function App() {
  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    // Open event details modal
  };

  const handleEventCreate = (date, hour) => {
    console.log('Create event at:', date, hour);
    // Open create event form
  };

  return (
    <Calendar
      events={events}
      initialView="week"
      onEventClick={handleEventClick}
      onEventCreate={handleEventCreate}
    />
  );
}
```

### Example 3: Loading Events from JSON

```jsx
import Calendar from './components/Calendar';
import { useState, useEffect } from 'react';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load from JSON file
    fetch('/sample-calendar-data.json')
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, []);

  return <Calendar events={events} initialView="month" />;
}
```

### Example 4: With Custom Event Creation

```jsx
import Calendar from './components/Calendar';
import { useState } from 'react';

function App() {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (date, hour) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: 'New Event',
      startTime: new Date(date.setHours(hour)).toISOString(),
      endTime: new Date(date.setHours(hour + 1)).toISOString(),
      color: 'blue'
    };
    
    setEvents([...events, newEvent]);
  };

  return (
    <Calendar
      events={events}
      onEventCreate={handleCreateEvent}
    />
  );
}
```

### Example 5: Different Initial Views

```jsx
// Day View
<Calendar events={events} initialView="day" />

// Week View (default)
<Calendar events={events} initialView="week" />

// Month View
<Calendar events={events} initialView="month" />

// Year View
<Calendar events={events} initialView="year" />
```

## Views

### Day View
- Shows single day with hourly time slots
- Includes mini calendar for navigation
- Larger event cards with more details
- Perfect for detailed schedule viewing

### Week View
- Shows 7 days in a grid
- Hourly time slots for each day
- Compact event cards
- Best for weekly planning

### Month View
- Traditional calendar grid
- Shows up to 3 events per day
- "More" indicator for additional events
- Great for monthly overview

### Year View
- 12 mini-month grids
- Event indicators as dots
- Quick navigation across the year
- Perfect for long-term planning

## Keyboard Shortcuts

- `←` / `→` - Navigate previous/next period
- `t` - Go to today
- `d` - Switch to Day view
- `w` - Switch to Week view
- `m` - Switch to Month view
- `y` - Switch to Year view

## Styling

The calendar uses CSS variables for easy customization. You can override these in your own CSS:

```css
:root {
  --cal-bg-primary: #FFFFFF;
  --cal-text-primary: #111827;
  --today-highlight: #2563EB;
  /* ... more variables */
}
```

## Responsive Behavior

- **Desktop (≥1024px)**: Full features, all views available
- **Tablet (768-1023px)**: Optimized layouts, mini calendar hidden on some views
- **Mobile (<768px)**: Compact layouts, simplified navigation

## Performance

- Automatic scroll to current time (8 AM default)
- Efficient event filtering per view
- Optimized rendering for large event lists
- Smooth transitions and animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All times are in ISO 8601 format
- Events are filtered automatically based on current view
- The today marker updates every minute
- Events can have custom colors or use predefined themes

