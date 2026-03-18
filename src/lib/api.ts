import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

export type ApiEnvelope<T> = {
  statusCode: number
  requestId: string
  message: string
  data: T
}

export type ApiErrorResponse = {
  statusCode: number
  message: string
  requestId: string
  errors?: unknown
}

// In dev, direct URL is used with withCredentials=true + backend CORS config.
// In prod, same domain so VITE_API_BASE_URL can be empty or the same origin.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export class ApiError extends Error {
  statusCode: number
  requestId: string
  errors?: unknown

  constructor(response: ApiErrorResponse) {
    super(response.message)
    this.statusCode = response.statusCode
    this.requestId = response.requestId
    this.errors = response.errors
  }
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

// Main API client
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Naked client for refresh (no interceptors -> no recursion)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach CSRF token for mutating requests
api.interceptors.request.use((config) => {
  if (!SAFE_METHODS.has((config.method ?? 'get').toUpperCase())) {
    const token = getCsrfToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers['x-csrf-token'] = token
    }
  }
  return config
})

const isAuthEndpoint = (url?: string) =>
  !!url && (url.startsWith('/auth/refresh') || url.startsWith('/auth/login'))

let refreshInFlight: Promise<void> | null = null

async function refreshTokens(): Promise<void> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    // Cookies are sent automatically — no body needed
    await refreshClient.post<ApiEnvelope<void>>('/auth/refresh')
  })()

  try {
    return await refreshInFlight
  } finally {
    refreshInFlight = null
  }
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const statusCode = err.response?.status ?? 0
    const data = err.response?.data as Partial<ApiEnvelope<unknown>> | undefined

    return new ApiError({
      statusCode,
      message: data?.message ?? err.message,
      requestId: data?.requestId ?? '',
      errors: data?.data,
    })
  }
  if (err && typeof err === 'object' && 'message' in err) {
    return new ApiError({
      statusCode: (err as any).statusCode ?? 0,
      message: (err as any).message,
      requestId: '',
    })
  }

  return new ApiError({
    statusCode: 0,
    message: 'Unknown error',
    requestId: '',
  })
}

// Refresh on 401, retry once
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retried?: boolean })
      | undefined
    const status = error.response?.status

    if (!original) throw toApiError(error)

    if (status !== 401 || original._retried || isAuthEndpoint(original.url)) {
      throw toApiError(error)
    }

    original._retried = true

    try {
      await refreshTokens()
      return api.request(original)
    } catch (e) {
      throw toApiError(e)
    }
  },
)

// The simple typed wrapper: always returns `envelope.data`
export async function request<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const res = await api.request<ApiEnvelope<T>>({
      url: endpoint,
      ...config,
    })

    return res.data.data
  } catch (e) {
    throw toApiError(e)
  }
}
