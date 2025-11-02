import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SettingsView = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="bg-white/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Program si informatii clinica</CardTitle>
          <CardDescription>
            Gestioneaza programul de functionare si descrierea clinicii.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-white/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Limba</CardTitle>
          <CardDescription>
            Selecteaza limba implicita a platformei.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-white/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Chei API</CardTitle>
          <CardDescription>
            Gestioneaza cheile API pentru integrarea cu servicii externe.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default SettingsView

