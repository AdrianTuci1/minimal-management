import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dumbbell, Calendar, Clock } from "lucide-react"

function WorkoutView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programările mele</CardTitle>
          <CardDescription>Vezi și gestionează antrenamentele tale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Funcționalitatea va fi disponibilă în curând
            </p>
            <p className="text-xs text-muted-foreground">
              Aici vei putea vedea programările tale și planifica antrenamentele
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkoutView

