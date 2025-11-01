import { useMemo } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getTableColumns } from "@/config/tableColumns"

const statusVariants = {
  disponibil: "bg-emerald-100 text-emerald-700",
  "în consultație": "bg-amber-100 text-amber-700",
  ocupat: "bg-rose-100 text-rose-700",
}

const DoctorsView = ({ doctors = [] }) => {
  const columns = getTableColumns("medici")
  
  const rows = useMemo(() => {
    const cycle = ["disponibil", "în consultație", "ocupat"]

    return doctors.map((doctor, index) => {
      const status = cycle[index % cycle.length]

      return {
        ...doctor,
        status,
        patientsToday: 4 + index,
        activeTreatments: 6 + index * 2,
        nextSlot: index % 3 === 0 ? "12:30" : index % 3 === 1 ? "14:15" : "16:00",
        cabinet: `Cabinet ${index + 1}`,
      }
    })
  }, [doctors])

  return (
    <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden bg-muted/20">
      <div className="min-w-[1100px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    index === 0 && "rounded-l-xl",
                    index === columns.length - 1 && "rounded-r-xl",
                    index < columns.length - 1 && "border-r border-border/70"
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((doctor) => (
              <TableRow key={doctor.id} className="hover:bg-muted/30">
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                  >
                    {column.id === "medic" ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-sm font-semibold" style={{ backgroundColor: `${doctor.color}1a`, color: doctor.color }}>
                            {doctor.name
                              .split(" ")
                              .map((chunk) => chunk[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{doctor.name}</span>
                          <span className="text-xs text-muted-foreground">{doctor.id.replace("dr-", "#DR-").toUpperCase()}</span>
                        </div>
                      </div>
                    ) : column.id === "status" ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium",
                          statusVariants[doctor.status],
                        )}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: doctor.color }} />
                        {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                      </span>
                    ) : column.id === "pacienti" ? (
                      <span className="text-sm font-semibold text-foreground">{column.accessor(doctor)}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{column.accessor(doctor)}</span>
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

export default DoctorsView

