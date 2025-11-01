import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTableColumns } from "@/config/tableColumns"
import { cn } from "@/lib/utils"

const treatments = [
  {
    code: "TR-014",
    name: "Implant complet",
    duration: "120 min",
    doctor: "Dr. Mihai Popescu",
    price: "€920",
    status: "Disponibil",
  },
  {
    code: "TR-032",
    name: "Fațete ceramice",
    duration: "90 min",
    doctor: "Dr. Irina Stan",
    price: "€740",
    status: "Necesită aprobare",
  },
  {
    code: "TR-021",
    name: "Reabilitare arcadă",
    duration: "150 min",
    doctor: "Dr. Ana Ionescu",
    price: "€1,120",
    status: "Disponibil",
  },
  {
    code: "TR-009",
    name: "Albire profesională",
    duration: "60 min",
    doctor: "Dr. Irina Stan",
    price: "€260",
    status: "Promovat",
  },
  {
    code: "TR-002",
    name: "Control periodic",
    duration: "30 min",
    doctor: "Echipă generală",
    price: "€80",
    status: "Disponibil",
  },
]

const statusTone = {
  Disponibil: "bg-emerald-500/10 text-emerald-600",
  "Necesită aprobare": "bg-amber-500/10 text-amber-600",
  Promovat: "bg-blue-500/10 text-blue-600",
}

const TreatmentsView = () => {
  const columns = getTableColumns("tratamente")

  return (
    <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden">
      <div className="min-w-[960px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.width,
                    index < columns.length - 1 && "border-r border-border/70"
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((item) => (
              <TableRow key={item.code} className="hover:bg-muted/30">
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                  >
                    {column.id === "cod" ? (
                      <span className="font-medium text-foreground">{column.accessor(item)}</span>
                    ) : column.id === "pret" ? (
                      <span className="font-medium text-foreground">{column.accessor(item)}</span>
                    ) : column.id === "status" ? (
                      <Badge variant="secondary" className={statusTone[item.status] ?? "bg-muted text-muted-foreground"}>
                        {column.accessor(item)}
                      </Badge>
                    ) : (
                      column.accessor(item)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TreatmentsView

