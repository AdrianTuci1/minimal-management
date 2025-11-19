import { useCallback, useEffect, useRef } from 'react'
import './FlowAnchors.css'

function getOffsetForSide(side) {
  const offsetAmount = 0

  switch (side) {
    case 'top':
      return { x: 0, y: -offsetAmount }
    case 'bottom':
      return { x: 0, y: offsetAmount }
    case 'left':
      return { x: -offsetAmount, y: 0 }
    case 'right':
    default:
      return { x: offsetAmount, y: 0 }
  }
}

function FlowAnchors({
  width,
  height,
  edges,
  anchors = [],
  onAnchorDragStart,
  onAnchorDragMove,
  onAnchorDragEnd,
}) {
  const svgRef = useRef(null)
  const dragStateRef = useRef(null)
  const latestHandlersRef = useRef({ onAnchorDragStart, onAnchorDragMove, onAnchorDragEnd })

  useEffect(() => {
    latestHandlersRef.current = { onAnchorDragStart, onAnchorDragMove, onAnchorDragEnd }
  }, [onAnchorDragEnd, onAnchorDragMove, onAnchorDragStart])

  const getPointForEvent = useCallback(
    (event) => {
      const svg = svgRef.current
      if (!svg) {
        return { x: 0, y: 0 }
      }

      const rect = svg.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        return { x: 0, y: 0 }
      }

      const scaleX = width / rect.width
      const scaleY = height / rect.height

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      }
    },
    [height, width]
  )

  const finishDrag = useCallback(
    (event, cancelled) => {
      const state = dragStateRef.current
      if (!state || event.pointerId !== state.pointerId) {
        return
      }

      const { listeners, anchor } = state

      if (listeners) {
        window.removeEventListener('pointermove', listeners.move)
        window.removeEventListener('pointerup', listeners.up)
        window.removeEventListener('pointercancel', listeners.cancel)
      }

      dragStateRef.current = null

      const handlers = latestHandlersRef.current
      if (!handlers.onAnchorDragEnd) {
        return
      }

      const point = getPointForEvent(event)
      handlers.onAnchorDragEnd(anchor, point, { cancelled })
    },
    [getPointForEvent]
  )

  const handlePointerMove = useCallback(
    (event) => {
      const state = dragStateRef.current
      if (!state || event.pointerId !== state.pointerId) {
        return
      }

      const handlers = latestHandlersRef.current
      if (!handlers.onAnchorDragMove) {
        return
      }

      const point = getPointForEvent(event)
      handlers.onAnchorDragMove(state.anchor, point)
    },
    [getPointForEvent]
  )

  const handlePointerUp = useCallback(
    (event) => {
      finishDrag(event, false)
    },
    [finishDrag]
  )

  const handlePointerCancel = useCallback(
    (event) => {
      finishDrag(event, true)
    },
    [finishDrag]
  )

  useEffect(
    () => () => {
      const state = dragStateRef.current
      if (state && state.listeners) {
        window.removeEventListener('pointermove', state.listeners.move)
        window.removeEventListener('pointerup', state.listeners.up)
        window.removeEventListener('pointercancel', state.listeners.cancel)
      }
      dragStateRef.current = null
    },
    []
  )

  const handleAnchorPointerDown = useCallback(
    (event, anchor) => {
      if (event.button !== 0) {
        return
      }

      const handlers = latestHandlersRef.current
      if (!handlers.onAnchorDragStart) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const pointerId = event.pointerId
      const point = getPointForEvent(event)
      const moveListener = (nativeEvent) => handlePointerMove(nativeEvent)
      const upListener = (nativeEvent) => handlePointerUp(nativeEvent)
      const cancelListener = (nativeEvent) => handlePointerCancel(nativeEvent)

      dragStateRef.current = {
        pointerId,
        anchor,
        listeners: {
          move: moveListener,
          up: upListener,
          cancel: cancelListener,
        },
      }

      handlers.onAnchorDragStart(anchor, point)

      window.addEventListener('pointermove', moveListener)
      window.addEventListener('pointerup', upListener)
      window.addEventListener('pointercancel', cancelListener)
    },
    [getPointForEvent, handlePointerCancel, handlePointerMove, handlePointerUp]
  )

  return (
    <svg
      ref={svgRef}
      className="flow-anchors"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {edges
        .filter((edge) => edge.showAnchor !== false)
        .map((edge) => {
          const offset = getOffsetForSide(edge.sourceSide)
          const cx = edge.start.x + offset.x
          const cy = edge.start.y + offset.y

          return (
            <circle
              key={`${edge.id}-anchor`}
              cx={cx}
              cy={cy}
              r={6.5}
              className="anchor-ring anchor-ring--overlay"
            />
          )
        })}
      {anchors.map((anchor) => {
        const className = ['anchor-ring', 'anchor-ring--overlay', anchor.isInteractive ? 'anchor-ring--interactive' : null]
          .filter(Boolean)
          .join(' ')

        return (
          <circle
            key={anchor.id}
            cx={anchor.cx}
            cy={anchor.cy}
            r={6.5}
            className={className}
            data-pan-lock={anchor.isInteractive ? 'true' : undefined}
            onPointerDown={anchor.isInteractive ? (event) => handleAnchorPointerDown(event, anchor) : undefined}
          />
        )
      })}
    </svg>
  )
}

export default FlowAnchors

