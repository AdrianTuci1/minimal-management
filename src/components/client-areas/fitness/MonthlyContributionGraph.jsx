import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { CardTitle, CardDescription } from "@/components/ui/card"

// Colors for each service
const SERVICE_COLORS = {
  Sala: "bg-blue-500",
  Fitness: "bg-purple-500",
  Aerobic: "bg-pink-500",
  Pilates: "bg-green-500",
}

const DEFAULT_COLOR = "bg-gray-400"

function MonthlyContributionGraph({ sessionHistory = [], className = "" }) {
  const [hoveredDay, setHoveredDay] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Generate data for the last 6 months (approximately 180 days)
  const monthData = useMemo(() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Group sessions by date
    const sessionsByDate = {}
    sessionHistory.forEach((session) => {
      if (!sessionsByDate[session.date]) {
        sessionsByDate[session.date] = []
      }
      sessionsByDate[session.date].push(session)
    })

    // Generate last 6 months (180 days)
    const daysToGenerate = 180
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const daySessions = sessionsByDate[dateString] || []
      
      // Group sessions by service for this day
      const servicesByDay = {}
      daySessions.forEach((session) => {
        if (!servicesByDay[session.service]) {
          servicesByDay[session.service] = []
        }
        servicesByDay[session.service].push(session)
      })

      // Determine the primary service (most common) or use the first one if multiple
      const services = Object.keys(servicesByDay)
      const primaryService = services.length > 0 
        ? services.reduce((a, b) => 
            servicesByDay[a].length > servicesByDay[b].length ? a : b
          )
        : null

      days.push({
        date: dateString,
        dateObj: date,
        sessions: daySessions,
        services: servicesByDay,
        primaryService,
        count: daySessions.length,
      })
    }

    return days
  }, [sessionHistory])

  const handleDayHover = (day, event) => {
    if (day.count > 0) {
      setHoveredDay(day)
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top })
    }
  }

  const handleDayLeave = () => {
    setHoveredDay(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ro-RO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get all unique services for legend
  const allServices = useMemo(() => {
    const services = new Set()
    sessionHistory.forEach((session) => {
      services.add(session.service)
    })
    return Array.from(services)
  }, [sessionHistory])

  // Calculate week structure - organize by weeks (GitHub-style)
  // Each week should start from Sunday and go to Saturday
  const weeks = useMemo(() => {
    const weeksArray = []
    
    // Find the first Sunday before or on the first day
    const firstDay = monthData[0]?.dateObj
    if (!firstDay) return []
    
    const firstSunday = new Date(firstDay)
    const dayOfWeek = firstDay.getDay() // 0 = Sunday, 6 = Saturday
    firstSunday.setDate(firstDay.getDate() - dayOfWeek)
    
    // Create a map of dates to day data for quick lookup
    const dateMap = new Map()
    monthData.forEach(day => {
      dateMap.set(day.date, day)
    })
    
    // Generate all weeks (approximately 26 weeks for 6 months)
    const numWeeks = Math.ceil(180 / 7) + 1 // Add one week for padding
    for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
      const week = []
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDate = new Date(firstSunday)
        currentDate.setDate(firstSunday.getDate() + weekIndex * 7 + dayIndex)
        const dateString = currentDate.toISOString().split("T")[0]
        
        // Check if this date is within our data range
        const dayData = dateMap.get(dateString)
        if (dayData) {
          week.push(dayData)
        } else {
          // Add empty day for alignment
          week.push({
            date: dateString,
            dateObj: currentDate,
            sessions: [],
            services: {},
            primaryService: null,
            count: 0,
          })
        }
      }
      weeksArray.push(week)
    }
    
    return weeksArray
  }, [monthData])

  // Function to get style for day with multiple services
  const getDayStyle = (day) => {
    const services = Object.keys(day.services)
    if (services.length === 0) return { backgroundColor: "var(--muted)" }
    if (services.length === 1) {
      const color = SERVICE_COLORS[services[0]] || DEFAULT_COLOR
      return { backgroundColor: color.replace("bg-", "") }
    }
    // Multiple services - use primary service but add a border pattern
    const primaryColor = SERVICE_COLORS[day.primaryService] || DEFAULT_COLOR
    return { backgroundColor: primaryColor.replace("bg-", "") }
  }

  return (
    <div className="w-full flex flex-col justify-center align-center">
      <div className="space-y-4 w-full flex flex-col justify-center align-center">
        <div>
          <CardTitle>Activități pe ultimele 6 luni</CardTitle>
          <CardDescription>
            Vizualizare activități pe servicii în ultimele 6 luni
          </CardDescription>
        </div>
        
        {/* Contribution Graph */}
        <div className="overflow-x-auto w-full pb-2">
          <div className="inline-block min-w-full">
            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const dayOfWeek = day.dateObj.getDay()
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                    
                    const services = Object.keys(day.services)
                    const hasMultipleServices = services.length > 1
                    const colorClass = services.length > 0
                      ? services.length === 1
                        ? SERVICE_COLORS[services[0]] || DEFAULT_COLOR
                        : SERVICE_COLORS[day.primaryService] || DEFAULT_COLOR
                      : "bg-muted"

                    return (
                      <div
                        key={dayIndex}
                        className={`
                          w-3 h-3 rounded-sm cursor-pointer transition-all relative
                          ${day.count > 0 ? colorClass : "bg-muted"}
                          ${day.count > 0 ? "hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:scale-110" : ""}
                          ${isWeekend ? "opacity-60" : ""}
                        `}
                        onMouseEnter={(e) => handleDayHover(day, e)}
                        onMouseLeave={handleDayLeave}
                        title={day.count > 0 ? `${formatDate(day.date)}: ${day.count} sesiuni` : formatDate(day.date)}
                      >
                        {/* Indicator for multiple services */}
                        {hasMultipleServices && (
                          <div className="absolute inset-0 rounded-sm border border-white/30" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Tooltip */}
          {hoveredDay && hoveredDay.count > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-50 rounded-lg border bg-popover px-3 py-2 text-sm shadow-lg pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y - 50,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-semibold mb-1">
                {formatDate(hoveredDay.date)}
              </div>
              <div className="space-y-1">
                {Object.entries(hoveredDay.services).map(([service, sessions]) => (
                  <div key={service} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-3 h-3 rounded-sm ${SERVICE_COLORS[service] || DEFAULT_COLOR}`}
                    />
                    <span>
                      {service}: {sessions.length} sesiuni
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Legend */}
        {allServices.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              {allServices.map((service) => (
                <div key={service} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-sm ${SERVICE_COLORS[service] || DEFAULT_COLOR}`}
                  />
                  <span className="text-xs text-muted-foreground">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MonthlyContributionGraph

