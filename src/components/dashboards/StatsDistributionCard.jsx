import React from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const StatsDistributionCard = ({ distributionData = [], rating, totalReviews, bookings, labels = {} }) => {

    // Prepare data for the chart
    const chartData = distributionData.map((item, index) => ({
        ...item,
        value: item.count,
        fill: `hsl(var(--chart-${index + 1}))`
    })).slice(0, 4) // Limit to top 4

    const chartConfig = {
        count: {
            label: "Treatments",
        }
    }

    return (
        <div className="card h-full flex flex-col">
            <div className="card-header pb-2">
                <h3 className="card-title font-medium text-lg">Metrics Distribution</h3>
            </div>

            {/* Top Row: Chart + Legend */}
            <div className="card-content flex-1 max-h-[60%] flex items-center justify-between pb-4 border-b border-border/50">
                {/* Left: Pie Chart (Ring) */}
                <div className="w-[120px] h-[120px] relative shrink-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-full w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="treatment"
                                    innerRadius={35}
                                    outerRadius={55}
                                    strokeWidth={0}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel nameKey="treatment" />}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Right: Legend/Distribution */}
                <div className="flex-1 pl-4 flex flex-col justify-center gap-2 overflow-y-auto max-h-[120px]">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 truncate">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                                <span className="text-muted-foreground truncate">{item.treatment}</span>
                            </div>
                            <span className="font-medium ml-2">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Row: Stats (Rating & Bookings) */}
            <div className="p-4 pt-4 flex items-center justify-around gap-4 bg-muted/10">
                {/* Rating */}
                <div className="text-center">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1 opacity-70">{labels.ratingLabel || "Rating"}</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold tracking-tight">{rating?.average || 0}</span>
                        <span className="text-[10px] text-muted-foreground">/ 5.0</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-border/50" />

                {/* Bookings */}
                <div className="text-center">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1 opacity-70">{labels.visitorsLabel || "Bookings"}</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold tracking-tight">{bookings || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsDistributionCard
