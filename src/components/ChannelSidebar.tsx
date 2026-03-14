import { useAuth } from '#/auth/AuthProvider'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Input } from '#/components/ui/input'
import {
  useCreateChannel,
  useLeaveServer,
  useServer,
} from '#/hooks/useServerQueries'
import { useTheme } from '#/hooks/useTheme'
import { ApiError } from '#/lib/api'
import { cn } from '#/lib/utils'
import type { Channel } from '#/types'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  ChevronDown,
  Hash,
  Headphones,
  Mic,
  Moon,
  Plus,
  Settings,
  Sun,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function ChannelIcon({ type }: { type: Channel['type'] }) {
  if (type === 'mic') return <Mic className="h-4 w-4 shrink-0" />
  if (type === 'video') return <Video className="h-4 w-4 shrink-0" />
  return <Hash className="h-4 w-4 shrink-0" />
}

function CreateChannelForm({
  serverId,
  onDone,
}: {
  serverId: number
  onDone: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<Channel['type']>('message')
  const createChannel = useCreateChannel(serverId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await createChannel.mutateAsync({ name: name.trim(), type })
      toast.success(`#${name.trim()} created`)
      onDone()
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to create channel')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-2 mb-2 flex flex-col gap-2">
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="channel-name"
        maxLength={100}
        className="h-7 text-xs"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as Channel['type'])}
        className="rounded border border-border bg-background px-2 py-1 text-xs outline-none"
      >
        <option value="message">Text</option>
        <option value="mic">Voice</option>
        <option value="video">Video</option>
      </select>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={onDone}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="xs"
          disabled={createChannel.isPending || !name.trim()}
          className="flex-1"
        >
          Create
        </Button>
      </div>
    </form>
  )
}

export function ChannelSidebar() {
  const { serverId: serverIdStr } = useParams({ strict: false }) as {
    serverId?: string
  }
  const serverId = Number(serverIdStr)
  const { data: server, isLoading } = useServer(serverId)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const leaveServer = useLeaveServer()
  const [showCreateChannel, setShowCreateChannel] = useState(false)

  const channelPath = (channelId: number) =>
    `/server/${serverId}/channel/${channelId}`

  async function handleLeave() {
    try {
      await leaveServer.mutateAsync(serverId)
      toast.success('Left server')
      navigate({ to: '/server/dm' })
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to leave server')
    }
  }

  const isOwner = server?.ownerId === user?.id
  const canManage = isOwner

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r bg-slate-50 dark:bg-black/30">
      {/* Server header */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between rounded-none border-b border-border px-4 py-3 font-semibold"
          >
            <span className="truncate">
              {isLoading ? '...' : (server?.name ?? 'Server')}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {server && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Invite Code: {server.inviteCode}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {canManage && (
            <DropdownMenuItem onSelect={() => setShowCreateChannel(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Channel
            </DropdownMenuItem>
          )}
          {!isOwner && (
            <DropdownMenuItem
              onSelect={handleLeave}
              className="text-destructive focus:text-destructive"
            >
              Leave Server
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2">
          <div className="mb-1 flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Channels
            </span>
            {canManage && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowCreateChannel((v) => !v)}
                aria-label="Create channel"
              >
                <Plus className="text-muted-foreground" />
              </Button>
            )}
          </div>

          {showCreateChannel && (
            <CreateChannelForm
              serverId={serverId}
              onDone={() => setShowCreateChannel(false)}
            />
          )}

          {isLoading ? (
            <div className="space-y-1 px-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded bg-slate-200 dark:bg-white/10"
                />
              ))}
            </div>
          ) : (
            server?.channels.map((channel) => (
              <Link
                key={channel.id}
                to={channelPath(channel.id)}
                className={cn(
                  'flex items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white',
                  '[&.active]:bg-slate-200 [&.active]:text-slate-900 dark:[&.active]:bg-white/10 dark:[&.active]:text-white',
                )}
                activeProps={{ className: 'active' }}
              >
                <ChannelIcon type={channel.type} />
                <span className="truncate">{channel.name}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User panel */}
      {user && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-white/10" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-black" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm text-slate-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-white/50">
                Online
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon-sm">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Headphones className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={theme === 'light'}
                      onCheckedChange={() => toggleTheme('light')}
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={theme === 'dark'}
                      onCheckedChange={() => toggleTheme('dark')}
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async (event) => {
                      event.preventDefault()
                      try {
                        await logout()
                      } catch {
                        toast.error('Logout failed. Please try again.')
                      }
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
