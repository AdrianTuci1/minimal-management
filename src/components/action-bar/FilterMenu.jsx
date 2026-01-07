import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import useAppStore from "@/store/appStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { getFilterColumns } from "@/config/tableColumns"

const FilterMenu = () => {
    const [filters, setFilters] = useState({})
    const { activeMenu } = useAppStore()
    const { workspaceType } = useWorkspaceConfig()

    const filterColumns = useMemo(() => getFilterColumns(activeMenu, workspaceType), [activeMenu, workspaceType])
    const hasFilters = filterColumns.length > 0

    const handleFilterToggle = (columnId) => {
        setFilters((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
        }))
    }

    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(Boolean).length
    }, [filters])

    if (!hasFilters) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 rounded-xl px-3" type="button">
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                        <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {activeFiltersCount}
                        </span>
                    )}
                    <span className="sr-only">Filtre</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filtrează coloane</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={filters[column.id] || false}
                        onCheckedChange={() => handleFilterToggle(column.id)}
                    >
                        {column.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterMenu
