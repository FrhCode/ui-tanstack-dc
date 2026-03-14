import { ChannelSidebar } from '#/components/ChannelSidebar'
import { MemberSidebar } from '#/components/MemberSidebar'
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/server/$serverId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { serverId } = useParams({ from: '/server/$serverId' })
  return (
    <>
      <ChannelSidebar />
      <main className="flex flex-1 overflow-hidden">
        <Outlet />
      </main>

      <MemberSidebar serverId={Number(serverId)} />
    </>
  )
}
