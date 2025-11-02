import { useEffect, useRef, useState } from "react"
import { Mail, Plus, Share2, ChevronDown, Crown, Edit, Eye, Trash2, Link2, X } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import useAppStore from "@/store/appStore"

const ShareSpotlight = () => {
  const [emailInput, setEmailInput] = useState("")
  const inputRef = useRef(null)

  const {
    isShareSpotlightOpen,
    setIsShareSpotlightOpen,
    sharedEmails,
    addSharedEmail,
    updateSharedEmailRole,
    removeSharedEmail,
  } = useAppStore()

  useEffect(() => {
    if (isShareSpotlightOpen) {
      setEmailInput("")
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
  }, [isShareSpotlightOpen])

  useEffect(() => {
    if (!isShareSpotlightOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsShareSpotlightOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isShareSpotlightOpen, setIsShareSpotlightOpen])

  const handleAddEmail = () => {
    const email = emailInput.trim()
    if (email && email.includes("@")) {
      addSharedEmail(email, "can_view")
      setEmailInput("")
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddEmail()
    }
  }

  const handleShareProject = () => {
    // TODO: Implement share project approval flow
    console.log("Share project - needs approval")
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "owner":
        return "Proprietar"
      case "can_edit":
        return "Poate edita"
      case "can_view":
        return "Poate vedea"
      default:
        return role
    }
  }

  // Considerăm că email-ul curent este cel cu rolul "owner" sau primul din listă
  const getCurrentUserEmail = () => {
    const ownerEmail = sharedEmails.find((item) => item.role === "owner")
    return ownerEmail ? ownerEmail.email : (sharedEmails.length > 0 ? sharedEmails[0].email : null)
  }

  const isCurrentUserEmail = (email) => {
    return email === getCurrentUserEmail()
  }

  const getInitials = (email) => {
    if (!email) return ""
    const parts = email.split("@")[0].split(/[.\-_]/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-start justify-center transition",
        isShareSpotlightOpen ? "pointer-events-auto opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-black/10" onPointerDown={() => setIsShareSpotlightOpen(false)} />

      <div className="relative z-50 mt-24 w-full max-w-xl px-4 pb-12">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="text-sm font-medium text-foreground">Partajează proiectul</span>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleCopyLink}>
                <Link2 className="h-4 w-4 mr-1.5" />
                Copy link
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsShareSpotlightOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />

          <div className="px-4 py-4 space-y-4">
            {/* Add email input */}
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Adaugă email..."
                type="email"
                className="h-10"
              />
              <Button onClick={handleAddEmail} size="sm" className="h-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Shared emails list */}
            {sharedEmails.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email-uri partajate
                </div>
                <ScrollArea className="max-h-[240px]">
                  <div className="space-y-2">
                    {sharedEmails.map((item) => {
                      const isCurrentUser = isCurrentUserEmail(item.email)
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-3 py-2"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs">
                                {getInitials(item.email)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-foreground truncate">{item.email}</span>
                          </div>
                          {isCurrentUser ? (
                            <span className="text-sm text-muted-foreground">
                              {getRoleLabel(item.role)}
                            </span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                                  <span className="text-sm">{getRoleLabel(item.role)}</span>
                                  <ChevronDown className="h-4 w-4 ml-1.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuCheckboxItem
                                  checked={item.role === "owner"}
                                  onCheckedChange={(checked) => {
                                    if (checked) updateSharedEmailRole(item.id, "owner")
                                  }}
                                >
                                  proprietar
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                  checked={item.role === "can_edit"}
                                  onCheckedChange={(checked) => {
                                    if (checked) updateSharedEmailRole(item.id, "can_edit")
                                  }}
                                >
                                  poate edita
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                  checked={item.role === "can_view"}
                                  onCheckedChange={(checked) => {
                                    if (checked) updateSharedEmailRole(item.id, "can_view")
                                  }}
                                >
                                  poate vedea
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => removeSharedEmail(item.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  elimină
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}

            {sharedEmails.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-8 py-12 text-center text-sm text-muted-foreground">
                <Mail className="h-6 w-6 text-primary" />
                Nu există email-uri partajate. Adaugă email-uri pentru a partaja proiectul.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareSpotlight

