import { useState } from 'react'
import type { AdminMenuSection } from './adminMenu'

export function useSidebarTree(sections: AdminMenuSection[]) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () =>
      sections.reduce<Record<string, boolean>>((acc, section) => {
        if (section.children.length > 0) {
          acc[section.key] = true
        }
        return acc
      }, {})
  )

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  return {
    expandedSections,
    toggleSection,
  }
}
