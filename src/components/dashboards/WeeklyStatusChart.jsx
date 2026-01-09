import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '../ui/chart'

const WeeklyStatusChart = ({ data = [] }) => {

    // Fallback/Synthetic data if none provided
    const chartData = data.length > 0 ? data : [
        { day: 'Mon', completed: 15, cancelled: 2 },
        { day: 'Tue', completed: 18, cancelled: 1 },
        { day: 'Wed', completed: 12, cancelled: 4 },
        { day: 'Thu', completed: 20, cancelled: 0 },
        { day: 'Fri', completed: 22, cancelled: 3 },
        { day: 'Sat', completed: 14, cancelled: 1 },
        { day: 'Sun', completed: 5, cancelled: 0 },
    ]

    const chartConfig = {
        completed: {
            label: "Completed",
            color: "hsl(var(--chart-1))",
        },
        cancelled: {
            label: "Cancelled",
            color: "hsl(var(--destructive))",
        },
    }

    return (
        <div className="card h-full flex flex-col">
            <div className="card-header pb-2">
                <h3 className="card-title font-medium text-lg">Weekly Performance</h3>
                <p className="text-sm text-muted-foreground">Realized vs Cancelled Appointments</p>
            </div>
            <div className="card-content flex-1 min-h-[250px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                            <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    )
}

export default WeeklyStatusChart
