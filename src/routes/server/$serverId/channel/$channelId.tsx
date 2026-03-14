import { useAuth } from '#/auth/AuthProvider'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import {
  useDeleteMessage,
  useEditMessage,
  useMessages,
  useSendMessage,
} from '#/hooks/useServerQueries'
import { ApiError } from '#/lib/api'
import type { Message } from '#/types'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Hash, Lock, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/server/$serverId/channel/$channelId')({
  component: RouteComponent,
})

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function MessageItem({
  message,
  isOwn,
  channelId,
}: {
  message: Message
  isOwn: boolean
  channelId: number
}) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const editMessage = useEditMessage(channelId)
  const deleteMessage = useDeleteMessage(channelId)

  async function handleEdit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editContent.trim() || editContent === message.content) {
      setEditing(false)
      return
    }
    try {
      await editMessage.mutateAsync({ id: message.id, content: editContent })
      setEditing(false)
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to edit message')
    }
  }

  async function handleDelete() {
    try {
      await deleteMessage.mutateAsync(message.id)
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to delete message')
    }
  }

  return (
    <div className="group relative flex gap-3 px-4 py-1 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
      <div className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {message.sender_name}
          </span>
          <span className="text-xs text-slate-400 dark:text-white/40">
            {formatTime(message.created_at)}
          </span>
          {message.modified_at !== message.created_at && (
            <span className="text-xs text-slate-400 dark:text-white/30">
              (edited)
            </span>
          )}
        </div>
        {editing ? (
          <form onSubmit={handleEdit} className="mt-1">
            <Input
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditing(false)
              }}
            />
            <div className="mt-1 flex gap-2">
              <Button
                type="submit"
                variant="link"
                size="xs"
                disabled={editMessage.isPending}
                className="h-auto p-0"
              >
                Save
              </Button>
              <span className="text-xs text-muted-foreground">·</span>
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={() => setEditing(false)}
                className="h-auto p-0 text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="wrap-break-word text-sm text-slate-700 dark:text-white/80">
            {message.content}
          </p>
        )}
      </div>
      {isOwn && !editing && (
        <div className="absolute right-4 top-1 hidden gap-1 group-hover:flex">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setEditContent(message.content)
              setEditing(true)
            }}
            aria-label="Edit message"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            disabled={deleteMessage.isPending}
            aria-label="Delete message"
            className="text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

function MessageInput({ channelId }: { channelId: number }) {
  const [content, setContent] = useState('')
  const sendMessage = useSendMessage(channelId)

  async function submit() {
    const trimmed = content.trim()
    if (!trimmed) return
    setContent('')
    try {
      await sendMessage.mutateAsync({ content: trimmed })
    } catch (err) {
      setContent(trimmed)
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to send message')
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    submit()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2">
      <div className="flex items-end gap-2 rounded-lg border-transparent bg-slate-100 px-4 py-2 dark:bg-white/[0.07]">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          maxLength={2000}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          style={{ maxHeight: '120px' }}
        />
        <Button
          type="submit"
          size="sm"
          disabled={sendMessage.isPending || !content.trim()}
          variant={content.trim() ? 'default' : 'ghost'}
        >
          Send
        </Button>
      </div>
    </form>
  )
}

function RouteComponent() {
  const { channelId: channelIdStr } = useParams({
    from: '/server/$serverId/channel/$channelId',
  })
  const channelId = Number(channelIdStr)
  const { user } = useAuth()
  const navigate = useNavigate()
  const bottomRef = useRef<HTMLDivElement>(null)
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(channelId)

  const allMessages = data?.pages.flatMap((page) => page) ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length])

  const isForbidden =
    isError && error instanceof ApiError && error.statusCode === 403

  if (isForbidden) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Lock className="h-12 w-12 opacity-30" />
        <div className="text-center">
          <p className="font-semibold text-slate-900 dark:text-white">
            Access Denied
          </p>
          <p className="mt-1 text-sm">
            You don&apos;t have permission to view this channel.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/' })}
        >
          Go Home
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-white text-slate-900 dark:bg-black/20 dark:text-white/90">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <Hash className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold">channel</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {hasNextPage && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load older messages'}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading messages...
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <Hash className="h-12 w-12 opacity-20" />
            <p className="font-semibold">No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          <>
            {(() => {
              let lastDate = ''
              return allMessages.map((msg) => {
                const dateLabel = formatDate(msg.created_at)
                const showDate = dateLabel !== lastDate
                lastDate = dateLabel
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {dateLabel}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    )}
                    <MessageItem
                      message={msg}
                      isOwn={msg.sender_id === user?.id}
                      channelId={channelId}
                    />
                  </div>
                )
              })
            })()}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput channelId={channelId} />
    </div>
  )
}
