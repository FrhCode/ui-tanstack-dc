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
  useDeleteChannel,
  useLeaveServer,
  useMembers,
  useRenameChannel,
  useServer,
} from '#/hooks/useServerQueries'
import { useTheme } from '#/hooks/useTheme'
import { ApiError } from '#/lib/api'
import { cn } from '#/lib/utils'
import type { Channel } from '#/types'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  ChevronDown,
  Copy,
  Hash,
  Headphones,
  Mic,
  Moon,
  MoreVertical,
  Pencil,
  Plus,
  Settings,
  ShieldX,
  Sun,
  Trash2,
  Video,
} from 'lucide-react'
import { useRef, useState } from 'react'
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
  const { data: server, isLoading, isError, error } = useServer(serverId)
  const isForbidden =
    isError && error instanceof ApiError && error.statusCode === 403
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const leaveServer = useLeaveServer()
  const deleteChannel = useDeleteChannel(serverId)
  const renameChannel = useRenameChannel(serverId)
  const { data: members } = useMembers(serverId)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [editingChannelId, setEditingChannelId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

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

  function startRename(channelId: number, currentName: string) {
    setEditingChannelId(channelId)
    setEditName(currentName)
    setTimeout(() => renameInputRef.current?.focus(), 0)
  }

  async function submitRename(channelId: number) {
    const trimmed = editName.trim()
    if (!trimmed) {
      setEditingChannelId(null)
      return
    }
    try {
      await renameChannel.mutateAsync({ channelId, payload: { name: trimmed } })
      toast.success('Channel renamed')
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to rename channel')
    } finally {
      setEditingChannelId(null)
    }
  }

  async function handleDeleteChannel(channelId: number, channelName: string) {
    try {
      await deleteChannel.mutateAsync(channelId)
      toast.success(`#${channelName} deleted`)
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to delete channel')
    }
  }

  const isOwner = server?.ownerId === user?.id
  const currentMember = members?.find((m) => m.userId === user?.id)
  const canManage = isOwner || currentMember?.role === 'admin'

  return (
    <aside className="flex h-screen w-80 shrink-0 flex-col bg-slate-50 dark:bg-black/30">
      {/* Server header */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-12 w-full justify-between rounded-none border-b border-border px-4 font-semibold"
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
                <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(server.invite_code)
                  toast.success('Invite code copied!')
                }}
                className="text-xs"
              >
                <Copy className="mr-2 h-3 w-3" />
                Copy Invite Code
              </DropdownMenuItem>
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
          ) : isForbidden ? (
            <div className="flex flex-col items-center gap-2 px-2 py-4 text-center text-muted-foreground">
              <ShieldX className="h-6 w-6 opacity-40" />
              <p className="text-xs">
                You don&apos;t have access to this server.
              </p>
            </div>
          ) : (
            server?.channels.map((channel) => (
              <div key={channel.id} className="group relative">
                {editingChannelId === channel.id ? (
                  <div className="flex items-center gap-1 px-2 py-1">
                    <ChannelIcon type={channel.type} />
                    <Input
                      ref={renameInputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitRename(channel.id)
                        if (e.key === 'Escape') setEditingChannelId(null)
                      }}
                      onBlur={() => submitRename(channel.id)}
                      className="h-6 flex-1 px-1 text-xs"
                      maxLength={100}
                    />
                  </div>
                ) : (
                  <Link
                    to={channelPath(channel.id)}
                    className={cn(
                      'flex items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white',
                      '[&.active]:bg-slate-200 [&.active]:text-slate-900 dark:[&.active]:bg-white/10 dark:[&.active]:text-white',
                    )}
                    activeProps={{ className: 'active' }}
                  >
                    <ChannelIcon type={channel.type} />
                    <span className="flex-1 truncate">{channel.name}</span>
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="ml-auto rounded p-0.5 opacity-0 transition-opacity hover:bg-slate-300 group-hover:opacity-100 dark:hover:bg-white/20">
                            <MoreVertical className="h-3 w-3" />
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onSelect={() =>
                              startRename(channel.id, channel.name)
                            }
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleDeleteChannel(channel.id, channel.name)
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* User panel */}
      {user && (
        <div className="mx-1 rounded-lg px-2 py-2 transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-black" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user.name}
              </div>
              <div className="truncate text-xs text-slate-500 dark:text-white/50">
                {user.email}
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-white/60">
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                <Mic className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                <Headphones className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                    <Settings className="h-4 w-4" />
                  </button>
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
