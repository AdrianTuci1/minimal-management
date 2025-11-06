import { CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, Dumbbell, Activity, Heart } from "lucide-react"

const serviceIcons = {
  Sala: Dumbbell,
  Fitness: Activity,
  Aerobic: Heart,
  Pilates: Activity,
}

function ServiceTimeStats({ stats = [] }) {
  if (!stats || stats.length === 0) {
    return (
      <div>
        <CardTitle>Timp mediu pe servicii</CardTitle>
        <CardDescription>Nu există date disponibile</CardDescription>
      </div>
    )
  }

  // Find the maximum average time to calculate progress bar percentages
  const maxTime = Math.max(...stats.map(s => s.averageMinutes), 1)

  return (
    <div>
      <div>
        <CardTitle>Timp mediu pe servicii</CardTitle>
        <CardDescription>
          Timpul mediu petrecut în ultimele sesiuni
        </CardDescription>
      </div>
      <div className="mt-4">
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = serviceIcons[stat.service] || Dumbbell
            const progressPercentage = (stat.averageMinutes / maxTime) * 100
            
            return (
              <div
                key={index}
                className="space-y-2 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{stat.service}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.totalSessions} sesiuni
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{stat.averageMinutes} min</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ServiceTimeStats

