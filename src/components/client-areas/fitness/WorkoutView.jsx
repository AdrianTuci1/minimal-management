import { useMemo } from "react"
import GanttChart from "@/components/GanttChart"
import { fitnessWorkoutData } from "@/config/demoGanttData"

function WorkoutView() {
  // Generate fresh data with current dates
  const workoutData = useMemo(() => {
    // Use the demo data - it already generates dates dynamically
    return fitnessWorkoutData
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout</h1>
      </div>

      <div className="w-full h-[calc(100vh-200px)] overflow-hidden rounded-lg border border-border shadow-sm">
        <GanttChart data={workoutData} />
      </div>
    </div>
  )
}

export default WorkoutView

