import { useMemo, useState, useEffect } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { getTableColumns } from "@/config/tableColumns"
import { getDrawerInputs } from "@/config/drawerInputs.jsx"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { User, Save, Trash2 } from "lucide-react"

const statusVariants = {
  disponibil: "bg-emerald-100 text-emerald-700",
  "în consultație": "bg-amber-100 text-amber-700",
  ocupat: "bg-rose-100 text-rose-700",
}

const DoctorsView = ({ doctors = [] }) => {
  const { workspaceType, getLabel, config } = useWorkspaceConfig()
  const columns = getTableColumns("medici", workspaceType)
  const drawerFields = getDrawerInputs("medici", workspaceType)
  const { isDrawerOpen, drawerData, drawerViewId, drawerMode, openDrawer, closeDrawer } = useAppStore()
  
  const [formData, setFormData] = useState({})

  const isCreateMode = drawerMode === "create"
  const displayData = isCreateMode ? formData : drawerData

  // Get the first column ID (doctor/personal name column)
  const nameColumnId = columns[0]?.id || "medic"
  // Get the patients/clients column ID
  const patientsColumnId = columns.find(col => col.id === "pacienti" || col.id === "clienti")?.id || "pacienti"

  useEffect(() => {
    if (isCreateMode && isDrawerOpen) {
      setFormData({})
    }
  }, [isCreateMode, isDrawerOpen])

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

  const handleRowClick = (doctor) => {
    openDrawer("medici", doctor, "edit")
  }

  const handleFieldChange = (fieldId, value) => {
    if (isCreateMode) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }))
    } else {
      // In edit mode, update the doctor directly
      if (!drawerData || !drawerData.id) return
      const updatedRows = rows.map((doctor) =>
        doctor.id === drawerData.id
          ? { ...doctor, [fieldId]: value }
          : doctor
      )
      // Update drawer data
      const updatedDoctor = updatedRows.find((d) => d.id === drawerData.id)
      if (updatedDoctor) {
        openDrawer("medici", { ...updatedDoctor, [fieldId]: value }, "edit")
      }
    }
  }

  const handleSaveDoctor = () => {
    if (isCreateMode) {
      const newDoctor = {
        id: `dr-${Date.now()}`,
        name: formData.name || "",
        specialty: formData.specialty || "",
        color: formData.color || "#6366F1",
        status: "disponibil",
        patientsToday: 0,
        activeTreatments: 0,
        nextSlot: "",
        cabinet: formData.cabinet || "",
      }
      // Note: In a real app, this would update the store/state
      closeDrawer()
      setFormData({})
    } else {
      closeDrawer()
    }
  }

  const handleDeleteDoctor = () => {
    if (!drawerData || !drawerData.id) return
    
    if (window.confirm("Sigur doriți să ștergeți acest medic?")) {
      // Note: In a real app, this would update the store/state
      closeDrawer()
    }
  }

  return (
    <>
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
                <TableRow
                  key={doctor.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleRowClick(doctor)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                    >
                      {column.id === nameColumnId ? (
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
                      ) : column.id === patientsColumnId ? (
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

      <Drawer
        open={isDrawerOpen && drawerViewId === "medici"}
        onOpenChange={closeDrawer}
        title={isCreateMode ? `${getLabel("addDoctor")}` : `Detalii ${getLabel("doctor").toLowerCase()}`}
        tabs={
          !isCreateMode
            ? [
                {
                  id: "details",
                  icon: User,
                  content: (
                    <DrawerContent>
                      <>
                        {drawerData && (
                          <div className="mb-6 flex items-center gap-4 pb-6 border-b border-border">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="text-lg" style={{ backgroundColor: `${drawerData.color}1a`, color: drawerData.color }}>
                                {drawerData.name
                                  ?.split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase() || "N/A"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">{drawerData.name || `${getLabel("doctor")} nou`}</h3>
                              {drawerData.specialty && <p className="text-sm text-muted-foreground">{drawerData.specialty}</p>}
                            </div>
                          </div>
                        )}
                        {drawerFields.map((field) => {
                          const value = field.accessor(displayData || {})
                          const isEditable = field.editable

                          return (
                            <DrawerField
                              key={field.id}
                              label={field.label}
                              type={field.type}
                              editable={isEditable}
                              value={value}
                              onChange={(newValue) => handleFieldChange(field.id, newValue)}
                            >
                              {!isEditable && field.render ? (
                                field.render(value)
                              ) : !isEditable ? (
                                <div className="text-base text-foreground">{value || "-"}</div>
                              ) : null}
                            </DrawerField>
                          )
                        })}
                      </>
                    </DrawerContent>
                  ),
                },
              ]
            : undefined
        }
        defaultTab="details"
        actions={
          isCreateMode
            ? [
                {
                  id: "save",
                  label: "Salvează",
                  icon: Save,
                  variant: "default",
                  onClick: handleSaveDoctor,
                },
              ]
            : [
                {
                  id: "save",
                  label: "Salvează",
                  icon: Save,
                  variant: "default",
                  onClick: handleSaveDoctor,
                },
                {
                  id: "delete",
                  label: "Șterge",
                  icon: Trash2,
                  variant: "destructive",
                  onClick: handleDeleteDoctor,
                },
              ]
        }
      >
        {isCreateMode && (
          <DrawerContent>
            <>
              {drawerFields.map((field) => {
                const value = field.accessor(displayData || {})
                const isEditable = true

                return (
                  <DrawerField
                    key={field.id}
                    label={field.label}
                    type={field.type}
                    editable={isEditable}
                    value={value}
                    onChange={(newValue) => handleFieldChange(field.id, newValue)}
                  />
                )
              })}
            </>
          </DrawerContent>
        )}
      </Drawer>
    </>
  )
}

export default DoctorsView

