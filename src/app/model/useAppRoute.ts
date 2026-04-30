import { useEffect, useState } from 'react'
import { pathToRoute, routeToPath, type AppRoute } from './routes'

export function useAppRoute() {
  const [route, setRoute] = useState<AppRoute>(() =>
    pathToRoute(window.location.pathname)
  )

  useEffect(() => {
    const handlePopState = () => {
      setRoute(pathToRoute(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (nextRoute: AppRoute) => {
    const path = routeToPath(nextRoute)

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }

    setRoute(nextRoute)
  }

  return {
    route,
    navigate,
  }
}
