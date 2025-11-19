import { useEffect, useRef } from 'react'
import './FlowNode.css'

function FlowNode({
  node,
  size,
  onClick,
  panLock = false,
  onContextMenu,
  onDrag,
  onDragEnd,
  showAddControl = false,
  onAddClick,
  isSelected = false,
}) {
  const { halfWidth, halfHeight } = size
  const width = halfWidth * 2
  const height = halfHeight * 2
  const description = node.description ?? node.subtitle ?? ''
  const descriptionText = description && description.trim().length > 0 ? description : 'No description'
  const Icon = node.icon ?? null
  const category =
    typeof node.category === 'string'
      ? {
          label: node.category.charAt(0).toUpperCase() + node.category.slice(1),
          appearance: node.category,
        }
      : node.category
  const typeLabel = node.typeLabel ?? null
  const status = node.status ?? null
  const showInlineCategory = category && !typeLabel
  const isInteractive = typeof onClick === 'function'

  const dragStateRef = useRef(null)
  const latestDragCallbacksRef = useRef({ onDrag, onDragEnd })

  useEffect(() => {
    latestDragCallbacksRef.current = { onDrag, onDragEnd }
  }, [onDrag, onDragEnd])

  const handleClick = (event) => {
    if (!isInteractive) return
    event.preventDefault()
    onClick(node, event)
  }

  const handleKeyDown = (event) => {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(node, event)
    }
  }

  const shellClassName = [
    'node-shell',
    `node-shell--${node.variant}`,
    isInteractive ? 'node-shell--interactive' : null,
    onDrag ? 'node-shell--draggable' : null,
    isSelected ? 'node-shell--selected' : null,
  ]
    .filter(Boolean)
    .join(' ')

  const handleContextMenu = (event) => {
    if (!onContextMenu) return
    event.preventDefault()
    onContextMenu(node, event)
  }

  const handlePointerMove = (event) => {
    const state = dragStateRef.current
    if (!state || event.pointerId !== state.pointerId) return

    const deltaY = event.clientY - state.start.y
    const nextPosition = {
      x: state.origin.x,
      y: state.origin.y + deltaY,
    }

    const { onDrag: dragCallback } = latestDragCallbacksRef.current
    if (dragCallback) {
      dragCallback(node, nextPosition)
    }
  }

  const endDrag = (event) => {
    const state = dragStateRef.current
    if (!state || event.pointerId !== state.pointerId) return

    const { onDragEnd: dragEndCallback } = latestDragCallbacksRef.current
    if (dragEndCallback) {
      dragEndCallback(node, state.origin)
    }

    dragStateRef.current = null

    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
  }

  const handlePointerDown = (event) => {
    if (!onDrag) return
    if (event.button !== 0) return

    event.preventDefault()
    event.stopPropagation()

    dragStateRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { ...node.position },
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
  }

  useEffect(
    () => () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    },
    []
  )

  if (node.variant === 'placeholder') {
    return (
      <div
        className={shellClassName}
        style={{
          width,
          height,
          left: node.position.x - halfWidth,
          top: node.position.y - halfHeight,
        }}
        data-pan-lock={panLock ? 'true' : undefined}
        onClick={handleClick}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
      >
        <div className="node node--placeholder" role="presentation">
          <div className="node__placeholder-eyebrow">Workflow start</div>
          <h3 className="node__placeholder-title">{node.title}</h3>
          {description ? <p className="node__placeholder-description">{description}</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div
      className={shellClassName}
      style={{
        width,
        height,
        left: node.position.x - halfWidth,
        top: node.position.y - halfHeight,
      }}
      data-pan-lock={panLock || onDrag ? 'true' : undefined}
      onClick={handleClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
    >
      {node.variant === 'trigger' ? (
        <span className="node-chip node-chip--left node-chip--trigger">Trigger</span>
      ) : null}
      {status ? (
        <span
          className={`node-chip node-chip--right node-chip--status node-chip--status-${status.tone ?? 'neutral'}`}
        >
          {status.label}
        </span>
      ) : null}
      <div className={`node node--${node.variant}`} data-node-type={node.variant}>
        {node.variant !== 'add' ? (
          <div className="node__content">
            <div className="node__header">
              <div className="node__header-left">
                <span className="node__icon" aria-hidden="true">
                  {Icon ? (
                    <Icon className="node__icon-symbol" strokeWidth={2} />
                  ) : (
                    <span className="node__icon-fallback">◎</span>
                  )}
                </span>
                <div className="node__title-block">
                  <div className="node__title-row">
                    <span className="node__title">{node.title}</span>
                    {showInlineCategory ? (
                      <span
                        className={`node__chip node__chip--inline node__chip--${category.appearance ?? 'neutral'}`}
                      >
                        {category.label}
                      </span>
                    ) : null}
                  </div>
                  {node.metaLabel ? <span className="node__meta-label">{node.metaLabel}</span> : null}
                </div>
              </div>
              {typeLabel ? <span className="node__chip node__chip--soft">{typeLabel}</span> : null}
            </div>
            <p className="node__description">{descriptionText}</p>
          </div>
        ) : (
          <div className="node__add-placeholder" role="presentation">
            <span className="node__add-symbol">+</span>
          </div>
        )}
      </div>
      {showAddControl ? (
        <div className="node__add-control">
          <span className="node__add-stem" />
          <button
            type="button"
            className="node__add"
            aria-label="Add next step"
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={(event) => {
              event.stopPropagation()
              if (onAddClick) {
                onAddClick(node, event)
              }
            }}
          >
            +
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default FlowNode

