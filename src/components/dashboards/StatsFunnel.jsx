import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const StatsFunnel = ({ data = [] }) => {
    // default data updated to realistic funnel metrics
    const defaultData = [
        { label: 'Impressions', value: 12500 },
        { label: 'Clicks', value: 8500 },
        { label: 'Signups', value: 3200 },
        { label: 'Purchases', value: 450 }
    ]

    const chartData = data.length > 0 ? data : defaultData

    // Configuration
    const width = 100
    const height = 100
    const paddingY = 10

    // Calculate scaling
    const maxValue = Math.max(...chartData.map(d => d.value)) || 100

    // Coordinate logic
    const features = useMemo(() => {
        return chartData.map((d, i) => {
            const normalizedValue = d.value / maxValue
            // Reserve some padding top/bottom so it doesn't touch edges
            const h = normalizedValue * (height - paddingY * 2)

            const x = (i / (chartData.length - 1)) * width
            const yTop = (height - h) / 2
            const yBottom = (height + h) / 2

            return { x, yTop, yBottom, data: d }
        })
    }, [chartData, maxValue])

    // Helper to split a cubic bezier at t=0.5
    // Returns [ { p0, cp1, cp2, p3 }, { p0, cp1, cp2, p3 } ] (Left and Right segments)
    const splitBezier = (p0, cp1, cp2, p3) => {
        const mid_p0_cp1 = { x: (p0.x + cp1.x) / 2, y: (p0.y + cp1.y) / 2 }
        const mid_cp1_cp2 = { x: (cp1.x + cp2.x) / 2, y: (cp1.y + cp2.y) / 2 }
        const mid_cp2_p3 = { x: (cp2.x + p3.x) / 2, y: (cp2.y + p3.y) / 2 }

        const mid_l2 = { x: (mid_p0_cp1.x + mid_cp1_cp2.x) / 2, y: (mid_p0_cp1.y + mid_cp1_cp2.y) / 2 }
        const mid_r1 = { x: (mid_cp1_cp2.x + mid_cp2_p3.x) / 2, y: (mid_cp1_cp2.y + mid_cp2_p3.y) / 2 }

        const mid = { x: (mid_l2.x + mid_r1.x) / 2, y: (mid_l2.y + mid_r1.y) / 2 }

        return [
            { p0: p0, cp1: mid_p0_cp1, cp2: mid_l2, p3: mid },
            { p0: mid, cp1: mid_r1, cp2: mid_cp2_p3, p3: p3 }
        ]
    }

    // Generate N shapes for N items
    const segments = useMemo(() => {
        if (features.length < 2) return []

        // 1. Calculate the transitions (connectors) between points
        const transitions = []
        for (let i = 0; i < features.length - 1; i++) {
            const current = features[i]
            const next = features[i + 1]

            // Standard control points for sigmoid-like curve
            const cp1x = current.x + (next.x - current.x) / 2
            const cp2x = next.x - (next.x - current.x) / 2

            // Top curve
            const topSplit = splitBezier(
                { x: current.x, y: current.yTop },
                { x: cp1x, y: current.yTop },
                { x: cp2x, y: next.yTop },
                { x: next.x, y: next.yTop }
            )

            // Bottom curve
            const bottomSplit = splitBezier(
                { x: current.x, y: current.yBottom },
                { x: cp1x, y: current.yBottom },
                { x: cp2x, y: next.yBottom },
                { x: next.x, y: next.yBottom }
            )

            transitions.push({
                top: topSplit,
                bottom: bottomSplit
            })
        }

        // 2. Construct Shapes centered on each Node
        const blocks = []
        for (let i = 0; i < features.length; i++) {
            let d = ""

            // Start Point logic
            if (i === 0) {
                // First block: Starts at x=0
                d = `M ${features[i].x},${features[i].yTop}`

                // Add Left half of transition 0
                const t = transitions[0]
                const c = t.top[0] // Left part
                d += ` C ${c.cp1.x},${c.cp1.y} ${c.cp2.x},${c.cp2.y} ${c.p3.x},${c.p3.y}`

                // Vertical down at split
                const b = t.bottom[0] // Left part
                d += ` L ${b.p3.x},${b.p3.y}`

                // Backwards along bottom left part
                d += ` C ${b.cp2.x},${b.cp2.y} ${b.cp1.x},${b.cp1.y} ${b.p0.x},${b.p0.y}`

                d += " Z"

            } else if (i === features.length - 1) {
                // Last block
                const tPrev = transitions[i - 1]

                // Start at top split of prev
                const t = tPrev.top[1] // Right part
                d = `M ${t.p0.x},${t.p0.y}`

                // Curve to end
                d += ` C ${t.cp1.x},${t.cp1.y} ${t.cp2.x},${t.cp2.y} ${t.p3.x},${t.p3.y}`

                // Vertical down to bottom
                d += ` L ${features[i].x},${features[i].yBottom}`

                // Backwards along bottom right part
                const b = tPrev.bottom[1]
                d += ` C ${b.cp2.x},${b.cp2.y} ${b.cp1.x},${b.cp1.y} ${b.p0.x},${b.p0.y}`

                d += " Z"

            } else {
                // Middle blocks
                const tPrev = transitions[i - 1]
                const tNext = transitions[i]

                // Start after prev split
                const t1 = tPrev.top[1] // Right part of incoming
                d = `M ${t1.p0.x},${t1.p0.y}`

                // Curve to center
                d += ` C ${t1.cp1.x},${t1.cp1.y} ${t1.cp2.x},${t1.cp2.y} ${t1.p3.x},${t1.p3.y}`

                // Curve from center to next split
                const t2 = tNext.top[0] // Left part of outgoing
                d += ` C ${t2.cp1.x},${t2.cp1.y} ${t2.cp2.x},${t2.cp2.y} ${t2.p3.x},${t2.p3.y}`

                // Vertical down
                const b2 = tNext.bottom[0]
                d += ` L ${b2.p3.x},${b2.p3.y}`

                // Backwards bottom 
                d += ` C ${b2.cp2.x},${b2.cp2.y} ${b2.cp1.x},${b2.cp1.y} ${b2.p0.x},${b2.p0.y}`

                const b1 = tPrev.bottom[1]
                d += ` C ${b1.cp2.x},${b1.cp2.y} ${b1.cp1.x},${b1.cp1.y} ${b1.p0.x},${b1.p0.y}`

                d += " Z"
            }

            blocks.push({
                d,
                colorVar: `hsl(var(--chart-${(i % 5) + 1}))`,
                data: features[i].data
            })
        }
        return blocks
    }, [features])

    return (
        <div className="w-full h-[200px] flex flex-col justify-center">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                {/* Segments with Tooltips */}
                {segments.map((seg, i) => (
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.path
                                    d={seg.d}
                                    fill={seg.colorVar}
                                    // Removed stroke for a cleaner look, or keep it minimal if needed
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-sm font-semibold">{seg.data.label}</div>
                                <div className="text-xs text-muted-foreground">{seg.data.value.toLocaleString()}</div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}

                {/* Labels removed to avoid visual conflict */}
            </svg>
        </div>
    )
}

export default StatsFunnel
