import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { Save } from "lucide-react"
import useAppStore from "@/store/appStore"

const ProgramDrawer = () => {
  const { isDrawerOpen, drawerViewId, closeDrawer } = useAppStore()

  const handleSave = () => {
    // TODO: Implement save logic
    closeDrawer()
  }

  return (
    <Drawer
      open={isDrawerOpen && drawerViewId === "settings-program"}
      onOpenChange={closeDrawer}
      title="Program și informații clinică"
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
          label="Nume clinică"
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
          label="Adresă"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Telefon"
          type="tel"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Email"
          type="email"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Program Luni - Vineri"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Program Sâmbătă"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Program Duminică"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default ProgramDrawer

