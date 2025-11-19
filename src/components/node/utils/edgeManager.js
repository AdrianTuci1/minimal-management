class EdgeManager {
  constructor(getAnchorPoint, config = {}) {
    this.getAnchorPoint = getAnchorPoint
    this.offset = config.offset ?? 28
    this.radius = config.radius ?? 12
    this.directionOverrides = {
      top: config.directionOverrides?.top ?? { x: 0, y: -1 },
      bottom: config.directionOverrides?.bottom ?? { x: 0, y: 1 },
      left: config.directionOverrides?.left ?? { x: -1, y: 0 },
      right: config.directionOverrides?.right ?? { x: 1, y: 0 },
    }
  }

  directionForSide(side) {
    return this.directionOverrides[side] ?? { x: 0, y: 0 }
  }

  addPoint(list, point) {
    const last = list[list.length - 1]
    if (!last || last.x !== point.x || last.y !== point.y) {
      list.push(point)
    }
  }

  createRoundedPath(points) {
    if (points.length < 2) {
      return ''
    }

    let path = `M${points[0].x},${points[0].y}`

    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1]
      const current = points[i]
      const next = points[i + 1]

      if (!next) {
        if (current.x !== prev.x || current.y !== prev.y) {
          path += ` L${current.x},${current.y}`
        }
        continue
      }

      const prevDelta = { x: current.x - prev.x, y: current.y - prev.y }
      const nextDelta = { x: next.x - current.x, y: next.y - current.y }

      const prevLength = Math.abs(prevDelta.x) + Math.abs(prevDelta.y)
      const nextLength = Math.abs(nextDelta.x) + Math.abs(nextDelta.y)

      if (prevLength === 0 || nextLength === 0) {
        continue
      }

      const cornerRadius = Math.min(this.radius, prevLength / 2, nextLength / 2)
      const cornerStart = {
        x: current.x - Math.sign(prevDelta.x) * cornerRadius,
        y: current.y - Math.sign(prevDelta.y) * cornerRadius,
      }
      const cornerEnd = {
        x: current.x + Math.sign(nextDelta.x) * cornerRadius,
        y: current.y + Math.sign(nextDelta.y) * cornerRadius,
      }

      if (cornerStart.x !== prev.x || cornerStart.y !== prev.y) {
        path += ` L${cornerStart.x},${cornerStart.y}`
      }

      path += ` Q${current.x},${current.y} ${cornerEnd.x},${cornerEnd.y}`
    }

    return path
  }

  buildOrthogonalPath(start, end, sourceSide, targetSide) {
    const sourceDirection = this.directionForSide(sourceSide)
    const targetDirection = this.directionForSide(targetSide)

    const points = [start]

    const startExtension = {
      x: start.x + sourceDirection.x * this.offset,
      y: start.y + sourceDirection.y * this.offset,
    }
    this.addPoint(points, startExtension)

    const endApproach = {
      x: end.x + targetDirection.x * this.offset,
      y: end.y + targetDirection.y * this.offset,
    }

    const lastPoint = points[points.length - 1]
    if (lastPoint.x !== endApproach.x && lastPoint.y !== endApproach.y) {
      if (Math.abs(sourceDirection.x) === Math.abs(targetDirection.x)) {
        this.addPoint(points, { x: lastPoint.x, y: endApproach.y })
      } else if (Math.abs(sourceDirection.y) === Math.abs(targetDirection.y)) {
        this.addPoint(points, { x: endApproach.x, y: lastPoint.y })
      } else if (Math.abs(sourceDirection.x) === 0) {
        this.addPoint(points, { x: endApproach.x, y: lastPoint.y })
      } else {
        this.addPoint(points, { x: lastPoint.x, y: endApproach.y })
      }
    }

    this.addPoint(points, endApproach)
    this.addPoint(points, end)

    return this.createRoundedPath(points)
  }

  createEdge(id, sourceId, sourceSide, targetId, targetSide, extra = {}) {
    const start = this.getAnchorPoint(sourceId, sourceSide)
    const end = this.getAnchorPoint(targetId, targetSide)

    return {
      id,
      start,
      end,
      sourceSide,
      targetSide,
      path: this.buildOrthogonalPath(start, end, sourceSide, targetSide),
      ...extra,
    }
  }
}

export default EdgeManager

