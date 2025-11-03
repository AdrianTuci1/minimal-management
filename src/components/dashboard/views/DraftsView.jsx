import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Image, Video, Trash2, Plus } from "lucide-react"

function DraftsView({ drafts, selectedGroup, onCreateDraftClick, onDeleteDraft }) {
  const renderDraftCard = (draft) => {
    const draftTypeIcons = {
      note: FileText,
      image: Image,
      media: Video,
      email: FileText,
    }
    const DraftIcon = draftTypeIcons[draft.type] || FileText

    const draftTypeLabels = {
      note: "Notiță",
      image: "Imagine",
      media: "Media",
      email: "Email",
    }

    return (
      <Card
        key={draft.id}
        className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 group overflow-hidden"
      >
        <div className="relative">
          {draft.type === "image" && draft.mediaUrl && (
            <div className="h-32 bg-muted/50 overflow-hidden">
              <img
                src={draft.mediaUrl}
                alt={draft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>
          )}
          {draft.type === "media" && draft.mediaUrl && (
            <div className="h-32 bg-muted/50 flex items-center justify-center">
              <Video className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {(draft.type === "note" || draft.type === "email") && (
            <div className="h-32 bg-muted/50 flex items-center justify-center">
              <DraftIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => onDeleteDraft(e, draft.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold mb-1 truncate">{draft.name}</CardTitle>
              <CardDescription className="text-xs">
                {draftTypeLabels[draft.type] || draft.type}
              </CardDescription>
            </div>
          </div>
          {draft.content && draft.type === "note" && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
              {draft.content}
            </p>
          )}
          <div className="mt-3 text-xs text-muted-foreground">
            {new Date(draft.updatedAt || draft.createdAt).toLocaleDateString("ro-RO", {
              day: "numeric",
              month: "short",
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const isGroupDrafts = selectedGroup !== null && selectedGroup !== undefined
  const title = isGroupDrafts 
    ? `Drafts din ${selectedGroup.name || "grup"}`
    : "Drafts"

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={onCreateDraftClick}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Creează draft
        </Button>
      </div>

      {drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {drafts.map((draft) => renderDraftCard(draft))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isGroupDrafts ? "Nu ai drafts în acest grup" : "Nu ai drafts"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              {isGroupDrafts
                ? "Creează primul draft pentru acest grup pentru a salva notițe, imagini sau media."
                : "Creează primul tău draft pentru a salva notițe, imagini sau media."}
            </p>
            <Button onClick={onCreateDraftClick} className="gap-2">
              <Plus className="h-4 w-4" />
              Creează draft
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default DraftsView

