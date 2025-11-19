class PanManager {
  constructor(element, onPanChange) {
    this.element = element
    this.onPanChange = onPanChange
    this.isPointerDown = false
    this.startPan = { x: 0, y: 0 }
    this.pointerStart = { x: 0, y: 0 }
    this.pan = { x: 0, y: 0 }

    this.handlePointerDown = this.handlePointerDown.bind(this)
    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.handlePointerUp = this.handlePointerUp.bind(this)

    this.element.addEventListener('pointerdown', this.handlePointerDown)
  }

  handlePointerDown(event) {
    if (event.button !== 0) return
    if (event.target.closest('[data-pan-lock="true"]')) return

    this.isPointerDown = true
    this.pointerStart = { x: event.clientX, y: event.clientY }
    this.startPan = { ...this.pan }
    this.element.setPointerCapture?.(event.pointerId)
    this.element.classList.add('is-panning')

    window.addEventListener('pointermove', this.handlePointerMove)
    window.addEventListener('pointerup', this.handlePointerUp)
    window.addEventListener('pointercancel', this.handlePointerUp)
  }

  handlePointerMove(event) {
    if (!this.isPointerDown) return

    const deltaX = event.clientX - this.pointerStart.x
    const deltaY = event.clientY - this.pointerStart.y

    this.pan = {
      x: this.startPan.x + deltaX,
      y: this.startPan.y + deltaY,
    }

    this.onPanChange(this.pan)
  }

  handlePointerUp(event) {
    if (!this.isPointerDown) return

    this.isPointerDown = false
    this.element.releasePointerCapture?.(event.pointerId)
    this.element.classList.remove('is-panning')

    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('pointerup', this.handlePointerUp)
    window.removeEventListener('pointercancel', this.handlePointerUp)
  }

  destroy() {
    this.element.removeEventListener('pointerdown', this.handlePointerDown)
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('pointerup', this.handlePointerUp)
    window.removeEventListener('pointercancel', this.handlePointerUp)
  }
}

export default PanManager

