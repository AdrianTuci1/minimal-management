import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getTableColumns } from "@/config/tableColumns"

// Available variables based on selected table and global settings
const getAvailableVariables = (selectedTable) => {
  const baseVariables = [
    { id: "clinic.name", label: "Nume clinică", category: "Setări" },
    { id: "clinic.address", label: "Adresa clinicii", category: "Setări" },
    { id: "clinic.phone", label: "Telefon clinică", category: "Setări" },
    { id: "clinic.email", label: "Email clinică", category: "Setări" },
  ]

  if (!selectedTable) {
    return baseVariables
  }

  const tableColumns = getTableColumns(selectedTable)
  const tableVariables = tableColumns.map((col) => ({
    id: `data.${col.id}`,
    label: col.label,
    category: "Date din tabel",
  }))

  return [...baseVariables, ...tableVariables]
}

const EmailTemplateEditor = ({ value = "", onChange, selectedTable }) => {
  const textareaRef = useRef(null)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState(0)

  const availableVariables = getAvailableVariables(selectedTable)

  useEffect(() => {
    if (!showAutocomplete) {
      setSelectedIndex(0)
    }
  }, [showAutocomplete])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart

    onChange(newValue)

    // Check if user typed "{"
    const textBeforeCursor = newValue.substring(0, cursorPos)
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{")

    if (lastOpenBrace !== -1) {
      const textAfterOpenBrace = textBeforeCursor.substring(lastOpenBrace + 1)
      // Check if there's no closing brace yet
      if (!textAfterOpenBrace.includes("}")) {
        setShowAutocomplete(true)
        setCursorPosition(cursorPos)
        // Calculate position for autocomplete popover
        const textarea = e.target
        const textUpToCursor = textBeforeCursor
        // Create a temporary div to measure text width
        const div = document.createElement("div")
        div.style.position = "absolute"
        div.style.visibility = "hidden"
        div.style.whiteSpace = "pre-wrap"
        div.style.font = window.getComputedStyle(textarea).font
        div.style.padding = window.getComputedStyle(textarea).padding
        div.style.width = textarea.offsetWidth + "px"
        div.textContent = textUpToCursor
        document.body.appendChild(div)
        const rect = div.getBoundingClientRect()
        const textareaRect = textarea.getBoundingClientRect()
        const scrollTop = textarea.scrollTop
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20
        
        // Calculate approximate position
        const lines = textUpToCursor.split("\n").length
        const lastLine = textUpToCursor.split("\n").pop() || ""
        
        // Use a simpler approach - position relative to textarea
        const containerRect = textarea.getBoundingClientRect()
        const textareaParent = textarea.offsetParent?.getBoundingClientRect() || { top: 0, left: 0 }
        
        setAutocompletePosition({
          top: containerRect.top - textareaParent.top + (lines - 1) * lineHeight + lineHeight + scrollTop + 25,
          left: containerRect.left - textareaParent.left + 12,
        })
        document.body.removeChild(div)
      } else {
        setShowAutocomplete(false)
      }
    } else {
      setShowAutocomplete(false)
    }
  }

  const insertVariable = (variable) => {
    if (!textareaRef.current) return

    const currentValue = value || ""
    const textBeforeCursor = currentValue.substring(0, cursorPosition)
    const textAfterCursor = currentValue.substring(cursorPosition)

    // Find the last "{"
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{")
    const beforeBrace = currentValue.substring(0, lastOpenBrace)
    const afterCursor = currentValue.substring(cursorPosition)

    const newValue = `${beforeBrace}{${variable.id}}${afterCursor}`
    onChange(newValue)

    setShowAutocomplete(false)

    // Set cursor position after inserted variable
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeBrace.length + variable.id.length + 2
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (!showAutocomplete) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < availableVariables.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      insertVariable(availableVariables[selectedIndex])
    } else if (e.key === "Escape") {
      e.preventDefault()
      setShowAutocomplete(false)
    }
  }

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          // Delay hiding autocomplete to allow clicking on items
          setTimeout(() => {
            if (!e.currentTarget.contains(document.activeElement)) {
              setShowAutocomplete(false)
            }
          }, 200)
        }}
        className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Tastează { pentru a insera variabile..."
      />
      {showAutocomplete && (
        <div
          className="absolute z-50 w-64 rounded-md border bg-popover p-2 shadow-md"
          style={{
            top: `${autocompletePosition.top}px`,
            left: `${autocompletePosition.left}px`,
          }}
        >
          <div className="max-h-60 overflow-y-auto">
            <div className="text-xs font-semibold text-muted-foreground mb-1 px-2 py-1">
              Variabile disponibile
            </div>
            {availableVariables.map((variable, index) => (
              <div
                key={variable.id}
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertVariable(variable)
                }}
                className={cn(
                  "cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                  index === selectedIndex && "bg-accent"
                )}
              >
                <div className="font-medium">{variable.label}</div>
                <div className="text-xs text-muted-foreground">{`{${variable.id}}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmailTemplateEditor

