import React from 'react'
import { Star, MessageSquare } from 'lucide-react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const WebsiteBookingsCard = ({ bookings, rating, smsStats, distributionData = [], labels = {} }) => {

    // Default Labels
    const defaultLabels = {
        title: "Website Bookings",
        visitorsLabel: "Bookings",
        ratingLabel: "Rating",
        smsLabel: "SMS",
        smsLimitLabel: "limit"
    }

    const finalLabels = { ...defaultLabels, ...labels }

    // Prepare data for the chart
    const chartData = distributionData.length > 0 ? distributionData.map((item, index) => ({
        ...item,
        value: item.count,
        fill: `hsl(var(--chart-${index + 1}))`
    })).slice(0, 4) : [
        { treatment: "N/A", value: 1, fill: "var(--muted)" } // Fallback empty state
    ]

    const chartConfig = {
        count: {
            label: "Treatments",
        }
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">{finalLabels.title}</h3>
            </div>
            <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Chart Radial */}
                    <div className="flex items-center justify-center relative">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square h-[200px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="treatment"
                                        innerRadius={60}
                                        outerRadius={80}
                                        strokeWidth={0}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel nameKey="treatment" />}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        {/* Centered Total */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold">{bookings.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground">{finalLabels.visitorsLabel}</span>
                        </div>
                    </div>

                    {/* Metrics Right Side */}
                    <div className="space-y-6 flex flex-col justify-center">
                        {/* Clinic Rating */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <p className="text-sm font-medium">{finalLabels.ratingLabel}</p>
                                </div>
                                <p className="text-xl font-bold">{rating.average.toFixed(1)}</p>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= Math.floor(rating.average) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{rating.totalReviews} reviews</p>
                        </div>

                        {/* SMS Sent */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-500" />
                                    <p className="text-sm font-medium">{finalLabels.smsLabel}</p>
                                </div>
                                <p className="text-xl font-bold">{smsStats.sent}</p>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${smsStats.percentage}%` }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">{smsStats.percentage}% {finalLabels.smsLimitLabel} ({smsStats.sent}/{smsStats.limit})</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebsiteBookingsCard
