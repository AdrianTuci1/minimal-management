import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const WORKSPACE_TYPES = [
  { id: "clinica-dentara", label: "Clinica Dentară", icon: "🦷" },
  { id: "hotel", label: "Hotel", icon: "🏨" },
  { id: "sala-fitness", label: "Sală Fitness", icon: "💪" },
  { id: "salon", label: "Salon", icon: "✂️" },
  { id: "reparatii", label: "Reparații", icon: "🔧" },
]

// Helper function to create a deterministic hash from string
const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Mock collaborators data
const MOCK_COLLABORATORS = [
  { id: "col-1", name: "Ana Popescu", initials: "AP", color: "#6366F1" },
  { id: "col-2", name: "Mihai Ionescu", initials: "MI", color: "#0EA5E9" },
  { id: "col-3", name: "Elena Stan", initials: "ES", color: "#22C55E" },
  { id: "col-4", name: "Andrei Dima", initials: "AD", color: "#F97316" },
  { id: "col-5", name: "Maria Georgescu", initials: "MG", color: "#A855F7" },
]

// Helper function to get collaborators for a workspace
const getWorkspaceCollaborators = (workspaceId) => {
  const hash = hashString(workspaceId)
  const count = (hash % 4) + 1 // 1-4 collaborators
  return MOCK_COLLABORATORS.slice(0, count)
}

// Helper function to get business-relevant stats for workspace
const getWorkspaceStats = (workspace) => {
  const hash = hashString(workspace.id)
  const hash2 = hashString(workspace.id + "stats")
  
  switch (workspace.type) {
    case "clinica-dentara":
      return {
        label: "Pacienți",
        value: 15 + (hash % 50),
        secondary: `${3 + (hash2 % 5)} medici`,
        icon: "👥",
      }
    case "hotel":
      return {
        label: "Camere",
        value: 20 + (hash % 80),
        secondary: `${hash2 % 30}% ocupare`,
        icon: "🛏️",
      }
    case "sala-fitness":
      return {
        label: "Membri",
        value: 50 + (hash % 200),
        secondary: `${3 + (hash2 % 5)} antrenori`,
        icon: "💪",
      }
    case "salon":
      return {
        label: "Clienți",
        value: 30 + (hash % 100),
        secondary: `${2 + (hash2 % 4)} angajați`,
        icon: "✂️",
      }
    case "reparatii":
      return {
        label: "Clienți",
        value: 25 + (hash % 75),
        secondary: `${hash2 % 40} programări`,
        icon: "🔧",
      }
    default:
      return {
        label: "Clienți",
        value: 10 + (hash % 50),
        secondary: "Activități",
        icon: "📊",
      }
  }
}

const WorkspaceCard = ({ workspace, onSelect }) => {
  const workspaceType = WORKSPACE_TYPES.find((t) => t.id === workspace.type)
  const stats = getWorkspaceStats(workspace)
  const collaborators = getWorkspaceCollaborators(workspace.id)
  const displayCollaborators = collaborators.slice(0, 4)
  const remainingCount = collaborators.length > 4 ? collaborators.length - 4 : 0
  const [logoError, setLogoError] = useState(false)
  
  // Generate a simple preview thumbnail (mock)
  const previewColors = [
    "bg-gradient-to-br from-blue-400 to-purple-500",
    "bg-gradient-to-br from-green-400 to-teal-500",
    "bg-gradient-to-br from-orange-400 to-pink-500",
    "bg-gradient-to-br from-indigo-400 to-blue-500",
  ]
  const previewIndex = workspace.id.charCodeAt(workspace.id.length - 1) % previewColors.length
  
  const showLogo = workspace.logo && !logoError
  const showIcon = !workspace.logo || logoError
  
  const handleCardClick = () => {
    onSelect?.(workspace.id)
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 group overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Preview Thumbnail */}
      <div className="relative h-32 bg-muted/50 overflow-hidden">
        <div className={`absolute inset-0 ${previewColors[previewIndex]} opacity-20 pointer-events-none`} />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        {/* Logo and Icon */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none">
          {showLogo && (
            <div className="relative">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-border/50">
                <img
                  src={workspace.logo}
                  alt={workspace.name}
                  className="h-16 w-16 object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            </div>
          )}
          {showIcon && (
            <div className="text-6xl opacity-30">
              {workspaceType?.icon || "📊"}
            </div>
          )}
        </div>
        {workspace.starred && (
          <div className="absolute top-2 right-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold mb-1 truncate">{workspace.name}</CardTitle>
            <CardDescription className="text-xs flex items-center gap-1 mt-1">
              <span>{stats.icon}</span>
              <span className="font-medium text-foreground">{stats.value}</span>
              <span className="text-muted-foreground">{stats.label.toLowerCase()}</span>
            </CardDescription>
            {stats.secondary && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {stats.secondary}
              </div>
            )}
          </div>
        </div>

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex -space-x-2">
              {displayCollaborators.map((collab, idx) => (
                <Avatar
                  key={collab.id}
                  className="h-5 w-5 border-2 border-background"
                  style={{ zIndex: displayCollaborators.length - idx }}
                >
                  <AvatarFallback 
                    className="text-[10px] font-medium text-white"
                    style={{ backgroundColor: collab.color }}
                  >
                    {collab.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingCount > 0 && (
                <Avatar className="h-5 w-5 border-2 border-background bg-muted">
                  <AvatarFallback className="text-[10px] font-medium text-muted-foreground">
                    +{remainingCount}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WorkspaceCard

