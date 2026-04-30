export type AdminLoginRequest = {
  adminId: string
  password: string
}

export type AdminLoginResponse = {
  tokenType: string
  accessToken: string
  refreshToken: string
  accessExpiresInSec: number
  refreshExpiresInSec: number
  requiresPasswordChange?: boolean
  reason?: string
  passwordChangeToken?: string
}

export class AdminAuthApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'AdminAuthApiError'
    this.status = status
  }
}

const ADMIN_LOGIN_PATH = '/api/v1/admin/auth/login'

function buildApiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

  if (baseUrl.length === 0) {
    return path
  }

  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

function pickErrorMessage(payload: unknown, status: number): string {
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

  if (status === 401 || status === 403) {
    return '아이디 또는 비밀번호를 확인해 주세요.'
  }

  if (status >= 500) {
    return '로그인 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  }

  return '로그인 요청에 실패했습니다.'
}

function normalizeLoginResponse(data: unknown): AdminLoginResponse {
  if (!data || typeof data !== 'object') {
    throw new AdminAuthApiError(500, '로그인 응답 형식이 올바르지 않습니다.')
  }

  const envelopeData = (data as { data?: unknown }).data
  const source =
    envelopeData && typeof envelopeData === 'object' ? envelopeData : data

  const accessToken = (source as { accessToken?: unknown }).accessToken
  const refreshToken = (source as { refreshToken?: unknown }).refreshToken

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new AdminAuthApiError(500, '로그인 응답에 토큰 정보가 없습니다.')
  }

  const tokenType = (source as { tokenType?: unknown }).tokenType
  const accessExpiresInSec = (source as { accessExpiresInSec?: unknown })
    .accessExpiresInSec
  const refreshExpiresInSec = (source as { refreshExpiresInSec?: unknown })
    .refreshExpiresInSec
  const requiresPasswordChange = (
    source as { requiresPasswordChange?: unknown }
  ).requiresPasswordChange
  const reason = (source as { reason?: unknown }).reason
  const passwordChangeToken = (source as { passwordChangeToken?: unknown })
    .passwordChangeToken

  return {
    tokenType: typeof tokenType === 'string' ? tokenType : 'Bearer',
    accessToken,
    refreshToken,
    accessExpiresInSec:
      typeof accessExpiresInSec === 'number' ? accessExpiresInSec : 0,
    refreshExpiresInSec:
      typeof refreshExpiresInSec === 'number' ? refreshExpiresInSec : 0,
    requiresPasswordChange:
      typeof requiresPasswordChange === 'boolean'
        ? requiresPasswordChange
        : undefined,
    reason: typeof reason === 'string' ? reason : undefined,
    passwordChangeToken:
      typeof passwordChangeToken === 'string' ? passwordChangeToken : undefined,
  }
}

export async function loginAdmin(
  request: AdminLoginRequest
): Promise<AdminLoginResponse> {
  const response = await fetch(buildApiUrl(ADMIN_LOGIN_PATH), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(request),
  })

  const responsePayload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new AdminAuthApiError(
      response.status,
      pickErrorMessage(responsePayload, response.status)
    )
  }

  return normalizeLoginResponse(responsePayload)
}
