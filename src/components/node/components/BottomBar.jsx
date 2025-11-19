import { useState } from 'react'
import { ChevronDown, Dice5, FileText, Hand, MousePointer, Search } from 'lucide-react'
import { useWorkflowEditorStore } from '../store/useWorkflowEditorStore'

function BottomBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState('100%')
  const zoomOptions = ['50%', '75%', '100%', '125%', '150%']
  const activeTool = useWorkflowEditorStore((state) => state.activeTool)
  const setActiveTool = useWorkflowEditorStore((state) => state.setActiveTool)

  const handleToggleMenu = () => {
    setIsMenuOpen((current) => !current)
  }

  const handleSelectZoom = (value) => {
    setZoomLevel(value)
    setIsMenuOpen(false)
  }

  return (
    <div className="workflow-bottom-bar" role="toolbar" aria-label="Workflow controls">
      <div className="workflow-bottom-bar__zoom">
        <button
          type="button"
          className="workflow-bottom-bar__zoom-button"
          onClick={handleToggleMenu}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
        >
          <Search size={16} strokeWidth={2} aria-hidden="true" />
          <span className="workflow-bottom-bar__label">{zoomLevel}</span>
          <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
        </button>

        {isMenuOpen ? (
          <div className="workflow-bottom-bar__menu" role="menu">
            {zoomOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="workflow-bottom-bar__menu-item"
                onClick={() => handleSelectZoom(option)}
                role="menuitem"
                aria-label={`Set zoom to ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="workflow-bottom-bar__actions" aria-label="Workflow tools">
        <button
          type="button"
          className={`workflow-bottom-bar__action${activeTool === 'pan' ? ' is-active' : ''}`}
          aria-label="Pan tool"
          aria-pressed={activeTool === 'pan'}
          onClick={() => setActiveTool('pan')}
        >
          <Hand size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`workflow-bottom-bar__action${activeTool === 'select' ? ' is-active' : ''}`}
          aria-label="Select tool"
          aria-pressed={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        >
          <MousePointer size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`workflow-bottom-bar__action${activeTool === 'files' ? ' is-active' : ''}`}
          aria-label="Files"
          aria-pressed={activeTool === 'files'}
          onClick={() => setActiveTool('files')}
        >
          <FileText size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <div className="workflow-bottom-bar__divider" aria-hidden="true" />
        <button
          type="button"
          className={`workflow-bottom-bar__action${activeTool === 'surprise' ? ' is-active' : ''}`}
          aria-label="Surprise tool"
          aria-pressed={activeTool === 'surprise'}
          onClick={() => setActiveTool('surprise')}
        >
          <Dice5 size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default BottomBar


