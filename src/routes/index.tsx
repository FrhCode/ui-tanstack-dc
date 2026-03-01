import { useAuth } from '#/auth/AuthProvider'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-screen" />
  }

  return isAuthenticated ? (
    <Navigate to="/server/dm" />
  ) : (
    <Navigate to="/login" />
  )
}
