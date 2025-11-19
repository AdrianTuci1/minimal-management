import { useMemo, useState } from 'react'
import { NEXT_STEP_GROUPS } from '../../constants/nextSteps'

function NextStepLibrary({ onSelect }) {
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()

  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) {
      return NEXT_STEP_GROUPS
    }

    return NEXT_STEP_GROUPS.map((group) => {
      const items = group.items.filter((item) => {
        const haystack = `${item.label} ${item.description ?? ''}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })

      if (items.length === 0) {
        return null
      }

      return {
        ...group,
        items,
      }
    }).filter(Boolean)
  }, [normalizedQuery])

  const handleSelect = (item) => {
    if (typeof onSelect === 'function') {
      onSelect(item)
    }
  }

  return (
    <>
      <div className="editor-toolbar__header">
        <h2 className="editor-toolbar__title">Next step</h2>
        <p className="editor-toolbar__description">Set the next block in the workflow.</p>
      </div>

      <div className="editor-toolbar__search">
        <input
          className="editor-toolbar__search-input"
          type="search"
          placeholder="Search steps"
          aria-label="Search steps"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="editor-toolbar__groups editor-toolbar__groups--stacked">
        {filteredGroups.length === 0 ? (
          <p className="editor-toolbar__empty">No steps match your search.</p>
        ) : null}
        {filteredGroups.map((group) => (
          <section key={group.id} className="editor-toolbar__group" aria-labelledby={`${group.id}-label`}>
            <header className="editor-toolbar__group-header">
              <p id={`${group.id}-label`} className="editor-toolbar__group-title">
                {group.title}
              </p>
            </header>
            <div className="editor-toolbar__items editor-toolbar__items--grid">
              {group.items.map((item) => {
                const Icon = item.Icon ?? null
                const payload = {
                  ...item,
                  group: {
                    id: group.id,
                    title: group.title,
                    appearance: group.appearance,
                  },
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="editor-toolbar__item editor-toolbar__item--step"
                    onClick={() => handleSelect(payload)}
                  >
                    <span className="editor-toolbar__item-icon" aria-hidden="true">
                      {Icon ? (
                        <Icon className="editor-toolbar__item-icon-symbol" strokeWidth={2} />
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

export default NextStepLibrary


