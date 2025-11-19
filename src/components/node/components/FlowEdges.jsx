import './FlowEdges.css'

function FlowEdges({ width, height, edges, onEdgeContextMenu }) {
  const handleContextMenu = (event, edge) => {
    if (!onEdgeContextMenu) return
    event.preventDefault()
    event.stopPropagation()
    onEdgeContextMenu(edge, event)
  }

  return (
    <svg
      className="flow-connections"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <marker
          id="flow-arrow"
          markerWidth="12"
          markerHeight="12"
          refX="11"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L12,6 L0,12 L3.6,6 Z" className="arrowhead" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const isPreview = edge.isPreview === true
        const pointerEvents = isPreview ? 'none' : 'stroke'

        return (
          <path
            key={edge.id}
            d={edge.path}
            className="flow-edge"
            markerEnd={edge.hasArrow === false ? undefined : 'url(#flow-arrow)'}
            pointerEvents={pointerEvents}
            onContextMenu={!isPreview ? (event) => handleContextMenu(event, edge) : undefined}
          />
        )
      })}
    </svg>
  )
}

export default FlowEdges

