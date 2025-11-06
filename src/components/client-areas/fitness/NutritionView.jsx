import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Apple } from "lucide-react"

function NutritionView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nutriție</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planul meu de nutriție</CardTitle>
          <CardDescription>Vezi planul tău alimentar și obiectivele nutriționale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Apple className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Funcționalitatea va fi disponibilă în curând
            </p>
            <p className="text-xs text-muted-foreground">
              Aici vei putea vedea planul tău de nutriție și planifica mesele
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NutritionView

