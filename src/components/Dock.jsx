import React, { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    Activity,
    CalendarDays,
    Home,
    Settings,
    User,
    UserCog,
    Users,
    Wand2,
    Zap,
    MoreHorizontal,
    LayoutDashboard,
    ExternalLink,
    Check
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useSidebarModel } from "../models/SidebarModel"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Icon mapping similar to Sidebar.jsx
const iconMap = {
    Activity,
    CalendarDays,
    Home,
    Settings,
    User,
    UserCog,
    Users,
    Wand2,
    Zap,
    LayoutDashboard,
    ExternalLink,
}

const Dock = ({ className }) => {
    const {
        menuItems,
        workspaceNavigationItems,
        handleMenuChange,
        isMenuItemActive,
    } = useSidebarModel()

    // Initialize with some default items if empty
    const [pinnedItemIds, setPinnedItemIds] = useState([])

    useEffect(() => {
        // Initial defaults: Home + first 4 items
        if (menuItems.length > 0 && pinnedItemIds.length === 0) {
            setPinnedItemIds(menuItems.slice(0, 5).map(i => i.id))
        }
    }, [menuItems])

    const pinnedItems = useMemo(() => {
        return menuItems.filter(item => pinnedItemIds.includes(item.id))
    }, [menuItems, pinnedItemIds])

    const togglePin = (itemId) => {
        setPinnedItemIds(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId)
            } else {
                return [...prev, itemId]
            }
        })
    }

    return (
        <div className={cn("flex justify-center px-4 pb-4 pt-1", className)}>
            <div className="flex items-center gap-1.5 rounded-2xl border border-border/40 bg-background/80 p-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-background/90 hover:shadow-md">
                {pinnedItems.map((item) => {
                    const Icon = iconMap[item.icon] || Settings
                    const isActive = isMenuItemActive(item.id)

                    return (
                        <TooltipProvider key={item.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-9 w-9 rounded-xl transition-all duration-300",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                        onClick={() => handleMenuChange(item.id)}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="sr-only">{item.label}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="mb-2">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                })}

                <Separator orientation="vertical" className="h-6 bg-border/40 mx-0.5" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 data-[state=open]:bg-muted data-[state=open]:text-foreground"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-64 p-2" sideOffset={10}>
                        {menuItems.map(item => {
                            const isPinned = pinnedItemIds.includes(item.id)
                            return (
                                <DropdownMenuItem
                                    key={item.id}
                                    className="flex items-center justify-between p-0 min-h-[36px] cursor-pointer"
                                    onSelect={() => handleMenuChange(item.id)}
                                >
                                    <div className="flex-1 flex items-center gap-2 py-1.5 px-2">
                                        <span>{item.label}</span>
                                    </div>
                                    <div
                                        role="button"
                                        className="h-9 w-9 flex items-center justify-center hover:bg-muted/80 rounded-sm transition-colors mr-0.5"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            togglePin(item.id)
                                        }}
                                    >
                                        <div className={cn(
                                            "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                                            isPinned ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                                        )}>
                                            {isPinned && <Check className="h-3 w-3" />}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            )
                        })}


                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Dock
