import { ChannelSidebar } from '#/components/ChannelSidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/server/$serverId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ChannelSidebar />
      <main className="flex flex-1 overflow-hidden">
        <Outlet />
      </main>
    </>
  )
}
