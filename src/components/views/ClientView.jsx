import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import useWorkspaceStore from "../../store/workspaceStore"
import { getWorkspaceConfig } from "../../config/workspaceConfig"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { MapPin, Clock, Users } from "lucide-react"
import { Separator } from "../ui/separator"

// Mock collaborators/employees data
const getWorkspaceEmployees = (workspaceId) => {
  const mockEmployees = [
    { id: "emp-1", name: "Ana Popescu", initials: "AP", color: "#6366F1" },
    { id: "emp-2", name: "Mihai Ionescu", initials: "MI", color: "#0EA5E9" },
    { id: "emp-3", name: "Elena Stan", initials: "ES", color: "#22C55E" },
    { id: "emp-4", name: "Andrei Dima", initials: "AD", color: "#F97316" },
  ]
  // Return first 3 employees as example
  return mockEmployees.slice(0, 3)
}

function ClientView() {
  const { workspaceId } = useParams()
  const { workspaces } = useWorkspaceStore()
  
  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  const workspaceConfig = useMemo(() => {
    if (!workspace) return null
    return getWorkspaceConfig(workspace.type)
  }, [workspace])

  const employees = useMemo(() => {
    if (!workspace) return []
    return getWorkspaceEmployees(workspace.id)
  }, [workspace])

  if (!workspace || !workspaceConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Workspace-ul nu a fost găsit</h1>
          <p className="text-muted-foreground">Workspace-ul cu ID-ul {workspaceId} nu există.</p>
        </div>
      </div>
    )
  }

  // Normalize workspace type using config
  const normalizedWorkspaceType = workspaceConfig?.id || workspace.type

  // Textul primului buton în funcție de tipul workspace
  const getButtonText = () => {
    switch (normalizedWorkspaceType) {
      case "clinic":
        return "Solicită o programare"
      case "fitness":
        return "Devin-o client"
      case "hotel":
        return "Rezervă"
      default:
        return "Solicită o programare"
    }
  }

  // URL-ul pentru primul buton în funcție de tipul workspace
  const getFirstButtonUrl = () => {
    switch (normalizedWorkspaceType) {
      case "clinic":
        return `/workspace/${workspaceId}/public/request-appointment`
      case "fitness":
        return `/workspace/${workspaceId}/public/become-client`
      case "hotel":
        return `/workspace/${workspaceId}/public/book-reservation`
      default:
        return `/workspace/${workspaceId}/public/request-appointment`
    }
  }

  // Textul celui de-al doilea buton în funcție de tipul workspace
  const getSecondButtonText = () => {
    switch (normalizedWorkspaceType) {
      case "clinic":
        return "Vezi serviciile"
      case "fitness":
        return "Vezi abonamente"
      case "hotel":
        return "Vezi serviciile"
      default:
        return "Vezi serviciile"
    }
  }

  // Date mock pentru adresă și program (în viitor vor fi din store)
  const address = workspace.address || "Strada Exemplu nr. 123, București"
  const email = workspace.email || "contact@example.com"
  const phone = workspace.phone || "+40 123 456 789"
  const description = workspace.description || `Bun venit la ${workspace.name}! Suntem dedicați să oferim servicii de cea mai înaltă calitate pentru clienții noștri. Echipa noastră de profesioniști cu experiență este pregătită să vă ajute și să vă ofere soluții personalizate care îndeplinesc toate nevoile și așteptările dumneavoastră. Ne străduim constant să îmbunătățim experiența clienților noștri prin inovație și atenție la detalii.`
  
  // Program de funcționare - 24/7 pentru hotel
  const getSchedule = () => {
    if (workspace.type === "hotel") {
      return "24/7"
    }
    return workspace.schedule || {
      weekdays: "Luni - Vineri: 09:00 - 18:00",
      saturday: "Sâmbătă: 09:00 - 14:00",
      sunday: "Duminică: Închis"
    }
  }
  const schedule = getSchedule()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-card rounded-lg border border-border overflow-hidden">
        <div className="block md:table w-full">
          <div className="block md:table-row-group">
            <div className="block md:table-row">
              {/* Prima coloană: Informații business */}
              <div className="block md:table-cell md:w-[60%] p-6 align-top border-b md:border-b-0 md:border-r border-border">
                <div className="space-y-4">
                  {/* Header: Logo, nume și adresa */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-4">
                      {workspace.logo ? (
                        <img
                          src={workspace.logo}
                          alt={`${workspace.name} logo`}
                          className="w-16 h-16 object-contain shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xl font-bold text-muted-foreground">
                            {workspace.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
                        {/* Adresa sub nume */}
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground">{address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <Separator />

                  {/* Icon-uri angajați, email și telefon */}
                  {employees.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex -space-x-2">
                        {employees.map((emp, idx) => (
                          <Avatar
                            key={emp.id}
                            className="h-8 w-8 border-2 border-background"
                            style={{ zIndex: employees.length - idx }}
                          >
                            <AvatarFallback 
                              className="text-xs font-medium text-white"
                              style={{ backgroundColor: emp.color }}
                            >
                              {emp.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-foreground ml-2">
                        {email}
                      </span>
                      <div className="flex items-center gap-1.5 ml-2">
                        <img 
                          src="/ro_flag.webp" 
                          alt="România" 
                          className="w-4 h-3 object-contain"
                        />
                        <span className="text-sm text-foreground">
                          {phone}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Separator */}
                  <Separator />

                  {/* Scurtă descriere "Cine suntem" */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">Cine suntem</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>

                  {/* Separator */}
                  <Separator />

                  {/* Program de funcționare */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="text-sm text-foreground">
                        {typeof schedule === 'string' ? (
                          <p>{schedule}</p>
                        ) : (
                          <div className="space-y-0.5">
                            <p>{schedule.weekdays}</p>
                            <p>{schedule.saturday}</p>
                            <p>{schedule.sunday}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* A 2-a coloană: Calendar și buton */}
              <div className="block md:table-cell p-6 align-top">
                <div className="flex flex-col space-y-4">
                  {/* Calendar - ocupă întreaga lățime */}
                  <div className="w-full">
                    <Calendar
                      mode="single"
                      className="rounded-md border w-full"
                    />
                  </div>
                  
                  {/* Butoane: primul și al doilea buton */}
                  <div className="flex gap-2">
                    <Link to={getFirstButtonUrl()} className="flex-1">
                      <Button className="w-full" size="lg">
                        {getButtonText()}
                      </Button>
                    </Link>
                    <Link to={`/workspace/${workspaceId}/public/services`}>
                      <Button variant="outline" size="lg">
                        {getSecondButtonText()}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientView

