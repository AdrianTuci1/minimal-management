import './FlowCanvas.css'

function FlowCanvas({ width, height, pan, children }) {
  return (
    <div
      className="flow-canvas"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`,
      }}
    >
      {children}
    </div>
  )
}

export default FlowCanvas

