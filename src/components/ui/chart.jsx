"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

// Chart configuration type (just a type/interface placeholder for JSX)
export const ChartConfig = {}

// ChartContainer component
export const ChartContainer = React.forwardRef(
  ({ config, className, children, ...props }, ref) => {
    const id = React.useId()
    const uniqueId = `chart-${id}`

    // Extract color from config
    const colorMap = {}
    if (config) {
      Object.keys(config).forEach((key) => {
        if (config[key]?.color) {
          colorMap[key] = config[key].color
        }
      })
    }

    return (
      <div
        ref={ref}
        className={cn("w-full h-[300px]", className)}
        style={{
          "--chart-1": "hsl(var(--chart-1))",
          "--chart-2": "hsl(var(--chart-2))",
          "--chart-3": "hsl(var(--chart-3))",
          "--chart-4": "hsl(var(--chart-4))",
          "--chart-5": "hsl(var(--chart-5))",
          ...Object.keys(colorMap).reduce((acc, key) => {
            acc[`--color-${key}`] = colorMap[key]
            return acc
          }, {}),
        }}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...child.props,
                data: child.props.data || [],
              })
            }
            return child
          })}
        </ResponsiveContainer>
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// ChartTooltip component - wrapper for recharts Tooltip
export const ChartTooltip = ({ children, ...props }) => {
  return <>{children}</>
}

// ChartTooltipContent component - custom tooltip content
export const ChartTooltipContent = React.forwardRef(
  ({ active, payload, label, hideLabel = false, className, formatter, labelFormatter, ...props }, ref) => {
    if (!active || !payload || payload.length === 0) {
      return null
    }

    const formattedLabel = labelFormatter ? labelFormatter(label) : label

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background p-2 shadow-md",
          className
        )}
        {...props}
      >
        {!hideLabel && formattedLabel && (
          <div className="mb-2 text-sm font-medium">{formattedLabel}</div>
        )}
        <div className="space-y-1">
          {payload.map((item, index) => {
            const key = item.dataKey || item.name || `item-${index}`
            const color = item.color || `hsl(var(--chart-${(index % 5) + 1}))`
            
            let displayValue = item.value
            let displayName = item.name || "Value"
            
            if (formatter) {
              const formatted = formatter(item.value, item.name, item)
              if (Array.isArray(formatted)) {
                displayValue = formatted[0]
                displayName = formatted[1] || displayName
              } else {
                displayValue = formatted
              }
            }
            
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-muted-foreground">{displayName}:</span>
                <span className="font-medium">{displayValue}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

