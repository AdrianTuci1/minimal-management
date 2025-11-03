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

const SettingsView = () => {
  const { openDrawer } = useAppStore()

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card 
          className="bg-white/90 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDrawer("settings-program", null, "edit")}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <img src="/info.png" alt="Program si informatii clinica" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle>Program si informatii clinica</CardTitle>
              <CardDescription>
                Gestioneaza programul de functionare si descrierea clinicii.
              </CardDescription>
            </div>
          </div>
        </Card>

        <Card 
          className="bg-white/90 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDrawer("settings-language", null, "edit")}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <img src="/ro_flag.webp" alt="Limba" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle>Limba</CardTitle>
              <CardDescription>
                Selecteaza limba implicita a platformei.
              </CardDescription>
            </div>
          </div>
        </Card>

        <Card 
          className="bg-white/90 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDrawer("settings-api-keys", null, "edit")}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <img src="/api.png" alt="Chei API" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle>Chei API</CardTitle>
              <CardDescription>
                Gestioneaza cheile API pentru integrarea cu servicii externe.
              </CardDescription>
            </div>
          </div>
        </Card>

        <Card 
          className="bg-white/90 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDrawer("settings-smartbill", null, "edit")}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <img src="/sb-logo.png" alt="Smart Bill" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle>Smart Bill</CardTitle>
              <CardDescription>
                Configureaza integrarea cu serviciul Smart Bill pentru facturare electronica.
              </CardDescription>
            </div>
          </div>
        </Card>

        <Card 
          className="bg-white/90 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDrawer("settings-appointments-page", null, "edit")}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <img src="/appointment.png" alt="Pagina de programari" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle>Pagina de programari</CardTitle>
              <CardDescription>
                Configureaza setarile pentru pagina de programari.
              </CardDescription>
            </div>
          </div>
        </Card>
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

