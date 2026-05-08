export function buildApiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

  if (baseUrl.length === 0) {
    return path
  }

  return `${baseUrl.replace(/\/+$/, '')}${path}`
}
