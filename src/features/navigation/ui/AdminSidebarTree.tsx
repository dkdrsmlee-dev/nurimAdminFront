import { useState } from 'react'
import './admin-sidebar-tree.css'

type MenuSection = {
  title: string
  children: string[]
}

const menuSections: MenuSection[] = [
  { title: 'Home', children: [] },
  { title: '회원관리', children: ['회원 목록', '회원 탈퇴 관리'] },
  { title: '마이핏 관리', children: ['마이핏 현황', '품종 관리', '펫 통계'] },
  { title: '멤버십 관리', children: ['멤버십 현황', '결제 관리', '환불 관리'] },
  {
    title: '리워드 관리',
    children: ['리워드 현황', '리워드 수동 지급', '리워드 수동 회수', '리워드 설정'],
  },
  { title: '이벤트관리', children: ['이벤트 목록', '이벤트 생성'] },
  { title: '알림 관리', children: ['알림 현황', '공지 사항', '알림 정책 설정'] },
  { title: '고객 지원', children: ['1:1 문의', 'FAQ 관리'] },
  { title: '시스템 설정', children: ['관리자 계정 관리', '감사 로그', '서비스 설정'] },
]

export function AdminSidebarTree() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() =>
    menuSections.reduce<Record<string, boolean>>((acc, section) => {
      if (section.children.length > 0) {
        acc[section.title] = true
      }
      return acc
    }, {})
  )

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <nav className="admin-sidebar" aria-label="관리자 메뉴">
      <ul className="admin-sidebar__sections">
        {menuSections.map((section, index) => {
          const canExpand = section.children.length > 0
          const isExpanded = canExpand ? expandedSections[section.title] : false

          return (
            <li key={section.title} className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-button ${
                index === 0 ? 'is-active' : ''
              }`}
              onClick={() => {
                if (canExpand) {
                  toggleSection(section.title)
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
