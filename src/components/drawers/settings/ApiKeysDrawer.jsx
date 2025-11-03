import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { Save } from "lucide-react"
import useAppStore from "@/store/appStore"

const ApiKeysDrawer = () => {
  const { isDrawerOpen, drawerViewId, closeDrawer } = useAppStore()

  const handleSave = () => {
    // TODO: Implement save logic
    closeDrawer()
  }

  return (
    <Drawer
      open={isDrawerOpen && drawerViewId === "settings-api-keys"}
      onOpenChange={closeDrawer}
      title="Chei API"
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
          label="API Key pentru notificări SMS"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="API Key pentru email"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="API Key pentru calendar"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="API Secret"
          type="password"
          editable={true}
          value=""
          onChange={() => {}}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default ApiKeysDrawer

