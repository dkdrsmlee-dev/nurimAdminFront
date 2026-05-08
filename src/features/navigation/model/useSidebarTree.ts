import { useMemo, useState } from 'react'
import type { AdminMenuSection } from './adminMenu'

function collectExpandableKeys(
  sections: AdminMenuSection[],
  result: Set<string> = new Set<string>()
) {
  for (const section of sections) {
    if (section.children.length > 0) {
      result.add(section.key)
      collectExpandableKeys(section.children, result)
    }
  }
  return result
}

export function useSidebarTree(sections: AdminMenuSection[]) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(
    {}
  )

  const expandedSections = useMemo(() => {
    const expandableKeys = collectExpandableKeys(sections)
    const next: Record<string, boolean> = {}

    for (const key of expandableKeys) {
      next[key] = collapsedSections[key] !== true
    }

    return next
  }, [collapsedSections, sections])

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !(prev[sectionKey] === true),
    }))
  }

  return {
    expandedSections,
    toggleSection,
  }
}
