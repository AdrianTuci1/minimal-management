import React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const SearchInput = () => {
    return (
        <div className="relative w-full max-w-xs">
            <Input className="h-10 w-full rounded-xl border-border/70 pr-10" placeholder="Caută în listă" />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

export default SearchInput
