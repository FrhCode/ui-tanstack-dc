import authService from '#/auth/auth'
import type { AuthUser, LoginPayload, RegisterPayload } from '#/types/auth'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const me = await authService.fetchMe()
      setUser(me)
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: Boolean(user) || authService.isAuthenticated(),
    login: async (payload) => {
      try {
        setIsLoading(true)
        await authService.login(payload)
        await loadUser()
      } finally {
        setIsLoading(false)
      }
    },
    register: async (payload) => {
      try {
        setIsLoading(true)
        await authService.register(payload)
        await loadUser()
      } finally {
        setIsLoading(false)
      }
    },
    logout: async () => {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
      setIsLoading(false)
    },
    refreshUser: loadUser,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
