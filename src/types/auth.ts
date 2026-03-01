export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface AuthUser {
  id: number
  name: string
  email: string
  age: number
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  age: number
  email: string
  password: string
}

export type RefreshPayload = {
  refreshToken: string
}
