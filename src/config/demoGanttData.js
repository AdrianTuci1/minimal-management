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
  
  const dateRange = generateDateRange(startDate, 28) // 4 weeks
  
  return {
    layout: {
      navigation: {
        items: [
          { id: 'reservations', label: 'Rezervări', icon: 'calendar', active: true }
        ]
      }
    },
    dateRange,
    items: (() => {
      // Helper function to get room type initials
      const getRoomTypeInitials = (roomType) => {
        const typeMap = {
          'Single': 'S',
          'Double': 'CD',
          'Deluxe': 'CD',
          'Suite': 'SU',
          'Apartament': 'AP',
          'Standard': 'S'
        };
        return typeMap[roomType] || roomType.substring(0, 2).toUpperCase();
      };

      // Helper function to create avatar for room
      const createRoomAvatar = (roomType) => {
        const initials = getRoomTypeInitials(roomType);
        const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
        const colorIndex = initials.charCodeAt(0) % colors.length;
        return {
          backgroundColor: colors[colorIndex],
          initials: initials
        };
      };

      // Helper function to create a room
      const createRoom = (roomId, roomNumber, floor, roomType, color, children = []) => ({
        id: roomId,
        name: `Camera ${roomNumber}`,
        color,
        type: 'room',
        expanded: false, // Not expanded by default
        level: 0,
        timeline: null,
        avatar: createRoomAvatar(roomType),
        children
      });

      // Helper function to create guest avatar initials
      const getGuestInitials = (guestName) => {
        const parts = guestName.split(' ');
        if (parts.length >= 2) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return guestName.substring(0, 2).toUpperCase();
      };

      // Helper function to create avatar for reservation
      const createReservationAvatar = (guestName) => {
        const initials = getGuestInitials(guestName);
        const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
        const colorIndex = guestName.length % colors.length;
        return {
          backgroundColor: colors[colorIndex],
          initials: initials
        };
      };

      // Helper function to create a reservation
      const createReservation = (resId, guestName, startDays, durationDays, status = 'confirmată') => {
        const statusColors = {
          'confirmată': 'emerald',
          'în curs': 'amber',
          'nouă': 'blue',
          'ocupată': 'red',
          'check-out': 'orange'
        };
        return {
          id: resId,
          name: guestName,
          color: statusColors[status] || 'blue',
            type: 'reservation',
          status,
            level: 1,
          avatar: createReservationAvatar(guestName),
            timeline: {
              type: 'bar',
            startDate: new Date(startDate.getTime() + startDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date(startDate.getTime() + (startDays + durationDays) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            color: statusColors[status] || 'blue',
            showAvatar: true
          }
        };
      };

      // Helper function to determine room type based on floor and index
      const getRoomType = (floor, index, totalRooms) => {
        // More Double rooms, fewer Single
        const roomTypes = ['Double', 'Double', 'Double', 'Double', 'Double', 'Single', 'Double', 'Suite'];
        const typeIndex = (index - 1) % roomTypes.length;
        
        // Adjust for different floors
        if (floor === 1) {
          // Etaj 1: Mostly Double, some Single
          return index <= 6 ? 'Double' : index <= 7 ? 'Single' : 'Double';
        } else if (floor === 2) {
          // Etaj 2: Mix of Double and Deluxe
          return index <= 4 ? 'Deluxe' : 'Double';
        } else if (floor === 3) {
          // Etaj 3: Mix of Suite and Double
          return index <= 3 ? 'Suite' : 'Double';
        } else if (floor === 4) {
          // Etaj 4: Suite and Double
          return index <= 2 ? 'Suite' : 'Double';
        }
        
        return roomTypes[typeIndex];
      };

      // Generate rooms
      const rooms = [];
      
      // Etaj 1 - 8 camere (mostly Double)
      for (let i = 1; i <= 8; i++) {
        const roomNumber = `10${i}`;
        const roomId = `room-${roomNumber}`;
        const roomType = getRoomType(1, i, 8);
        const children = [];
        
        // Add some sample reservations
        if (i === 1) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Familie Popescu', 2, 3, 'confirmată'));
          children.push(createReservation(`res-${roomNumber}-2`, 'Ion Georgescu', 7, 2, 'în curs'));
          children.push(createReservation(`res-${roomNumber}-3`, 'Ana Pop', 10, 1, 'nouă')); // 1 night
        } else if (i === 2) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Maria Ionescu', 0, 4, 'ocupată'));
          children.push(createReservation(`res-${roomNumber}-2`, 'Dan Radu', 5, 1, 'confirmată')); // 1 night
        } else if (i === 3) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Stefan Marin', 3, 1, 'confirmată')); // 1 night
        } else if (i === 5) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Andrei Popescu', 4, 2, 'confirmată'));
        } else if (i === 6) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Elena Stan', 8, 1, 'nouă')); // 1 night
        }
        
        rooms.push(createRoom(roomId, roomNumber, 1, roomType, 'blue', children));
      }
      
      // Etaj 2 - 8 camere (mix of Deluxe and Double)
      for (let i = 1; i <= 8; i++) {
        const roomNumber = `20${i}`;
        const roomId = `room-${roomNumber}`;
        const roomType = getRoomType(2, i, 8);
        const children = [];
        
        if (i === 1) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Alexandru Marin', 1, 7, 'confirmată'));
          children.push(createReservation(`res-${roomNumber}-2`, 'Cristina Stanciu', 12, 4, 'nouă'));
          children.push(createReservation(`res-${roomNumber}-3`, 'Laura Pop', 9, 1, 'confirmată')); // 1 night
        } else if (i === 2) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Familie Dumitrescu', 3, 3, 'ocupată'));
          children.push(createReservation(`res-${roomNumber}-2`, 'Mihai Ionescu', 7, 1, 'nouă')); // 1 night
        } else if (i === 3) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Elena Georgescu', 4, 1, 'confirmată')); // 1 night
        } else if (i === 5) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Radu Marin', 6, 2, 'confirmată'));
        } else if (i === 7) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Carmen Pop', 10, 1, 'nouă')); // 1 night
        }
        
        rooms.push(createRoom(roomId, roomNumber, 2, roomType, 'purple', children));
      }
      
      // Etaj 3 - 8 camere (mix of Suite and Double)
      for (let i = 1; i <= 8; i++) {
        const roomNumber = `30${i}`;
        const roomId = `room-${roomNumber}`;
        const roomType = getRoomType(3, i, 8);
        const children = [];
        
        if (i === 1) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Mihai Radu & Laura Mitrea', 5, 7, 'confirmată'));
          children.push(createReservation(`res-${roomNumber}-2`, 'Carmen Stan', 13, 1, 'confirmată')); // 1 night
        } else if (i === 2) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Radu Popescu', 6, 1, 'nouă')); // 1 night
        } else if (i === 4) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Stefan Ionescu', 2, 3, 'confirmată'));
        } else if (i === 6) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Ana Marin', 9, 1, 'confirmată')); // 1 night
        }
        
        rooms.push(createRoom(roomId, roomNumber, 3, roomType, 'green', children));
      }
      
      // Etaj 4 - 6 camere (Suite and Double)
      for (let i = 1; i <= 6; i++) {
        const roomNumber = `40${i}`;
        const roomId = `room-${roomNumber}`;
        const roomType = getRoomType(4, i, 6);
        const children = [];
        
        if (i === 1) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Familie Georgescu', 1, 5, 'confirmată'));
        } else if (i === 3) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Mihai Stan', 7, 1, 'nouă')); // 1 night
        } else if (i === 5) {
          children.push(createReservation(`res-${roomNumber}-1`, 'Laura Popescu', 4, 2, 'confirmată'));
        }
        
        rooms.push(createRoom(roomId, roomNumber, 4, roomType, 'green', children));
      }
      
      return rooms;
    })(),
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

