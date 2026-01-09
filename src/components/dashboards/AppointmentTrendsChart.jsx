"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "Interactive Revenue & Patients Trends"

// Demo data generator with realistic weekly pattern
const generateData = () => {
    const data = []
    const today = new Date()
    for (let i = 0; i < 90; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (89 - i))
        const dateStr = date.toISOString().split('T')[0]
        const day = date.getDay()

        // Base values (higher on weekdays 1-5, lower on weekends 0,6)
        let basePatients = (day === 0 || day === 6) ? 5 : 25

        // Add randomness
        const patients = Math.max(0, Math.floor(basePatients + (Math.random() * 10 - 3)))
        // Revenue correlates with patients, avg ~$150-$300 per patient
        const revenue = Math.floor(patients * (150 + Math.random() * 150))

        data.push({
            date: dateStr,
            patients: patients,
            revenue: revenue,
        })
    }
    return data
}

const chartData = generateData()

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#2563eb", // blue-600
    },
    patients: {
        label: "Patients",
        color: "#60a5fa", // blue-400
    },
}

export default function AppointmentTrendsChart({ labels = {}, stats = {} }) {
    const [timeRange, setTimeRange] = React.useState("90d")
    const [hoveredSeries, setHoveredSeries] = React.useState(null)

    // Derived Stats for Overlay
    const totalRevenue = stats.revenue || chartData.reduce((acc, curr) => acc + curr.revenue, 0)
    const totalPatients = stats.patients || chartData.reduce((acc, curr) => acc + curr.patients, 0)

    const defaultLabels = {
        title: "Performance Trends",
        revenueLabel: "Total Revenue",
        patientsLabel: "Total Patients",
    }
    const finalLabels = { ...defaultLabels, ...labels }

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const now = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(now)
        startDate.setDate(now.getDate() - daysToSubtract)
        return date >= startDate
    })

    // Helper for opacity based on hover
    const getOpacity = (seriesName) => {
        if (!hoveredSeries) return 0.8
        return hoveredSeries === seriesName ? 1 : 0.1
    }

    const getStrokeOpacity = (seriesName) => {
        if (!hoveredSeries) return 1
        return hoveredSeries === seriesName ? 1 : 0.1
    }

    return (
        <Card className="relative overflow-hidden">
            {/* Absolute Overlay Stats (Top Left) */}
            <div className="absolute top-4 left-6 z-10 flex flex-col gap-1 pointer-events-none">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">${totalRevenue.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground uppercase">{finalLabels.revenueLabel}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-blue-400">{totalPatients.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground uppercase">{finalLabels.patientsLabel}</span>
                </div>
            </div>

            {/* Absolute Time Select (Top Right) */}
            <div className="absolute top-4 right-6 z-10">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[120px] h-8 text-xs bg-background/50 backdrop-blur-sm border-none shadow-none hover:bg-background/80 transition-colors"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg text-xs">Last 3 months</SelectItem>
                        <SelectItem value="30d" className="rounded-lg text-xs">Last 30 days</SelectItem>
                        <SelectItem value="7d" className="rounded-lg text-xs">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <CardContent className="px-2 pt-20 pb-4 sm:px-6 sm:pb-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            {/* Revenue Gradient */}
                            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                            </linearGradient>
                            {/* Patients Gradient */}
                            <linearGradient id="fillPatients" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis yAxisId="right" orientation="right" tick={false} axisLine={false} width={0} domain={['auto', 'auto']} />
                        <YAxis yAxisId="left" orientation="left" tick={false} axisLine={false} width={0} />

                        <ChartTooltip
                            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />

                        <Area
                            yAxisId="left"
                            dataKey="revenue"
                            type="monotone"
                            fill="url(#fillRevenue)"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={getOpacity('revenue')}
                            strokeOpacity={getStrokeOpacity('revenue')}
                            activeDot={{ r: 0, strokeWidth: 0, fill: "transparent" }}
                            onMouseEnter={() => setHoveredSeries('revenue')}
                            onMouseLeave={() => setHoveredSeries(null)}
                        />
                        <Area
                            yAxisId="right"
                            dataKey="patients"
                            type="monotone"
                            fill="url(#fillPatients)"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            fillOpacity={getOpacity('patients')}
                            strokeOpacity={getStrokeOpacity('patients')}
                            activeDot={{ r: 0, strokeWidth: 0, fill: "transparent" }}
                            onMouseEnter={() => setHoveredSeries('patients')}
                            onMouseLeave={() => setHoveredSeries(null)}
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
