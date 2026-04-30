import type { AdminMenuSection } from '../model/adminMenu'
import './admin-sidebar-tree.css'

type AdminSidebarTreeProps = {
  sections: AdminMenuSection[]
  expandedSections: Record<string, boolean>
  activeSectionKey?: string
  onToggleSection: (sectionKey: string) => void
}

export function AdminSidebarTree({
  sections,
  expandedSections,
  activeSectionKey = 'home',
  onToggleSection,
}: AdminSidebarTreeProps) {
  return (
    <nav className="admin-sidebar" aria-label="관리자 메뉴">
      <ul className="admin-sidebar__sections">
        {sections.map((section, index) => {
          const canExpand = section.children.length > 0
          const isExpanded = canExpand ? expandedSections[section.key] : false

          return (
            <li key={section.title} className="admin-sidebar__section">
              <button
                type="button"
                className={`admin-sidebar__section-button ${
                  section.key === activeSectionKey ? 'is-active' : ''
                }`}
                onClick={() => {
                  if (canExpand) {
                    onToggleSection(section.key)
                  }
                }}
                aria-expanded={canExpand ? isExpanded : undefined}
                aria-controls={canExpand ? `menu-section-${index}` : undefined}
              >
                <span className="admin-sidebar__dot" aria-hidden="true" />
                <span>{section.title}</span>
                {canExpand ? (
                  <span
                    className={`admin-sidebar__chevron ${
                      isExpanded ? 'is-expanded' : ''
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                ) : null}
              </button>
              {canExpand ? (
                <ul
                  id={`menu-section-${index}`}
                  className="admin-sidebar__children"
                  hidden={!isExpanded}
                >
                  {section.children.map((item) => (
                    <li key={item}>
                      <button type="button" className="admin-sidebar__child-button">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
