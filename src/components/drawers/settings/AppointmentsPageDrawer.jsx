import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { Save } from "lucide-react"
import useAppStore from "@/store/appStore"

const AppointmentsPageDrawer = () => {
  const { isDrawerOpen, drawerViewId, closeDrawer } = useAppStore()

  const handleSave = () => {
    // TODO: Implement save logic
    closeDrawer()
  }

  return (
    <Drawer
      open={isDrawerOpen && drawerViewId === "settings-appointments-page"}
      onOpenChange={closeDrawer}
      title="Pagina de programări"
      actions={[
        {
          id: "save",
          label: "Salvează",
          icon: Save,
          variant: "default",
          onClick: handleSave,
        },
      ]}
    >
      <DrawerContent>
        <DrawerField
          label="URL pagină publică"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Titlu pagină"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Descriere"
          type="textarea"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Permite programări online"
          type="text"
          editable={true}
          value="Da"
          onChange={() => {}}
        />
        <DrawerField
          label="Interval minim între programări"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Zile în avans pentru programare"
          type="number"
          editable={true}
          value=""
          onChange={() => {}}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default AppointmentsPageDrawer

