import { useEffect, useMemo, useRef, useState } from "react"
import { Search, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const SpotlightSearch = ({ open, items = [], onClose, onSelect, query: controlledQuery, onQueryChange, placeholder = "Tastează pentru a căuta clinici, module sau acțiuni" }) => {
  const [internalQuery, setInternalQuery] = useState("")
  const inputRef = useRef(null)
  const isControlled = controlledQuery !== undefined
  const currentQuery = isControlled ? controlledQuery : internalQuery

  const setQuery = (value) => {
    if (isControlled) {
      onQueryChange?.(value)
    } else {
      setInternalQuery(value)
    }
  }

  useEffect(() => {
    if (open) {
      if (!isControlled) {
        setInternalQuery("")
      }
      const timeout = setTimeout(() => {
        inputRef.current?.focus()
      }, 30)

      document.body.classList.add("overflow-hidden")

      return () => {
        clearTimeout(timeout)
        document.body.classList.remove("overflow-hidden")
      }
    }

    document.body.classList.remove("overflow-hidden")
  }, [open, isControlled])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.()
      }
      // Handle Enter key for creating team
      if (event.key === "Enter" && currentQuery.trim() && items.length === 1 && items[0].onSubmit) {
        event.preventDefault()
        items[0].onSubmit(currentQuery)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose, currentQuery, items])

  const filteredItems = useMemo(() => {
    if (!currentQuery) {
      return items
    }

    const lowerQuery = currentQuery.trim().toLowerCase()

    return items.filter((item) => {
      const haystack = `${item.title} ${item.description ?? ""}`.toLowerCase()
      return haystack.includes(lowerQuery)
    })
  }, [items, currentQuery])

  const groupedItems = useMemo(() => {
    const groups = new Map()

    filteredItems.forEach((item) => {
      const key = item.group ?? "Sugestii"
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key).push(item)
    })

    return Array.from(groups.entries())
  }, [filteredItems])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-xs transition",
        open ? "pointer-events-auto opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 mt-24 w-full max-w-xl px-4 pb-12">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border/60 bg-card px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={currentQuery}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="h-10 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            />
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={onClose}>
              Esc
            </Button>
          </div>

          <ScrollArea className="max-h-[360px]">
            {groupedItems.length ? (
              <div className="space-y-4 px-4 py-4">
                {groupedItems.map(([groupName, groupItems]) => (
                  <div key={groupName} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <span>{groupName}</span>
                      {groupName === "Navigare" ? (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                          <Sparkles className="h-3 w-3 text-primary" />
                          Sugestii inteligente
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      {groupItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-sm transition",
                            "hover:border-border/80 hover:bg-muted/60",
                          )}
                          onClick={() => onSelect?.(item)}
                        >
                          <div className="flex flex-1 flex-col text-left">
                            <span className="font-medium text-foreground">{item.title}</span>
                            {item.description ? (
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            ) : null}
                          </div>
                          {item.isActive ? (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                              Activ
                            </Badge>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 px-8 py-12 text-center text-sm text-muted-foreground">
                <Sparkles className="h-6 w-6 text-primary" />
                Nu am găsit rezultate pentru „{currentQuery}". Încearcă alt termen.
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default SpotlightSearch

