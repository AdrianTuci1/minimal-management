import { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getTableColumns } from "@/config/tableColumns"
import { getDrawerInputs } from "@/config/drawerInputs.jsx"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import EntityDrawer from "../drawers/EntityDrawer"

// Base class for entity views with common functionality
export const EntityView = ({ 
  entityType, // 'clients', 'staff', 'services', 'appointments'
  demoDataFunction,
  customTabs = [],
  customActions = [],
  customRenderers = {}
}) => {
  const { workspaceType, getLabel } = useWorkspaceConfig()
  const columns = getTableColumns(entityType, workspaceType)
  const drawerFields = getDrawerInputs(entityType, workspaceType)
  const { isDrawerOpen, drawerData, drawerViewId, drawerMode, openDrawer, closeDrawer } = useAppStore()
  
  const [formData, setFormData] = useState({})
  const [data, setData] = useState(() => demoDataFunction ? demoDataFunction(workspaceType) : [])

  const isCreateMode = drawerMode === "create"
  const displayData = isCreateMode ? formData : drawerData

  useEffect(() => {
    if (demoDataFunction) {
      setData(demoDataFunction(workspaceType))
    }
  }, [workspaceType, demoDataFunction])

  useEffect(() => {
    if (isCreateMode && isDrawerOpen) {
      setFormData({})
    }
  }, [isCreateMode, isDrawerOpen])

  const handleRowClick = (item) => {
    openDrawer(entityType, item, "edit")
  }

  const handleFieldChange = (fieldId, value) => {
    if (isCreateMode) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }))
    } else {
      // In edit mode, update the item directly
      if (!drawerData || !drawerData.id && !drawerData.email) return
      
      const identifier = drawerData.id || drawerData.email
      const identifierField = drawerData.id ? 'id' : 'email'
      
      setData((current) =>
        current.map((item) =>
          item[identifierField] === identifier
            ? { ...item, [fieldId]: value }
            : item
        )
      )
      
      // Update drawer data
      const updatedItem = data.find((item) => item[identifierField] === identifier)
      if (updatedItem) {
        openDrawer(entityType, { ...updatedItem, [fieldId]: value }, "edit")
      }
    }
  }

  const handleSave = () => {
    if (isCreateMode) {
      // Create a new item with default values
      const newItem = {
        ...formData,
        // Add default values based on entity type
        ...(entityType === 'clients' && {
          email: formData.email || `client-${Date.now()}@example.com`,
          dePlata: "0 RON",
        }),
        ...(entityType === 'staff' && {
          id: `staff-${Date.now()}`,
          status: "disponibil",
        }),
        ...(entityType === 'services' && {
          id: `service-${Date.now()}`,
          status: "activ",
        }),
        ...(entityType === 'appointments' && {
          id: `appointment-${Date.now()}`,
          status: "programat",
        }),
      }
      
      setData((current) => [...current, newItem])
      closeDrawer()
      setFormData({})
    } else {
      closeDrawer()
    }
  }

  const handleDelete = () => {
    if (!drawerData || (!drawerData.id && !drawerData.email)) return
    
    const identifier = drawerData.id || drawerData.email
    const identifierField = drawerData.id ? 'id' : 'email'
    const entityLabel = getLabel(entityType.slice(0, -1)) // Remove 's' for singular
    
    if (window.confirm(`Sigur doriți să ștergeți acest ${entityLabel.toLowerCase()}?`)) {
      setData((current) => current.filter((item) => item[identifierField] !== identifier))
      closeDrawer()
    }
  }

  // Get the first column ID (name column)
  const nameColumnId = columns[0]?.id || "name"
  // Get the clients/patients column ID
  const clientsColumnId = columns.find(col => 
    col.id === "pacienti" || col.id === "clienti" || col.id === "clients"
  )?.id || "clients"

  // Custom renderers for specific columns
  const renderCellContent = (column, item) => {
    // Check if there's a custom renderer for this column
    if (customRenderers[column.id]) {
      return customRenderers[column.id](item)
    }

    // Default renderers
    if (column.id === nameColumnId || column.id === "pacient" || column.id === "client") {
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm font-semibold" style={{ 
              backgroundColor: item.color ? `${item.color}1a` : undefined, 
              color: item.color || undefined 
            }}>
              {item.name
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{item.name}</span>
            {item.phone && <span className="text-xs text-muted-foreground">{item.phone}</span>}
            {item.id && <span className="text-xs text-muted-foreground">{item.id.replace(/^(dr|staff)-/, "#").toUpperCase()}</span>}
          </div>
        </div>
      )
    }

    if (column.id === "dePlata") {
      return (
        <span className={item.dePlata === "0 RON" ? "text-muted-foreground" : "font-medium text-foreground"}>
          {item.dePlata}
        </span>
      )
    }

    if (column.id === "status" && item.status) {
      const statusVariants = {
        disponibil: "bg-emerald-100 text-emerald-700",
        "în consultație": "bg-amber-100 text-amber-700",
        ocupat: "bg-rose-100 text-rose-700",
        activ: "bg-emerald-100 text-emerald-700",
        inactiv: "bg-rose-100 text-rose-700",
        programat: "bg-blue-100 text-blue-700",
        finalizat: "bg-gray-100 text-gray-700",
      }

      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${
            statusVariants[item.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {item.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />}
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      )
    }

    if (column.id === clientsColumnId) {
      return <span className="text-sm font-semibold text-foreground">{column.accessor(item)}</span>
    }

    // Default renderer
    return column.render ? column.render(item) : column.accessor(item)
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
                    className={index < columns.length - 1 ? "border-r border-border/70" : ""}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id || item.email}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                    >
                      {renderCellContent(column, item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EntityDrawer
        entityType={entityType}
        isOpen={isDrawerOpen && drawerViewId === entityType}
        onClose={closeDrawer}
        title={isCreateMode ? `${getLabel("add" + entityType.slice(0, -1).charAt(0).toUpperCase() + entityType.slice(0, -1).slice(1))}` : `Detalii ${getLabel(entityType.slice(0, -1)).toLowerCase()}`}
        isCreateMode={isCreateMode}
        data={displayData}
        fields={drawerFields}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
        onDelete={handleDelete}
        tabs={customTabs}
        actions={customActions}
      />
    </>
  )
}

export default EntityView
