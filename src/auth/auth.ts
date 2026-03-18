import { request } from '#/lib/api'
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '#/types/auth'

const register = async (payload: RegisterPayload) => {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    data: payload,
  })
}

const login = async (payload: LoginPayload) => {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    data: payload,
  })
}

const logout = async () => {
  await request('/auth/logout', {
    method: 'POST',
  })
}

const fetchMe = async () => {
  return request<AuthUser>('/auth/me')
}

const authService = {
  register,
  login,
  logout,
  fetchMe,
}

export default authService
