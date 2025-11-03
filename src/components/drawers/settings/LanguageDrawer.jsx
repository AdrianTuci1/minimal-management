import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { Save } from "lucide-react"
import useAppStore from "@/store/appStore"

const LanguageDrawer = () => {
  const { isDrawerOpen, drawerViewId, closeDrawer } = useAppStore()

  const handleSave = () => {
    // TODO: Implement save logic
    closeDrawer()
  }

  return (
    <Drawer
      open={isDrawerOpen && drawerViewId === "settings-language"}
      onOpenChange={closeDrawer}
      title="Limba"
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
          label="Limba implicită"
          type="text"
          editable={true}
          value="Română"
          onChange={() => {}}
        />
        <DrawerField
          label="Format dată"
          type="text"
          editable={true}
          value="DD/MM/YYYY"
          onChange={() => {}}
        />
        <DrawerField
          label="Format oră"
          type="text"
          editable={true}
          value="24 ore"
          onChange={() => {}}
        />
        <DrawerField
          label="Fus orar"
          type="text"
          editable={true}
          value="Europe/Bucharest"
          onChange={() => {}}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default LanguageDrawer

