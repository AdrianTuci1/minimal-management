import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { Save } from "lucide-react"
import useAppStore from "@/store/appStore"

const SmartBillDrawer = () => {
  const { isDrawerOpen, drawerViewId, closeDrawer } = useAppStore()

  const handleSave = () => {
    // TODO: Implement save logic
    closeDrawer()
  }

  return (
    <Drawer
      open={isDrawerOpen && drawerViewId === "settings-smartbill"}
      onOpenChange={closeDrawer}
      title="Smart Bill"
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
          label="CUI"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Username Smart Bill"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Token Smart Bill"
          type="password"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Serie factură"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Serie chitanță"
          type="text"
          editable={true}
          value=""
          onChange={() => {}}
        />
        <DrawerField
          label="Mod de lucru"
          type="text"
          editable={true}
          value="Test"
          onChange={() => {}}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default SmartBillDrawer

