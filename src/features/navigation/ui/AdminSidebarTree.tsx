import type { AdminMenuSection } from '../model/adminMenu'
import './admin-sidebar-tree.css'

type AdminSidebarTreeProps = {
  sections: AdminMenuSection[]
  expandedSections: Record<string, boolean>
  activeSectionKey?: string
  onToggleSection: (sectionKey: string) => void
  onSelectMenu?: (menu: AdminMenuSection) => void
}

export function AdminSidebarTree({
  sections,
  expandedSections,
  activeSectionKey,
  onToggleSection,
  onSelectMenu,
}: AdminSidebarTreeProps) {
  const renderSections = (nodes: AdminMenuSection[], depth: number) => (
    <ul
      className={depth === 0 ? 'admin-sidebar__sections' : 'admin-sidebar__children'}
      data-depth={depth}
    >
      {nodes.map((section, index) => {
        const canExpand = section.children.length > 0
        const isExpanded = canExpand ? Boolean(expandedSections[section.key]) : false
        const isActive = section.key === activeSectionKey
        const controlId = canExpand ? `${section.key}-${depth}-${index}` : undefined

        return (
          <li key={section.key} className="admin-sidebar__section" data-depth={depth}>
            <button
              type="button"
              className={`${
                depth === 0
                  ? 'admin-sidebar__section-button'
                  : 'admin-sidebar__child-button'
              } ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                if (canExpand) {
                  onToggleSection(section.key)
                  return
                }

                onSelectMenu?.(section)
              }}
              aria-expanded={canExpand ? isExpanded : undefined}
              aria-controls={canExpand ? `menu-section-${controlId}` : undefined}
            >
              <span className="admin-sidebar__dot" aria-hidden="true" />
              <span>{section.title}</span>
              {canExpand ? (
                <span
                  className={`admin-sidebar__chevron ${isExpanded ? 'is-expanded' : ''}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              ) : null}
            </button>

            {canExpand ? (
              <div id={`menu-section-${controlId}`} hidden={!isExpanded}>
                {renderSections(section.children, depth + 1)}
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <nav className="admin-sidebar" aria-label="관리자 메뉴">
      {renderSections(sections, 0)}
    </nav>
  )
}
