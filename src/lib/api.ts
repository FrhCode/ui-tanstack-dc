import { LOCAL_STORAGE_KEY } from '#/constant/localStorage'
import { localStorageUtil } from '#/util/local-storage.util'
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'

export type ApiEnvelope<T> = {
  statusCode: number
  requestId: string
  message: string
  data: T
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type ApiErrorResponse = {
  statusCode: number
  message: string
  requestId: string
  errors?: unknown // keep if your backend sometimes provides it
}

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

// Main API client
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Naked client for refresh (no interceptors -> no recursion)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const isAuthEndpoint = (url?: string) =>
  !!url && (url.startsWith('/auth/refresh') || url.startsWith('/auth/login'))

let refreshInFlight: Promise<Tokens> | null = null

async function refreshTokens(): Promise<Tokens> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const current = localStorageUtil.getItem<Tokens>(
      LOCAL_STORAGE_KEY.AUTH_TOKENS,
    )
    if (!current?.refreshToken) {
      throw new Error('No refresh token available')
    }

    // Your refresh endpoint must also follow the envelope format.
    const res = await refreshClient.post<ApiEnvelope<Tokens>>('/auth/refresh', {
      refreshToken: current.refreshToken,
    })

    const tokens: Tokens = {
      accessToken: res.data.data.accessToken,
      // eslint-disable-next-line
      refreshToken: res.data.data.refreshToken ?? current.refreshToken,
    }

    localStorageUtil.setItem(LOCAL_STORAGE_KEY.AUTH_TOKENS, tokens)
    return tokens
  })()

  try {
    return await refreshInFlight
  } catch (e) {
    localStorageUtil.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKENS)
    throw e
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

// Attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!isAuthEndpoint(config.url)) {
    const token = localStorageUtil.getItem<Tokens>(
      LOCAL_STORAGE_KEY.AUTH_TOKENS,
    )
    if (token?.accessToken) {
      // eslint-disable-next-line
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token.accessToken}`
    }
  }
  return config
})

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
      const tokens = await refreshTokens()
      original.headers = original.headers ?? {}
      ;(original.headers as any).Authorization = `Bearer ${tokens.accessToken}`
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
