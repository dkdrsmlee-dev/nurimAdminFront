import { useState } from 'react'
import { useResizableSidebar } from '../../features/layout/model/useResizableSidebar'
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '../../features/layout/model/sidebarSize'
import type { AdminMenuSection } from '../../features/navigation/model/adminMenu'
import { useSidebarTree } from '../../features/navigation/model/useSidebarTree'
import { useAuthorizedSidebarMenu } from '../../features/navigation/model/useAuthorizedSidebarMenu'
import { AdminSidebarTree } from '../../features/navigation/ui/AdminSidebarTree'
import './dashboard-page.css'

type DashboardPageProps = {
  onMoveToPreview: () => void
}

function includesMenuKey(sections: AdminMenuSection[], key: string): boolean {
  return sections.some(
    (section) =>
      section.key === key || (section.children.length > 0 && includesMenuKey(section.children, key))
  )
}

export function DashboardPage({ onMoveToPreview }: DashboardPageProps) {
  const { sections, isLoading, errorMessage, reload } = useAuthorizedSidebarMenu()
  const { expandedSections, toggleSection } = useSidebarTree(sections)
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>()
  const { containerRef, sidebarWidth, startResizing } = useResizableSidebar({
    defaultWidth: SIDEBAR_DEFAULT_WIDTH,
    minWidth: SIDEBAR_MIN_WIDTH,
    maxWidth: SIDEBAR_MAX_WIDTH,
  })

  const activeSectionKey =
    selectedMenuKey && includesMenuKey(sections, selectedMenuKey)
      ? selectedMenuKey
      : sections[0]?.key

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
          {isLoading ? (
            <div className="dashboard-page__menu-state">메뉴 권한 정보를 불러오는 중...</div>
          ) : errorMessage ? (
            <div className="dashboard-page__menu-state">
              <p>{errorMessage}</p>
              <button type="button" onClick={() => void reload()}>
                다시 시도
              </button>
            </div>
          ) : sections.length === 0 ? (
            <div className="dashboard-page__menu-state">
              표시 가능한 메뉴 권한이 없습니다.
            </div>
          ) : (
            <AdminSidebarTree
              sections={sections}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              activeSectionKey={activeSectionKey}
              onSelectMenu={(menu) => setSelectedMenuKey(menu.key)}
            />
          )}
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
