// Demo data for GanttChart component

// Helper function to generate date range
const generateDateRange = (startDate, daysCount) => {
  const start = new Date(startDate)
  const end = new Date(startDate)
  end.setDate(end.getDate() + daysCount - 1)
  
  const weekHeaders = []
  const days = []
  
  let currentDate = new Date(start)
  
  // Generate week headers
  while (currentDate <= end) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(weekEnd.getDate() + 6)
    
    if (weekEnd > end) {
      weekEnd.setTime(end.getTime())
    }
    
    const startDay = weekStart.getDate()
    const startMonth = weekStart.toLocaleDateString('ro-RO', { month: 'short' })
    const endDay = weekEnd.getDate()
    const endMonth = weekEnd.toLocaleDateString('ro-RO', { month: 'short' })
    
    weekHeaders.push({
      label: `${startDay} ${startMonth} - ${endDay} ${endMonth}`,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0]
    })
    
    currentDate.setDate(currentDate.getDate() + 7)
  }
  
  // Generate days
  currentDate = new Date(start)
  while (currentDate <= end) {
    days.push(currentDate.getDate())
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    today: new Date().toISOString().split('T')[0],
    weekHeaders,
    days
  }
}

// Hotel Reservations Data
export const hotelReservationsData = (() => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 3) // Start 3 days ago
  
  const dateRange = generateDateRange(startDate, 21) // 3 weeks
  
  return {
    layout: {
      navigation: {
        items: [
          { id: 'reservations', label: 'Rezervări', icon: 'calendar', active: true }
        ]
      }
    },
    dateRange,
    items: [
      {
        id: 'room-101',
        name: 'Camera 101 - Standard',
        color: 'blue',
        type: 'room',
        expanded: false,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'res-101-1',
            name: 'Familie Popescu',
            color: 'blue',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'blue'
            }
          },
          {
            id: 'res-101-2',
            name: 'Ion Georgescu',
            color: 'blue',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'blue'
            }
          }
        ]
      },
      {
        id: 'room-102',
        name: 'Camera 102 - Standard',
        color: 'blue',
        type: 'room',
        expanded: false,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'res-102-1',
            name: 'Maria Ionescu',
            color: 'blue',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: dateRange.today,
              endDate: new Date(new Date(dateRange.today).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'blue'
            }
          }
        ]
      },
      {
        id: 'room-201',
        name: 'Camera 201 - Deluxe',
        color: 'purple',
        type: 'room',
        expanded: false,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'res-201-1',
            name: 'Alexandru Marin',
            color: 'purple',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'purple'
            }
          },
          {
            id: 'res-201-2',
            name: 'Cristina Stanciu',
            color: 'purple',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(startDate.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'purple'
            }
          }
        ]
      },
      {
        id: 'room-202',
        name: 'Camera 202 - Deluxe',
        color: 'purple',
        type: 'room',
        expanded: false,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'res-202-1',
            name: 'Familie Dumitrescu',
            color: 'purple',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'purple'
            }
          }
        ]
      },
      {
        id: 'room-301',
        name: 'Camera 301 - Suite',
        color: 'green',
        type: 'room',
        expanded: false,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'res-301-1',
            name: 'Mihai Radu & Laura Mitrea',
            color: 'green',
            type: 'reservation',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'green'
            }
          }
        ]
      }
    ],
    todayMarker: {
      enabled: true,
      date: dateRange.today
    }
  }
})()

// Fitness Workout Data
export const fitnessWorkoutData = (() => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 3) // Start 3 days ago
  
  const dateRange = generateDateRange(startDate, 21) // 3 weeks
  
  return {
    layout: {
      navigation: {
        items: [
          { id: 'workouts', label: 'Antrenamente', icon: 'dumbbell', active: true }
        ]
      }
    },
    dateRange,
    items: [
      {
        id: 'trainer-1',
        name: 'Alex Fitness - Antrenor Personal',
        color: 'blue',
        type: 'trainer',
        expanded: true,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'session-1-1',
            name: 'Cardio & Forță - Maria P.',
            color: 'blue',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: dateRange.today,
              endDate: dateRange.today,
              color: 'blue'
            }
          },
          {
            id: 'session-1-2',
            name: 'HIIT Training - Ion G.',
            color: 'blue',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'blue'
            }
          },
          {
            id: 'session-1-3',
            name: 'Strength Training - Ana D.',
            color: 'blue',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'blue'
            }
          }
        ]
      },
      {
        id: 'class-yoga',
        name: 'Clasă Yoga',
        color: 'green',
        type: 'class',
        expanded: true,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'yoga-1',
            name: 'Yoga pentru începători',
            color: 'green',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'green'
            }
          },
          {
            id: 'yoga-2',
            name: 'Yoga avansați',
            color: 'green',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'green'
            }
          },
          {
            id: 'yoga-3',
            name: 'Yoga & Meditație',
            color: 'green',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'green'
            }
          }
        ]
      },
      {
        id: 'class-spinning',
        name: 'Clasă Spinning',
        color: 'purple',
        type: 'class',
        expanded: true,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'spin-1',
            name: 'Spinning Intensiv',
            color: 'purple',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'purple'
            }
          },
          {
            id: 'spin-2',
            name: 'Spinning Cardio',
            color: 'purple',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'purple'
            }
          }
        ]
      },
      {
        id: 'class-pilates',
        name: 'Clasă Pilates',
        color: 'blue',
        type: 'class',
        expanded: false,
        level: 0,
        timeline: null,
        children: [
          {
            id: 'pilates-1',
            name: 'Pilates Mat',
            color: 'blue',
            type: 'session',
            level: 1,
            timeline: {
              type: 'bar',
              startDate: new Date(new Date(dateRange.today).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(new Date(dateRange.today).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'blue'
            }
          }
        ]
      }
    ],
    todayMarker: {
      enabled: true,
      date: dateRange.today
    }
  }
})()

export default {
  hotel: hotelReservationsData,
  fitness: fitnessWorkoutData
}

