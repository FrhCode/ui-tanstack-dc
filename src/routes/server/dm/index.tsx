import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/server/dm/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/server/dm/friends" />
}
