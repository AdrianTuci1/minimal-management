import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const defaultSchedule = [
  { day: "Luni", start: "08:00", end: "18:00", closed: false },
  { day: "Marti", start: "08:00", end: "18:00", closed: false },
  { day: "Miercuri", start: "08:00", end: "18:00", closed: false },
  { day: "Joi", start: "08:00", end: "18:00", closed: false },
  { day: "Vineri", start: "08:00", end: "16:00", closed: false },
  { day: "Sambata", start: "09:00", end: "13:00", closed: false },
  { day: "Duminica", start: "", end: "", closed: true },
]

const languageOptions = [
  { value: "ro", label: "Romana" },
  { value: "en", label: "Engleza" },
  { value: "de", label: "Germana" },
]

const SettingsView = () => {
  const [schedule, setSchedule] = useState(defaultSchedule)
  const [description, setDescription] = useState(
    "Clinica functioneaza cu program extins pentru a acoperi solicitarile zilnice ale pacientilor.",
  )
  const [language, setLanguage] = useState(languageOptions[0]?.value ?? "ro")

  const updateSchedule = (index, field, value) => {
    setSchedule((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const toggleClosed = (index) => {
    setSchedule((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item
        }

        if (item.closed) {
          return {
            ...item,
            closed: false,
            start: item.start || "08:00",
            end: item.end || "17:00",
          }
        }

        return {
          ...item,
          closed: true,
          start: "",
          end: "",
        }
      }),
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="bg-white/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Program de functionare</CardTitle>
          <CardDescription>Stabileste intervalele orare pentru fiecare zi din saptamana.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {schedule.map((item, index) => (
              <div
                key={item.day}
                className="grid gap-3 rounded-lg border border-border/60 bg-white/95 p-4 shadow-sm transition hover:border-border/80 md:grid-cols-[140px,repeat(2,minmax(0,1fr)),auto]"
              >
                <div className="flex flex-col justify-center gap-1">
                  <span className="text-sm font-semibold text-foreground">{item.day}</span>
                  <span className="text-xs text-muted-foreground">{item.closed ? "Inchis" : "Deschis"}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Start</span>
                  <Input
                    type="time"
                    value={item.start}
                    onChange={(event) => updateSchedule(index, "start", event.target.value)}
                    disabled={item.closed}
                  />
                </div>
                <div className="grid gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Final</span>
                  <Input
                    type="time"
                    value={item.end}
                    onChange={(event) => updateSchedule(index, "end", event.target.value)}
                    disabled={item.closed}
                  />
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant={item.closed ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-md"
                    onClick={() => toggleClosed(index)}
                  >
                    {item.closed ? "Deschide" : "Inchide"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="button">Salveaza programul</Button>
        </CardFooter>
      </Card>

      <Card className="bg-white/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Descriere si limba</CardTitle>
          <CardDescription>Gestioneaza mesajele vizibile pacientilor si limba implicita a platformei.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="clinic-description" className="text-sm font-medium text-foreground">
                Descrierea clinicii
              </label>
              <textarea
                id="clinic-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-[140px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Adauga un mesaj pentru pacienti si echipa."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr,minmax(0,220px)] sm:items-center">
              <div className="grid gap-1">
                <span className="text-sm font-medium text-foreground">Limba implicita</span>
                <span className="text-xs text-muted-foreground">
                  Selecteaza limba in care afisam meniurile si mesajele principale.
                </span>
              </div>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white text-foreground">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="button" variant="outline" className="border-border/70">
            Salveaza preferintele
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SettingsView

