import * as React from "react"
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Dumbbell, Activity, Heart } from "lucide-react"
import useFitnessUserStore from "../../../store/fitnessUserStore"

const DAYS_OF_WEEK = [
  { key: "mon", label: "L", initial: "L" },
  { key: "tue", label: "M", initial: "M" },
  { key: "wed", label: "M", initial: "M" },
  { key: "thu", label: "J", initial: "J" },
  { key: "fri", label: "V", initial: "V" },
  { key: "sat", label: "S", initial: "S" },
  { key: "sun", label: "D", initial: "D" },
]

const serviceIcons = {
  Sala: Dumbbell,
  Fitness: Activity,
  Aerobic: Heart,
  Pilates: Activity,
}

function SimpleWeekCalendar({ selectedDate, onDateSelect }) {
  const { weeklyGoals, setWeeklyGoals, serviceTimeStats } = useFitnessUserStore()
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false)
  const [tempGoals, setTempGoals] = React.useState(weeklyGoals)

  // Get available services from serviceTimeStats
  const availableServices = React.useMemo(() => {
    return serviceTimeStats?.map(stat => stat.service) || []
  }, [serviceTimeStats])

  // Calculate total weekly goal
  const totalWeeklyGoal = React.useMemo(() => {
    return Object.values(weeklyGoals || {}).reduce((sum, goal) => sum + (goal || 0), 0)
  }, [weeklyGoals])

  const currentWeek = React.useMemo(() => {
    const date = selectedDate || new Date()
    return startOfWeek(date, { weekStartsOn: 1 })
  }, [selectedDate])

  React.useEffect(() => {
    setTempGoals(weeklyGoals)
  }, [weeklyGoals, isGoalModalOpen])

  const handleGoalChange = (service, value) => {
    setTempGoals(prev => ({
      ...prev,
      [service]: value[0],
    }))
  }

  const handleSaveGoals = () => {
    setWeeklyGoals(tempGoals)
    setIsGoalModalOpen(false)
  }

  const handleCancel = () => {
    setTempGoals(weeklyGoals)
    setIsGoalModalOpen(false)
  }

  // Prevent body scroll when modal is open and handle Escape key
  React.useEffect(() => {
    if (isGoalModalOpen) {
      document.body.style.overflow = 'hidden'
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleCancel()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isGoalModalOpen, weeklyGoals])

  const handleDateSelect = (date) => {
    onDateSelect?.(date)
  }

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  })

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    return format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  }


  return (
    <div className="w-full space-y-4">
      {/* "X to go" and "Set goal" header */}
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-foreground">
          {totalWeeklyGoal} to go
        </p>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => setIsGoalModalOpen(true)}
        >
          Set goal
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayInfo = DAYS_OF_WEEK[index]
          const isSelected = isDateSelected(day)
          const isTodayDate = isToday(day)

          return (
            <div
              key={day.toString()}
              className="flex flex-col items-center gap-1"
            >
              {/* Day initial and date - oval shape */}
              <Button
                variant="ghost"
                className={cn(
                  "h-12 w-16 rounded-2xl p-0 flex flex-col items-center justify-center font-normal",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isTodayDate && !isSelected && "bg-accent text-accent-foreground",
                  !isSelected && !isTodayDate && "hover:bg-muted"
                )}
                onClick={() => handleDateSelect(day)}
              >
                <span className="text-xs font-medium">{dayInfo.initial}</span>
                <span className="text-base font-semibold">
                  {format(day, "d")}
                </span>
              </Button>
            </div>
          )
        })}
      </div>

      {/* Set Goal Modal Overlay */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-xs animate-in fade-in-0"
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md my-auto">
              <Card className="bg-card border border-border rounded-lg shadow-lg animate-in zoom-in-95 duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">Setează obiectivele săptămânale</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selectează numărul de ședințe pe săptămână pentru fiecare serviciu
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {availableServices.length > 0 ? (
                    <div className="space-y-6">
                      {availableServices.map((service) => {
                        const Icon = serviceIcons[service] || Activity
                        const currentGoal = tempGoals[service] || 0
                        
                        return (
                          <div key={service} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">{service}</span>
                              </div>
                              <span className="text-lg font-semibold text-primary">
                                {currentGoal}
                              </span>
                            </div>
                            <Slider
                              value={[currentGoal]}
                              onValueChange={(value) => handleGoalChange(service, value)}
                              min={0}
                              max={7}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0</span>
                              <span>7</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nu există servicii disponibile
                    </p>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancel}
                    >
                      Anulează
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleSaveGoals}
                    >
                      Salvează
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleWeekCalendar
