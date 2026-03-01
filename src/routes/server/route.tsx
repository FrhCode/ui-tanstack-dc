import { ServerSelection } from '#/components/ServerSelection'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/server')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <aside className="w-16 shrink-0 border-r ">
        <ServerSelection />
      </aside>
      <Outlet />
    </div>
  )
}
