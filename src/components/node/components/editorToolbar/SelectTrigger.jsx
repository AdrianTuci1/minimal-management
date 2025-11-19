import { useMemo, useState } from 'react'
import {
  CalendarClock,
  CheckSquare2,
  Command,
  List,
  ListChecks,
  ListPlus,
  Pencil,
  PlayCircle,
  PlusCircle,
  Tag,
  Webhook,
} from 'lucide-react'
import { TRIGGER_GROUPS } from '../../constants/triggers'
import { useWorkflowEditorStore } from '../../store/useWorkflowEditorStore'

const ICON_COMPONENTS = {
  CalendarClock,
  CheckSquare2,
  Command,
  List,
  ListChecks,
  ListPlus,
  Pencil,
  PlayCircle,
  PlusCircle,
  Tag,
  Webhook,
}

function SelectTrigger() {
  const [query, setQuery] = useState('')
  const setSelectedTriggerId = useWorkflowEditorStore((state) => state.setSelectedTriggerId)
  const setActivePanel = useWorkflowEditorStore((state) => state.setActivePanel)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) return TRIGGER_GROUPS

    return TRIGGER_GROUPS.map((group) => {
      const items = group.items.filter((item) => item.label.toLowerCase().includes(normalizedQuery))

      if (items.length === 0) return null

      return {
        ...group,
        items,
      }
    }).filter(Boolean)
  }, [normalizedQuery])

  const handleSelect = (id) => {
    setSelectedTriggerId(id)
    setActivePanel('edit-trigger')
    setQuery('')
  }

  return (
    <>
      <div className="editor-toolbar__header">
        <h2 className="editor-toolbar__title">Select trigger</h2>
        <p className="editor-toolbar__description">Pick an event to start this workflow.</p>
      </div>

      <div className="editor-toolbar__search">
        <input
          className="editor-toolbar__search-input"
          type="search"
          placeholder="Search triggers"
          aria-label="Search triggers"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="editor-toolbar__groups">
        {filteredGroups.length === 0 ? (
          <p className="editor-toolbar__empty">No triggers match your search.</p>
        ) : null}
        {filteredGroups.map((group) => (
          <section key={group.id} className="editor-toolbar__group" aria-labelledby={`${group.id}-label`}>
            <header className="editor-toolbar__group-header">
              <p id={`${group.id}-label`} className="editor-toolbar__group-title">
                {group.title}
              </p>
            </header>
            <div className="editor-toolbar__items">
              {group.items.map((item) => {
                const Icon = ICON_COMPONENTS[item.iconKey] ?? null

                return (
                  <button
                    key={item.id}
                    type="button"
                    className="editor-toolbar__item"
                    onClick={() => handleSelect(item.id)}
                  >
                    <span className="editor-toolbar__item-icon" aria-hidden="true">
                      {Icon ? (
                        <Icon className="editor-toolbar__item-icon-symbol" />
                      ) : (
                        <span className="editor-toolbar__item-icon-fallback">◎</span>
                      )}
                    </span>
                    <span className="editor-toolbar__item-label">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

export default SelectTrigger


