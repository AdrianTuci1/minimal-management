import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { getTableColumns } from "@/config/tableColumns"
import { getDrawerInputs } from "@/config/drawerInputs.jsx"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { getDemoTreatments } from "@/config/demoData"
import { cn } from "@/lib/utils"
import { FileText, Save, Trash2 } from "lucide-react"

const statusTone = {
  Disponibil: "bg-emerald-500/10 text-emerald-600",
  "Necesită aprobare": "bg-amber-500/10 text-amber-600",
  Promovat: "bg-blue-500/10 text-blue-600",
}

const TreatmentsView = () => {
  const { workspaceType, getLabel } = useWorkspaceConfig()
  const columns = getTableColumns("tratamente", workspaceType)
  const drawerFields = getDrawerInputs("tratamente", workspaceType)
  const { isDrawerOpen, drawerData, drawerViewId, drawerMode, openDrawer, closeDrawer } = useAppStore()
  
  const [formData, setFormData] = useState({})
  const [treatments, setTreatments] = useState(() => getDemoTreatments(workspaceType))

  const isCreateMode = drawerMode === "create"
  const displayData = isCreateMode ? formData : drawerData

  useEffect(() => {
    setTreatments(getDemoTreatments(workspaceType))
  }, [workspaceType])

  useEffect(() => {
    if (isCreateMode && isDrawerOpen) {
      setFormData({})
    }
  }, [isCreateMode, isDrawerOpen])

  const handleRowClick = (treatment) => {
    openDrawer("tratamente", treatment, "edit")
  }

  const handleFieldChange = (fieldId, value) => {
    if (isCreateMode) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }))
    } else {
      // In edit mode, update the treatment directly
      if (!drawerData || !drawerData.code) return
      setTreatments((current) =>
        current.map((treatment) =>
          treatment.code === drawerData.code
            ? { ...treatment, [fieldId]: value }
            : treatment
        )
      )
      // Update drawer data
      const updatedTreatment = treatments.find((t) => t.code === drawerData.code)
      if (updatedTreatment) {
        openDrawer("tratamente", { ...updatedTreatment, [fieldId]: value }, "edit")
      }
    }
  }

  const handleSaveTreatment = () => {
    if (isCreateMode) {
      const newTreatment = {
        code: formData.code || `SRV-${Date.now()}`,
        name: formData.name || "",
        duration: formData.duration || "",
        doctor: formData.doctor || "",
        price: formData.price || "",
        status: formData.status || "Disponibil",
      }
      setTreatments((current) => [...current, newTreatment])
      closeDrawer()
      setFormData({})
    } else {
      closeDrawer()
    }
  }

  const handleDeleteTreatment = () => {
    if (!drawerData || !drawerData.code) return
    
    if (window.confirm("Sigur doriți să ștergeți acest tratament?")) {
      setTreatments((current) => current.filter((t) => t.code !== drawerData.code))
      closeDrawer()
    }
  }

  return (
    <>
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
                <TableRow
                  key={item.code}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleRowClick(item)}
                >
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

      <Drawer
        open={isDrawerOpen && drawerViewId === "tratamente"}
        onOpenChange={closeDrawer}
        title={isCreateMode ? `${getLabel("addTreatment")}` : `Detalii ${getLabel("treatment").toLowerCase()}`}
        tabs={
          !isCreateMode
            ? [
                {
                  id: "details",
                  icon: FileText,
                  content: (
                    <DrawerContent>
                      <>
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
                  onClick: handleSaveTreatment,
                },
              ]
            : [
                {
                  id: "save",
                  label: "Salvează",
                  icon: Save,
                  variant: "default",
                  onClick: handleSaveTreatment,
                },
                {
                  id: "delete",
                  label: "Șterge",
                  icon: Trash2,
                  variant: "destructive",
                  onClick: handleDeleteTreatment,
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

export default TreatmentsView

