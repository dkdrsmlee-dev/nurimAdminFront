import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

type UseResizableSidebarOptions = {
  defaultWidth: number
  minWidth: number
  maxWidth: number
}

export function useResizableSidebar({
  defaultWidth,
  minWidth,
  maxWidth,
}: UseResizableSidebarOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!isResizing) {
      return
    }

    const previousCursor = document.body.style.cursor
    const previousUserSelect = document.body.style.userSelect

    const handleMouseMove = (event: MouseEvent) => {
      const containerLeft = containerRef.current?.getBoundingClientRect().left ?? 0
      const nextWidth = event.clientX - containerLeft
      const clampedWidth = Math.min(maxWidth, Math.max(minWidth, nextWidth))
      setSidebarWidth(clampedWidth)
    }

    const stopResizing = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousUserSelect
    }
  }, [isResizing, maxWidth, minWidth])

  const startResizing = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    setIsResizing(true)
  }

  return {
    containerRef,
    sidebarWidth,
    startResizing,
  }
}
