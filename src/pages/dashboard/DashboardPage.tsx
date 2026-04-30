import { useResizableSidebar } from '../../features/layout/model/useResizableSidebar'
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '../../features/layout/model/sidebarSize'
import { adminMenuSections } from '../../features/navigation/model/adminMenu'
import { useSidebarTree } from '../../features/navigation/model/useSidebarTree'
import { AdminSidebarTree } from '../../features/navigation/ui/AdminSidebarTree'
import './dashboard-page.css'

type DashboardPageProps = {
  onMoveToPreview: () => void
}

export function DashboardPage({ onMoveToPreview }: DashboardPageProps) {
  const { expandedSections, toggleSection } = useSidebarTree(adminMenuSections)
  const { containerRef, sidebarWidth, startResizing } = useResizableSidebar({
    defaultWidth: SIDEBAR_DEFAULT_WIDTH,
    minWidth: SIDEBAR_MIN_WIDTH,
    maxWidth: SIDEBAR_MAX_WIDTH,
  })

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__topbar">
        <span className="dashboard-page__breadcrumb">홈_대시보드</span>
        <button
          type="button"
          className="dashboard-page__preview-link"
          onClick={onMoveToPreview}
        >
          UI Preview
        </button>
      </header>
      <div className="dashboard-page__body" ref={containerRef}>
        <aside
          className="dashboard-page__sidebar"
          style={{ width: `${sidebarWidth}px` }}
        >
          <AdminSidebarTree
            sections={adminMenuSections}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            activeSectionKey="home"
          />
        </aside>
        <div
          className="dashboard-page__resizer"
          role="separator"
          aria-orientation="vertical"
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          aria-valuenow={sidebarWidth}
          onMouseDown={startResizing}
        />
        <main className="dashboard-page__content" />
      </div>
    </div>
  )
}
