import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { User, Calendar, FileText, Save, Trash2 } from "lucide-react"

// Base drawer component for entities with common functionality
export const EntityDrawer = ({
  entityType, // 'clients', 'staff', 'services', 'appointments'
  isOpen,
  onClose,
  title,
  isCreateMode,
  data,
  fields,
  onFieldChange,
  onSave,
  onDelete,
  tabs = [],
  actions = [],
  defaultTab = "details"
}) => {
  // Default tabs for all entity types
  const defaultTabs = [
    {
      id: "details",
      icon: User,
      content: (
        <DrawerContent>
          <>
            {data && (
              <div className="mb-6 flex items-center gap-4 pb-6 border-b border-border">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg" style={{ 
                    backgroundColor: data.color ? `${data.color}1a` : undefined, 
                    color: data.color || undefined 
                  }}>
                    {data.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "N/A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{data.name || `${entityType.slice(0, -1)} nou`}</h3>
                  {(data.email || data.specialty || data.id) && (
                    <p className="text-sm text-muted-foreground">
                      {data.email || data.specialty || data.id}
                    </p>
                  )}
                </div>
              </div>
            )}
            {fields.map((field) => {
              const value = field.accessor(data || {})
              const isEditable = field.editable

              return (
                <DrawerField
                  key={field.id}
                  label={field.label}
                  type={field.type}
                  editable={isEditable}
                  value={value}
                  onChange={(newValue) => onFieldChange(field.id, newValue)}
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

  // Add entity-specific tabs
  if (entityType === 'clients') {
    defaultTabs.push(
      {
        id: "appointments",
        icon: Calendar,
        content: (
          <DrawerContent>
            <div className="text-sm text-muted-foreground">Istoric programări</div>
          </DrawerContent>
        ),
      },
      {
        id: "treatments",
        icon: FileText,
        content: (
          <DrawerContent>
            <div className="text-sm text-muted-foreground">Plan tratament</div>
          </DrawerContent>
        ),
      }
    )
  }

  // Merge with custom tabs
  const drawerTabs = isCreateMode ? undefined : [...defaultTabs, ...tabs]

  // Default actions for all entity types
  const defaultActions = isCreateMode
    ? [
        {
          id: "save",
          label: "Salvează",
          icon: Save,
          variant: "default",
          onClick: onSave,
        },
      ]
    : [
        {
          id: "save",
          label: "Salvează",
          icon: Save,
          variant: "default",
          onClick: onSave,
        },
        {
          id: "delete",
          label: "Șterge",
          icon: Trash2,
          variant: "destructive",
          onClick: onDelete,
        },
      ]

  // Merge with custom actions
  const drawerActions = [...defaultActions, ...actions]

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      title={title}
      tabs={drawerTabs}
      defaultTab={defaultTab}
      actions={drawerActions}
    >
      {isCreateMode && (
        <DrawerContent>
          <>
            {fields.map((field) => {
              const value = field.accessor(data || {})
              const isEditable = true

              return (
                <DrawerField
                  key={field.id}
                  label={field.label}
                  type={field.type}
                  editable={isEditable}
                  value={value}
                  onChange={(newValue) => onFieldChange(field.id, newValue)}
                />
              )
            })}
          </>
        </DrawerContent>
      )}
    </Drawer>
  )
}

export default EntityDrawer
