export type AppRoute = 'login' | 'dashboard' | 'ui-preview'

export function pathToRoute(pathname: string): AppRoute {
  if (pathname === '/dashboard') {
    return 'dashboard'
  }
  if (pathname === '/ui-preview') {
    return 'ui-preview'
  }
  return 'login'
}

export function routeToPath(route: AppRoute): string {
  if (route === 'dashboard') {
    return '/dashboard'
  }
  if (route === 'ui-preview') {
    return '/ui-preview'
  }
  return '/login'
}
