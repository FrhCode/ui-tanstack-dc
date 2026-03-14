import { useAuth } from '#/auth/AuthProvider'
import { ServerSelection } from '#/components/ServerSelection'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/server')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-screen" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex h-screen overflow-hidden min-w-212.5">
      <aside className="w-16 shrink-0 border-r bg-slate-50 dark:bg-black/30">
        <ServerSelection />
      </aside>
      <Outlet />
    </div>
  )
}
