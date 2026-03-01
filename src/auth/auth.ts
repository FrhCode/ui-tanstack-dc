import type { ApiResponse } from '#/types'
import type {
  AuthResponse,
  AuthTokens,
  AuthUser,
  LoginPayload,
  RefreshPayload,
  RegisterPayload,
} from '#/types/auth'
import { localStorageUtil } from '#/util/local-storage.util'

const TOKEN_STORAGE_KEY = 'auth_tokens'

const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL
  return baseUrl ? baseUrl.replace(/\/$/, '') : ''
}

const resolveUrl = (path: string) => {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) {
    return path
  }
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export const authStorage = {
  getTokens: (): AuthTokens | null =>
    localStorageUtil.getItem<AuthTokens>(TOKEN_STORAGE_KEY),
  setTokens: (tokens: AuthTokens) =>
    localStorageUtil.setItem(TOKEN_STORAGE_KEY, tokens),
  clearTokens: () => localStorageUtil.setItem(TOKEN_STORAGE_KEY, null),
}

class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const request = async <T>(
  path: string,
  options: Omit<RequestInit, 'body' | 'headers'> & {
    body?: unknown
    auth?: boolean
  } = {},
): Promise<ApiResponse<T>> => {
  const { body, auth = false, ...rest } = options
  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (auth) {
    const tokens = authStorage.getTokens()
    if (tokens?.accessToken) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    }
  }

  const response = await fetch(resolveUrl(path), {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new HttpError(response.status, errorText || 'Request failed')
  }

  return (await response.json()) as ApiResponse<T>
}

const requestWithRefresh = async <T>(
  path: string,
  options: Omit<RequestInit, 'body' | 'headers'> & {
    body?: unknown
  } = {},
): Promise<ApiResponse<T>> => {
  try {
    return await request<T>(path, { ...options, auth: true })
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401) {
      throw error
    }

    const tokens = authStorage.getTokens()
    if (!tokens?.refreshToken) {
      throw error
    }

    const refreshed = await refresh({ refreshToken: tokens.refreshToken })
    authStorage.setTokens(refreshed)

    return request<T>(path, { ...options, auth: true })
  }
}

export const register = async (payload: RegisterPayload) => {
  const authResponse = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })

  localStorageUtil.setItem(TOKEN_STORAGE_KEY, {
    accessToken: authResponse.data.accessToken,
    refreshToken: authResponse.data.refreshToken,
  })

  return authResponse
}

export const login = async (payload: LoginPayload) => {
  const authResponse = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })

  localStorageUtil.setItem(TOKEN_STORAGE_KEY, {
    accessToken: authResponse.data.accessToken,
    refreshToken: authResponse.data.refreshToken,
  })

  return authResponse
}

export const refresh = async (payload: RefreshPayload) => {
  const authResponse = await request<AuthResponse>('/auth/refresh', {
    method: 'POST',
    body: payload,
  })

  const tokens: AuthTokens = {
    accessToken: authResponse.data.accessToken,
    refreshToken: authResponse.data.refreshToken,
  }

  authStorage.setTokens(tokens)

  return tokens
}

export const logout = async () => {
  try {
    await request('/auth/logout', { method: 'POST', auth: true })
  } finally {
    authStorage.clearTokens()
  }
}

export const fetchMe = async () => {
  return requestWithRefresh<AuthUser>('/auth/me', { method: 'GET' })
}

export const isAuthenticated = () => {
  const tokens = authStorage.getTokens()
  return Boolean(tokens?.accessToken)
}
