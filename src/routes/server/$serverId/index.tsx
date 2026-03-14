import { useServer } from '#/hooks/useServerQueries'
import {
  createFileRoute,
  Navigate,
  useParams,
} from '@tanstack/react-router'

export const Route = createFileRoute('/server/$serverId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { serverId: serverIdStr } = useParams({ from: '/server/$serverId/' })
  const serverId = Number(serverIdStr)
  const { data: server, isLoading } = useServer(serverId)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  const firstTextChannel = server?.channels.find((c) => c.type === 'message')

  if (firstTextChannel) {
    return (
      <Navigate
        to="/server/$serverId/channel/$channelId"
        params={{ serverId: serverIdStr, channelId: String(firstTextChannel.id) }}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
      <p className="text-lg font-semibold">No channels yet</p>
      <p className="text-sm">Create a channel to get started.</p>
    </div>
  )
}
