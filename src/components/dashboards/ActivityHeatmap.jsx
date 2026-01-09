import React, { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

const ActivityHeatmap = ({ activities = [] }) => {
    // Config
    const daysToShow = 60 // Extended range (approx 2 months)
    const startHour = 8 // 8:00
    const endHour = 20 // 20:00

    // Helper to generate last N days dates
    const dates = useMemo(() => {
        const result = []
        const today = new Date()
        for (let i = daysToShow - 1; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            result.push(d)
        }
        return result
    }, [daysToShow])

    // Helper to format date label (e.g., "Mon 12")
    const getDayLabel = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${days[date.getDay()]} ${date.getDate()}`
    }

    // Process activities into a map: "YYYY-MM-DD-HH" -> count
    const activityMap = useMemo(() => {
        const map = new Map()
        activities.forEach(act => {
            const date = new Date(act.updatedAt || act.createdAt || act.timestamp)
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
            map.set(key, (map.get(key) || 0) + 1)
        })
        return map
    }, [activities])

    // Generate grid data
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)

    return (
        <div className="w-full overflow-hidden">
            <div className="min-w-[300px] flex flex-col gap-2">
                {/* Header - Days removed as requested */}

                {/* Grid - Hours x Days */}
                {/* Grid - Hours x Days */}
                <div className="flex flex-col gap-[1px]">
                    {hours.map(hour => (
                        <div key={hour} className="flex items-center gap-[1px]">
                            {/* Hour Label */}
                            <div className="w-8 text-[10px] text-muted-foreground text-right shrink-0 leading-none mr-1">
                                {hour}:00
                            </div>

                            {/* Dots row */}
                            <div className="flex items-center gap-[1px]">
                                {dates.map((date, i) => {
                                    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${hour}`
                                    const count = activityMap.get(key) || 0

                                    // Determine intensity class - Monochromatic Green Scale
                                    let colorClass = 'bg-secondary' // Visible empty state
                                    if (count > 0) colorClass = 'bg-emerald-300'
                                    if (count > 2) colorClass = 'bg-emerald-500'
                                    if (count > 5) colorClass = 'bg-emerald-700'
                                    if (count > 10) colorClass = 'bg-emerald-900'

                                    return (
                                        <TooltipProvider key={i}>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <div className={`h-3 w-3 rounded-[1px] ${colorClass} hover:opacity-80 transition-opacity cursor-pointer`} />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p className="text-xs font-semibold">
                                                        {count} actions
                                                    </p>
                                                    <p className="text-[10px] opacity-70">
                                                        {date.toLocaleDateString('en-US')} @ {hour}:00
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ActivityHeatmap
