import * as React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  isLoading?: boolean
  tableId?: string // Unique identifier for the table to track animations per table
}

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, isLoading, tableId, ...props }, ref) => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null)
  const instanceIdRef = useRef<string | null>(null)
  
  const combinedRef = React.useCallback(
    (node: HTMLTableSectionElement | null) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      tbodyRef.current = node
      
      // Generate unique ID based on table headers and first row content if tableId not provided
      if (!instanceIdRef.current && node) {
        const table = node.closest('table')
        if (table) {
          const headers = Array.from(table.querySelectorAll('thead th'))
            .map(th => th.textContent?.trim())
            .filter(Boolean)
            .join('-')
          
          // Get first row content for additional uniqueness
          const firstRow = node.querySelector('tr')
          const firstRowContent = firstRow 
            ? Array.from(firstRow.querySelectorAll('td'))
                .slice(0, 2) // Take first 2 cells
                .map(td => td.textContent?.trim())
                .filter(Boolean)
                .join('-')
            : ''
          
          const contentHash = `${headers}-${firstRowContent}`.substring(0, 100).replace(/\s+/g, '-').toLowerCase()
          const hash = contentHash.length > 0 
            ? contentHash
            : `table-${Math.random().toString(36).substring(7)}`
          instanceIdRef.current = hash
        }
      }
    },
    [ref]
  )

  useEffect(() => {
    // Skip if loading
    if (isLoading) return

    if (!tbodyRef.current) return

    const rows = tbodyRef.current.querySelectorAll('tr')
    if (rows.length === 0) return

    // Generate unique ID based on table content
    const table = tbodyRef.current.closest('table')
    let animationKey = tableId
    
    if (!animationKey && table) {
      const headers = Array.from(table.querySelectorAll('thead th'))
        .map(th => th.textContent?.trim())
        .filter(Boolean)
        .join('-')
      
      const firstRow = rows[0] as HTMLElement
      const firstRowContent = firstRow 
        ? Array.from(firstRow.querySelectorAll('td'))
            .slice(0, 2)
            .map(td => td.textContent?.trim())
            .filter(Boolean)
            .join('-')
        : ''
      
      const contentHash = `${headers}-${firstRowContent}`.substring(0, 100).replace(/\s+/g, '-').toLowerCase()
      animationKey = contentHash || `table-${Math.random().toString(36).substring(7)}`
      
      // Store for this instance
      if (!instanceIdRef.current) {
        instanceIdRef.current = animationKey
      }
    }
    
    animationKey = animationKey || instanceIdRef.current || `table-${Math.random().toString(36).substring(7)}`
    const sessionKey = `table-animated-${animationKey}`

    // Check if rows are already animated
    const firstRow = rows[0] as HTMLElement
    const isAlreadyAnimated = firstRow.hasAttribute('data-gsap-animated') || 
                              sessionStorage.getItem(sessionKey) === 'true'
    
    if (isAlreadyAnimated) {
      return
    }

    let tl = null
    const timeoutId = setTimeout(() => {
      sessionStorage.setItem(sessionKey, 'true')
      
      tl = gsap.timeline()

      rows.forEach((row, index) => {
        const rowElement = row as HTMLElement
        rowElement.setAttribute('data-gsap-animated', 'true')
        gsap.set(rowElement, { opacity: 0, y: 20, scale: 0.95 })
        tl.to(rowElement, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        }, 0.1 + index * 0.05)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (tl) {
        tl.kill()
      }
    }
  }, [isLoading, tableId])

  return (
    <tbody
      ref={combinedRef}
      className={cn("[&_tr:last-child]:border-b-0", className)}
      {...props}
    />
  )
})
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
