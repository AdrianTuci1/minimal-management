export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 960

export const NODE_WIDTH = 280
export const NODE_HEIGHT = 110

export const NODE_VERTICAL_SPACING = 180
export const DEFAULT_TRIGGER_Y = 180

export const CANVAS_CENTER_X = CANVAS_WIDTH / 2
export const DEFAULT_ACTION_Y = DEFAULT_TRIGGER_Y + NODE_VERTICAL_SPACING

export function getNodeHalfSize() {
  return {
    halfWidth: NODE_WIDTH / 2,
    halfHeight: NODE_HEIGHT / 2,
  }
}

export function clampNodeYPosition(y) {
  const { halfHeight } = getNodeHalfSize()
  const minY = halfHeight
  const maxY = CANVAS_HEIGHT - halfHeight
  return Math.min(Math.max(y, minY), maxY)
}

