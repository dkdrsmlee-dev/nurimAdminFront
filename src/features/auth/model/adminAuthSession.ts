import type { AdminLoginResponse } from '../api/adminAuthApi'

const ADMIN_AUTH_SESSION_STORAGE_KEY = 'nurim-admin-front.admin-auth-session'

export type AdminAuthSession = {
  tokenType: string
  accessToken: string
  refreshToken: string
  accessExpiresAtMs: number | null
  refreshExpiresAtMs: number | null
  issuedAtMs: number
  requiresPasswordChange: boolean
  reason?: string
  passwordChangeToken?: string
}

function toExpireAtMs(issuedAtMs: number, expiresInSec: number): number | null {
  if (expiresInSec <= 0) {
    return null
  }
  return issuedAtMs + expiresInSec * 1000
}

function isAdminAuthSession(value: unknown): value is AdminAuthSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const session = value as Partial<AdminAuthSession>

  return (
    typeof session.tokenType === 'string' &&
    typeof session.accessToken === 'string' &&
    typeof session.refreshToken === 'string' &&
    typeof session.issuedAtMs === 'number'
  )
}

export function saveAdminAuthSession(
  loginResponse: AdminLoginResponse
): AdminAuthSession {
  const issuedAtMs = Date.now()

  const session: AdminAuthSession = {
    tokenType: loginResponse.tokenType,
    accessToken: loginResponse.accessToken,
    refreshToken: loginResponse.refreshToken,
    accessExpiresAtMs: toExpireAtMs(issuedAtMs, loginResponse.accessExpiresInSec),
    refreshExpiresAtMs: toExpireAtMs(issuedAtMs, loginResponse.refreshExpiresInSec),
    issuedAtMs,
    requiresPasswordChange: Boolean(loginResponse.requiresPasswordChange),
    reason: loginResponse.reason,
    passwordChangeToken: loginResponse.passwordChangeToken,
  }

  localStorage.setItem(ADMIN_AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))

  return session
}

export function readAdminAuthSession(): AdminAuthSession | null {
  const raw = localStorage.getItem(ADMIN_AUTH_SESSION_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    return isAdminAuthSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearAdminAuthSession() {
  localStorage.removeItem(ADMIN_AUTH_SESSION_STORAGE_KEY)
}

export function getAdminAccessToken(): string | null {
  const session = readAdminAuthSession()
  return session?.accessToken ?? null
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return window.atob(padded)
}

export function getAdminRoleKeysFromToken(): string[] {
  const session = readAdminAuthSession()

  if (!session) {
    return []
  }

  try {
    const parts = session.accessToken.split('.')

    if (parts.length < 2) {
      return []
    }

    const payloadText = decodeBase64Url(parts[1])
    const payload = JSON.parse(payloadText) as { roles?: unknown }

    if (!Array.isArray(payload.roles)) {
      return []
    }

    return payload.roles.filter((role): role is string => typeof role === 'string')
  } catch {
    return []
  }
}
