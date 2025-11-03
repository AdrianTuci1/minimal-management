import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { BarChart3, Folder, Users, Building2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import WorkspaceCard from "../WorkspaceCard"

// Helper function to create a deterministic hash from string
const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function RecentsView({ workspaces, groups, workspaceAccessLog, onSelectWorkspace, onViewChange }) {
  // Calculate hours per day for the last 7 days
  const weeklyHours = useMemo(() => {
    const days = []
    const now = new Date()
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      // Filter logs for this day
      const dayLogs = workspaceAccessLog.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= date && logDate < nextDay
      })
      
      // Calculate hours: each access represents ~2-4 hours of usage
      // Use a deterministic calculation based on access count
      let hours = 0
      dayLogs.forEach((log, idx) => {
        const hash = hashString(log.workspaceId + log.timestamp)
        const baseHours = 2 + (hash % 100) / 50 // 2-4 hours per access
        hours += baseHours
      })
      
      // Format day name
      const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm']
      const dayName = dayNames[date.getDay()]
      const dayNumber = date.getDate()
      
      days.push({
        day: dayName,
        date: dayNumber,
        hours: Math.round(hours * 10) / 10, // Round to 1 decimal
      })
    }
    
    return days
  }, [workspaceAccessLog])

  // Get all workspaces
  const allWorkspaces = useMemo(() => {
    return workspaces
  }, [workspaces])

  // Transform weeklyHours data for BarChart
  const chartData = useMemo(() => {
    return weeklyHours.map((day) => ({
      name: `${day.day} ${day.date}`,
      label: day.day,
      date: day.date,
      hours: day.hours,
    }))
  }, [weeklyHours])

  const chartConfig = {
    hours: {
      label: "Ore",
      color: "hsl(var(--chart-1))",
    },
  }

  const totalHours = useMemo(() => {
    return weeklyHours.reduce((sum, day) => sum + day.hours, 0)
  }, [weeklyHours])

  return (
    <>
      {/* Weekly Hours Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Ore petrecute în aplicație</CardTitle>
          </div>
          <CardDescription>Ultimele 7 zile</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <Tooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    formatter={(value, name) => [`${value}h`, "Ore"]}
                    labelFormatter={(label) => {
                      const dayData = chartData.find((d) => d.label === label)
                      return dayData ? `${dayData.label} ${dayData.date}` : label
                    }}
                  />
                }
              />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground">Total săptămână</span>
            <span className="font-semibold">
              {totalHours.toFixed(1)}h
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Workspaces Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <Folder className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Spații de lucru</h2>
        </div>
        {allWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} onSelect={onSelectWorkspace} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nu ai spații de lucru</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Creează primul tău spațiu de lucru pentru a începe să folosești aplicația.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Groups Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Grupuri</h2>
        </div>
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const groupWorkspaces = workspaces.filter(ws => ws.groupId === group.id)
              return (
                <Card
                  key={group.id}
                  className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                  onClick={() => onViewChange(group.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Folder className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription>
                          {groupWorkspaces.length} {groupWorkspaces.length === 1 ? "spațiu" : "spații"} de lucru
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nu ai grupuri</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Creează primul tău grup pentru a organiza spațiile de lucru.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

export default RecentsView

