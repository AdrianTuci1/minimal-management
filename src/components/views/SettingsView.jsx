import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import useAppStore from "@/store/appStore"
import {
  ProgramDrawer,
  LanguageDrawer,
  ApiKeysDrawer,
  SmartBillDrawer,
  AppointmentsPageDrawer,
} from "@/components/drawers/settings"
import { useMemo } from "react"
import { SettingsController } from "../../models/SettingsController"

const SettingsView = () => {
  const { openDrawer } = useAppStore()

  // Initialize controller
  const controller = useMemo(() => {
    return new SettingsController(openDrawer);
  }, [openDrawer]);

  // Get settings options from controller
  const settingsOptions = controller?.settingsOptions || []

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {settingsOptions.map((option) => (
          <Card 
            key={option.id}
            className="bg-white/90 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => controller.handleSettingsClick(option.drawerId)}
          >
            <div className="flex items-start gap-4 p-6">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <img src={option.icon} alt={option.title} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>
                  {option.description}
                </CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ProgramDrawer />
      <LanguageDrawer />
      <ApiKeysDrawer />
      <SmartBillDrawer />
      <AppointmentsPageDrawer />
    </>
  )
}

export default SettingsView

