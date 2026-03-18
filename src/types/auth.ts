export interface AuthResponse {
  user: AuthUser
}

export interface AuthUser {
  id: number
  name: string
  email: string
  age: number
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
