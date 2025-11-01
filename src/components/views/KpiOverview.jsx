import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const kpis = [
  {
    title: "Grad de ocupare",
    value: "86%",
    delta: "+4.2%",
    trend: "față de săptămâna trecută",
  },
  {
    title: "Timp mediu în cabinet",
    value: "42 min",
    delta: "-6 min",
    trend: "optimizat prin whiteboard",
  },
  {
    title: "Valoare medie tratament",
    value: "€245",
    delta: "+12%",
    trend: "creștere față de Q1",
  },
  {
    title: "Satisfacție pacienți",
    value: "4.8 / 5",
    delta: "+0.3",
    trend: "bazat pe 96 de recenzii",
  },
]

const waitingList = [
  { name: "Darius Munteanu", need: "Consult ortodonție", urgency: "În 48h" },
  { name: "Ana Varga", need: "Implant finalizare", urgency: "În 3 zile" },
  { name: "Cezar Damian", need: "Fațete ceramice", urgency: "Flexibil" },
]

const KpiOverview = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
      <Tabs defaultValue="saptamana" className="w-full">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Pulse real-time pentru clinica ta
            </h1>
            <p className="text-sm text-muted-foreground">
              Vizualizează performanța echipei și capacitatea de programare.
            </p>
          </div>
          <TabsList className="grid h-10 w-full grid-cols-2 gap-2 rounded-md border border-border/80 bg-muted/60 p-1 md:w-auto md:grid-cols-3">
            <TabsTrigger value="azi" className="rounded-sm text-xs">
              Azi
            </TabsTrigger>
            <TabsTrigger value="saptamana" className="rounded-sm text-xs">
              Săptămâna aceasta
            </TabsTrigger>
            <TabsTrigger value="luna" className="rounded-sm text-xs">
              Luna curentă
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="saptamana" className="mt-4 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => (
              <Card key={item.title} className="rounded-lg border-border/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    <Badge variant="secondary" className="mr-2 text-[10px]">
                      {item.delta}
                    </Badge>
                    {item.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="grid gap-6 rounded-lg border-border/70 p-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  Rezumat echipă
                </h2>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  Sincronizat acum 2 min
                </Badge>
              </div>
              <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                <div className="rounded-md border border-dashed border-border/60 p-4">
                  <p className="text-xs uppercase text-muted-foreground/70">Rezervări noi</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">32</p>
                  <p className="text-xs">54% vin din recomandări directe.</p>
                </div>
                <div className="rounded-md border border-dashed border-border/60 p-4">
                  <p className="text-xs uppercase text-muted-foreground/70">Proceduri complexe</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">12</p>
                  <p className="text-xs">Programate pe următoarele 10 zile.</p>
                </div>
                <div className="rounded-md border border-dashed border-border/60 p-4">
                  <p className="text-xs uppercase text-muted-foreground/70">Rata de anulare</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">3.1%</p>
                  <p className="text-xs">Scădere de 1.4% față de media lunară.</p>
                </div>
                <div className="rounded-md border border-dashed border-border/60 p-4">
                  <p className="text-xs uppercase text-muted-foreground/70">Timp confirmare</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">12 min</p>
                  <p className="text-xs">Recepția răspunde prompt noilor solicitări.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-md border border-border/60 bg-muted/40 p-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Listă de așteptare</h3>
                <p className="text-xs text-muted-foreground">
                  Pacienți pregătiți pentru reprogramare rapidă.
                </p>
              </div>
              <Separator className="bg-border/60" />
              <ul className="space-y-3 text-sm">
                {waitingList.map((item) => (
                  <li key={item.name} className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.need}</span>
                    <span className="text-xs font-semibold text-primary">{item.urgency}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="azi" className="mt-4 text-sm text-muted-foreground">
          Datele live sunt sincronizate cu whiteboard-ul și raportate la finalul zilei.
        </TabsContent>
        <TabsContent value="luna" className="mt-4 text-sm text-muted-foreground">
          În această vizualizare vei integra rapoarte financiare și indicatori de retenție.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default KpiOverview

