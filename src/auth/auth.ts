import { LOCAL_STORAGE_KEY } from '#/constant/localStorage'
import { request, Tokens } from '#/lib/api'
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '#/types/auth'
import { localStorageUtil } from '#/util/local-storage.util'

const register = async (payload: RegisterPayload) => {
  const authResponse = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    data: payload,
  })

  localStorageUtil.setItem(LOCAL_STORAGE_KEY.AUTH_TOKENS, {
    accessToken: authResponse.accessToken,
    refreshToken: authResponse.refreshToken,
  })

  return authResponse
}

const login = async (payload: LoginPayload) => {
  const authResponse = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    data: payload,
  })

  localStorageUtil.setItem(LOCAL_STORAGE_KEY.AUTH_TOKENS, {
    accessToken: authResponse.accessToken,
    refreshToken: authResponse.refreshToken,
  })

  return authResponse
}

const logout = async () => {
  try {
    await request('/auth/logout', {
      method: 'POST',
    })
  } finally {
    localStorageUtil.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKENS)
  }
}

const fetchMe = async () => {
  return request<AuthUser>('/auth/me')
}

const isAuthenticated = () => {
  const tokens = localStorageUtil.getItem<Tokens>(LOCAL_STORAGE_KEY.AUTH_TOKENS)
  return Boolean(tokens?.accessToken)
}

const authService = {
  register,
  login,
  logout,
  fetchMe,
  isAuthenticated,
}

export default authService
