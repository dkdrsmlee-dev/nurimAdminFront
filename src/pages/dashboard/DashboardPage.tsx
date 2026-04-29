import { useEffect, useRef, useState } from 'react'
import { AdminSidebarTree } from '../../features/navigation/ui/AdminSidebarTree'
import './dashboard-page.css'

const SIDEBAR_MIN_WIDTH = 220
const SIDEBAR_MAX_WIDTH = 520
const SIDEBAR_DEFAULT_WIDTH = 280

export function DashboardPage() {
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!isResizing) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const bodyLeft = bodyRef.current?.getBoundingClientRect().left ?? 0
      const nextWidth = event.clientX - bodyLeft
      const clampedWidth = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, nextWidth)
      )
      setSidebarWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__topbar">
        <span className="dashboard-page__breadcrumb">홈_대시보드</span>
      </header>
      <div className="dashboard-page__body" ref={bodyRef}>
        <aside
          className="dashboard-page__sidebar"
          style={{ width: `${sidebarWidth}px` }}
        >
          <AdminSidebarTree />
        </aside>
        <div
          className="dashboard-page__resizer"
          role="separator"
          aria-orientation="vertical"
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          aria-valuenow={sidebarWidth}
          onMouseDown={(event) => {
            if (event.button !== 0) {
              return
            }
            event.preventDefault()
            setIsResizing(true)
          }}
        />
        <main className="dashboard-page__content" />
      </div>
    </div>
  )
}
