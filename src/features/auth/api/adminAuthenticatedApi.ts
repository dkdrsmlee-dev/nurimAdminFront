import {
  clearAdminAuthSession,
  readAdminAuthSession,
  saveAdminAuthSession,
} from '../model/adminAuthSession'
import { AdminAuthApiError, refreshAdminToken } from './adminAuthApi'
import { buildApiUrl } from '../../../shared/api/apiUrl'

type ApiEnvelope<T> = {
  code?: string
  msg?: string
  message?: string
  data?: T
}

type RequestWithAuthOptions = {
  fallbackErrorMessage: string
  unauthorizedErrorMessage?: string
}

export class AdminAuthenticatedApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'AdminAuthenticatedApiError'
    this.status = status
  }
}

let refreshRequestInFlight: Promise<void> | null = null

function isUnauthorizedStatus(status: number) {
  return status === 401 || status === 403
}

function pickApiErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const msgValue = (payload as { msg?: unknown }).msg
    if (typeof msgValue === 'string' && msgValue.trim().length > 0) {
      return msgValue
    }

    const messageValue = (payload as { message?: unknown }).message
    if (typeof messageValue === 'string' && messageValue.trim().length > 0) {
      return messageValue
    }

    if (Array.isArray(messageValue)) {
      const first = messageValue.find(
        (value) => typeof value === 'string' && value.trim().length > 0
      )

      if (typeof first === 'string') {
        return first
      }
    }
  }

  return fallback
}

function toResponseData<T>(payload: ApiEnvelope<T> | null): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload.data ?? []) as T
  }

  return payload as unknown as T
}

function createAuthHeaders() {
  const session = readAdminAuthSession()

  if (!session) {
    throw new AdminAuthenticatedApiError(
      401,
      '로그인 세션이 없습니다. 다시 로그인해 주세요.'
    )
  }

  const tokenType = session.tokenType || 'Bearer'

  return {
    Accept: 'application/json',
    Authorization: `${tokenType} ${session.accessToken}`,
    'access-token': session.accessToken,
  }
}

function createRequestHeaders(headers?: HeadersInit) {
  const merged = new Headers(headers)
  const authHeaders = createAuthHeaders()

  merged.set('Accept', authHeaders.Accept)
  merged.set('Authorization', authHeaders.Authorization)
  merged.set('access-token', authHeaders['access-token'])

  return merged
}

async function requestWithAuth<T>(path: string, init: RequestInit) {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: createRequestHeaders(init.headers),
  })

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  return { response, payload }
}

async function refreshAdminSession() {
  if (refreshRequestInFlight) {
    return refreshRequestInFlight
  }

  refreshRequestInFlight = (async () => {
    const session = readAdminAuthSession()

    if (!session) {
      throw new AdminAuthenticatedApiError(
        401,
        '로그인 세션이 없습니다. 다시 로그인해 주세요.'
      )
    }

    const refreshed = await refreshAdminToken({
      refreshToken: session.refreshToken,
    })

    saveAdminAuthSession(refreshed)
  })().finally(() => {
    refreshRequestInFlight = null
  })

  return refreshRequestInFlight
}

function throwApiError(
  status: number,
  payload: ApiEnvelope<unknown> | null,
  fallbackMessage: string
): never {
  throw new AdminAuthenticatedApiError(
    status,
    pickApiErrorMessage(payload, fallbackMessage)
  )
}

export async function requestAdminApiWithAutoRefresh<T>(
  path: string,
  init: RequestInit,
  options: RequestWithAuthOptions
): Promise<T> {
  const unauthorizedErrorMessage =
    options.unauthorizedErrorMessage ??
    '로그인이 만료되었습니다. 다시 로그인해 주세요.'

  const firstAttempt = await requestWithAuth<T>(path, init)

  if (firstAttempt.response.ok) {
    return toResponseData(firstAttempt.payload)
  }

  if (!isUnauthorizedStatus(firstAttempt.response.status)) {
    throwApiError(
      firstAttempt.response.status,
      firstAttempt.payload,
      options.fallbackErrorMessage
    )
  }

  try {
    await refreshAdminSession()
  } catch (error) {
    clearAdminAuthSession()

    if (error instanceof AdminAuthApiError) {
      throw new AdminAuthenticatedApiError(error.status, error.message)
    }

    if (error instanceof AdminAuthenticatedApiError) {
      throw error
    }

    throw new AdminAuthenticatedApiError(401, unauthorizedErrorMessage)
  }

  const retryAttempt = await requestWithAuth<T>(path, init)

  if (retryAttempt.response.ok) {
    return toResponseData(retryAttempt.payload)
  }

  if (isUnauthorizedStatus(retryAttempt.response.status)) {
    clearAdminAuthSession()
    throwApiError(
      retryAttempt.response.status,
      retryAttempt.payload,
      unauthorizedErrorMessage
    )
  }

  throwApiError(
    retryAttempt.response.status,
    retryAttempt.payload,
    options.fallbackErrorMessage
  )
}
