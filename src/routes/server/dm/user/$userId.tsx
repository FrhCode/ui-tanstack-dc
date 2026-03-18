import { useAuth } from '#/auth/AuthProvider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useBlockUser } from '#/hooks/useBlocksQueries'
import {
  useAddDmReaction,
  useDeleteDm,
  useDmConversations,
  useDmMessages,
  useEditDm,
  useRemoveDmReaction,
  useSendDm,
} from '#/hooks/useDmQueries'
import { cn } from '#/lib/utils'
import type { DmMessage } from '#/types'
import { createFileRoute } from '@tanstack/react-router'
import {
  Download,
  File,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Phone,
  Reply,
  Search,
  Send,
  Trash2,
  Video,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/server/dm/user/$userId')({
  component: RouteComponent,
})

const PRESET_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function isImageUrl(attachment_type: string) {
  return attachment_type.startsWith('image/')
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileExtension(name: string) {
  return name.split('.').pop()?.toUpperCase() ?? 'FILE'
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function isSameDay(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

const MessageBubbleClasses = {
  own: 'bg-indigo-500 text-white rounded-2xl rounded-tr-sm',
  other:
    'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white/90 rounded-2xl rounded-tl-sm',
  deleted:
    'bg-indigo-500/50 text-white rounded-2xl rounded-tr-sm dark:bg-white/10 dark:text-white/90 rounded-tl-sm',
} as const

function buildReactionMap(
  reactions: DmMessage['reactions'],
  currentUserId: number,
) {
  const map: Record<string, { count: number; hasOwn: boolean }> = {}
  if (!reactions) return map

  for (const r of reactions) {
    if (!map[r.emoji]) {
      map[r.emoji] = { count: 0, hasOwn: false }
    }
    map[r.emoji].count++
    if (r.user_id === currentUserId) {
      map[r.emoji].hasOwn = true
    }
  }
  return map
}

function MessageAttachment({
  message,
  isOwn,
}: {
  message: DmMessage
  isOwn: boolean
}) {
  if (!message.attachment_url || !message.attachment_type) return null

  const isImage = isImageUrl(message.attachment_type)
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (isImage) {
    return (
      <img
        src={baseUrl + message.attachment_url}
        alt="attachment"
        className="max-w-xs max-h-48 rounded-lg object-cover"
      />
    )
  }

  return (
    <a
      href={baseUrl + message.attachment_url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 mt-1 min-w-[200px] transition-colors',
        isOwn
          ? 'bg-indigo-600/50 hover:bg-indigo-600/70'
          : 'bg-slate-300/60 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold',
          isOwn
            ? 'bg-white/20 text-white'
            : 'bg-slate-400/30 dark:bg-white/20 text-slate-700 dark:text-white',
        )}
      >
        {message.attachment_name ? (
          getFileExtension(message.attachment_name)
        ) : (
          <File size={16} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-xs font-medium truncate',
            isOwn ? 'text-white' : 'text-slate-900 dark:text-white',
          )}
        >
          {message.attachment_name ?? 'attachment'}
        </div>
        <div
          className={cn(
            'text-[11px] mt-0.5',
            isOwn ? 'text-white/60' : 'text-slate-500 dark:text-white/50',
          )}
        >
          {message.attachment_name
            ? getFileExtension(message.attachment_name)
            : ''}
          {message.attachment_size
            ? ` · ${formatFileSize(message.attachment_size)}`
            : ''}
        </div>
      </div>
      <Download
        size={16}
        className={cn(
          'shrink-0',
          isOwn ? 'text-white/70' : 'text-slate-500 dark:text-white/50',
        )}
      />
    </a>
  )
}

function QuotedMessage({
  ref,
  isOwn,
  onScrollToMessage,
}: {
  ref: { id: number; content?: string | null; sender_name: string }
  isOwn: boolean
  onScrollToMessage: (id: number) => void
}) {
  return (
    <div
      onClick={() => {
        console.log('brow', ref)

        ref.id && onScrollToMessage(ref.id)
      }}
      className={cn(
        'mb-2 border-l-2 pl-2 rounded-sm text-xs opacity-80',
        isOwn
          ? 'border-white/60 bg-white/10'
          : 'border-indigo-400 bg-slate-100 dark:bg-white/5',
        ref.id && 'cursor-pointer hover:opacity-100 transition-opacity',
      )}
    >
      <div className="font-semibold mb-0.5">{ref.sender_name}</div>
      <div className="truncate">
        {ref.content ?? (
          <span className="italic">This message was deleted</span>
        )}
      </div>
    </div>
  )
}

function ReactionsDisplay({
  reactionMap,
  onReaction,
}: {
  reactionMap: Record<string, { count: number; hasOwn: boolean }>
  onReaction: (emoji: string) => void
}) {
  if (Object.keys(reactionMap).length === 0) return null

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {Object.entries(reactionMap).map(
        ([emoji, { count, hasOwn: hasOwnReaction }]) => (
          <button
            key={emoji}
            onClick={() => onReaction(emoji)}
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition cursor-pointer',
              hasOwnReaction
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40'
                : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/70 hover:bg-slate-300 dark:hover:bg-white/20',
            )}
          >
            <span>{emoji}</span>
            <span>{count}</span>
          </button>
        ),
      )}
    </div>
  )
}

function DeletedMessageBubble({ isOwn }: { isOwn: boolean }) {
  return (
    <div
      className={cn(
        'px-3 py-2 text-sm italic opacity-60',
        isOwn
          ? 'bg-indigo-500/50 text-white rounded-2xl rounded-tr-sm'
          : 'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white/90 rounded-2xl rounded-tl-sm',
      )}
    >
      This message was deleted
    </div>
  )
}

function EditMessageForm({
  content,
  onContentChange,
  onSave,
  onCancel,
}: {
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="w-64">
      <textarea
        className="w-full rounded bg-slate-100 dark:bg-white/10 px-3 py-2 text-sm outline-none resize-none text-slate-900 dark:text-white"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSave()
          }
          if (e.key === 'Escape') onCancel()
        }}
        rows={2}
        autoFocus
      />
      <div className="mt-1 flex gap-2 text-xs">
        <button onClick={onSave} className="text-indigo-500 hover:underline">
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:underline dark:text-white/50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function MessageContextMenu({
  message,
  isOwn,
  onReply,
  onReaction,
  onEdit,
  onDelete,
}: {
  message: DmMessage
  isOwn: boolean
  onReply: (msg: DmMessage) => void
  onReaction: (emoji: string) => void
  onEdit: () => void
  onDelete: (mode: 'for_me' | 'for_everyone') => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="self-start opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded p-1 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 shrink-0">
          <MoreHorizontal size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isOwn ? 'end' : 'start'}
        className="min-w-42.5"
      >
        {/* Reaction row */}
        <div className="flex gap-1 px-2 py-1.5 border-b border-slate-100 dark:border-white/10">
          {PRESET_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReaction(emoji)}
              className="rounded px-1 py-0.5 text-base hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              {emoji}
            </button>
          ))}
        </div>

        {!message.is_deleted && (
          <DropdownMenuItem onClick={() => onReply(message)}>
            <Reply size={14} className="mr-2" />
            Reply
          </DropdownMenuItem>
        )}

        {isOwn && !message.is_deleted && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil size={14} className="mr-2" />
            Edit
          </DropdownMenuItem>
        )}

        {isOwn && !message.is_deleted && (
          <DropdownMenuItem
            onClick={() => onDelete('for_everyone')}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 size={14} className="mr-2" />
            Delete for everyone
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => onDelete('for_me')}
          className="text-red-500 focus:text-red-500"
        >
          <Trash2 size={14} className="mr-2" />
          Delete for me
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DmMessageItem({
  message,
  conversationId,
  currentUserId,
  onReply,
  onScrollToMessage,
  isHighlighted,
  messageRef,
}: {
  message: DmMessage
  conversationId: number
  currentUserId: number
  onReply: (msg: DmMessage) => void
  onScrollToMessage: (id: number) => void
  isHighlighted: boolean
  messageRef: (el: HTMLDivElement | null) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content ?? '')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMode, setDeleteMode] = useState<'for_me' | 'for_everyone'>(
    'for_everyone',
  )

  const editDm = useEditDm(conversationId)
  const deleteDm = useDeleteDm(conversationId)
  const addReaction = useAddDmReaction(conversationId)
  const removeReaction = useRemoveDmReaction(conversationId)

  const isOwn = message.sender_id === currentUserId
  const isEdited =
    message.modified_at && message.modified_at !== message.created_at
  const reactionMap = buildReactionMap(message.reactions, currentUserId)

  async function handleSaveEdit() {
    if (!editContent.trim() || editContent === message.content) {
      setEditing(false)
      return
    }
    try {
      await editDm.mutateAsync({ id: message.id, content: editContent })
      setEditing(false)
    } catch {
      toast.error('Could not edit message')
    }
  }

  async function handleDelete() {
    try {
      await deleteDm.mutateAsync({ messageId: message.id, mode: deleteMode })
    } catch {
      toast.error('Could not delete message')
    }
  }

  async function handleReaction(emoji: string) {
    const existing = message.reactions?.find(
      (r) => r.emoji === emoji && r.user_id === currentUserId,
    )
    try {
      if (existing) {
        await removeReaction.mutateAsync({ messageId: message.id, emoji })
      } else {
        await addReaction.mutateAsync({ messageId: message.id, emoji })
      }
    } catch {
      toast.error('Could not update reaction')
    }
  }

  return (
    <>
      <div
        ref={messageRef}
        className={cn(
          'flex items-end gap-2 group px-4 py-1 rounded-lg transition-colors',
          isOwn ? 'flex-row-reverse' : 'flex-row',
          isHighlighted && 'animate-message-highlight',
        )}
      >
        {/* Avatar — only for others */}
        {!isOwn && (
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0 mb-0.5">
            {message.sender_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          className={cn(
            'flex flex-col max-w-[70%]',
            isOwn ? 'items-end' : 'items-start',
          )}
        >
          {/* Bubble */}
          {message.is_deleted ? (
            <DeletedMessageBubble isOwn={isOwn} />
          ) : editing ? (
            <EditMessageForm
              content={editContent}
              onContentChange={setEditContent}
              onSave={handleSaveEdit}
              onCancel={() => {
                setEditing(false)
                setEditContent(message.content ?? '')
              }}
            />
          ) : (
            <div
              className={cn(
                'px-3 py-2 text-sm wrap-break-word',
                isOwn ? MessageBubbleClasses.own : MessageBubbleClasses.other,
              )}
            >
              {/* Reply / quoted message block */}
              {(() => {
                const quoted =
                  message.reply_preview ??
                  (message.quoted_content
                    ? {
                        id: 0,
                        content: message.quoted_content,
                        sender_name: message.quoted_sender_name ?? '',
                      }
                    : null)
                return quoted ? (
                  <QuotedMessage
                    ref={quoted}
                    isOwn={isOwn}
                    onScrollToMessage={onScrollToMessage}
                  />
                ) : null
              })()}

              {message.content ?? ''}

              {/* Inline time */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 ml-2 align-bottom text-[10px] float-right mt-1',
                  isOwn ? 'text-white/60' : 'text-slate-400 dark:text-white/40',
                )}
              >
                {isEdited && <span>(edited)</span>}
                {formatTime(message.created_at)}
              </span>

              {/* Attachment */}
              {message.attachment_url && message.attachment_type && (
                <div className="mt-2">
                  <MessageAttachment message={message} isOwn={isOwn} />
                </div>
              )}
            </div>
          )}

          <ReactionsDisplay
            reactionMap={reactionMap}
            onReaction={handleReaction}
          />
        </div>

        {/* Context menu trigger — visible on hover */}
        {!editing && (
          <MessageContextMenu
            message={message}
            isOwn={isOwn}
            onReply={onReply}
            onReaction={handleReaction}
            onEdit={() => setEditing(true)}
            onDelete={(mode) => {
              setDeleteMode(mode)
              setDeleteOpen(true)
            }}
          />
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteMode === 'for_everyone'
                ? 'Delete this message for everyone? This cannot be undone.'
                : 'Hide this message from your view? It will still be visible to others.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function RouteComponent() {
  const { userId } = Route.useParams()
  const conversationId = parseInt(userId, 10)
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [replyTo, setReplyTo] = useState<DmMessage | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (!replyTo) return
    // The dropdown menu steals focus multiple times as it unmounts.
    // Re-focus the input on every animation frame for a short window.
    let rafId: number
    const start = Date.now()
    const keepFocus = () => {
      if (Date.now() - start > 300) return
      inputRef.current?.focus()
      rafId = requestAnimationFrame(keepFocus)
    }
    rafId = requestAnimationFrame(keepFocus)
    return () => cancelAnimationFrame(rafId)
  }, [replyTo])

  const scrollToMessage = useCallback((id: number) => {
    const el = messageRefs.current.get(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightedMessageId(id)
    setTimeout(() => setHighlightedMessageId(null), 1600)
  }, [])

  const { data: conversations = [] } = useDmConversations()
  const conversation = conversations.find((c) => c.id === conversationId)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDmMessages(conversationId)

  const sendDm = useSendDm(conversationId)
  const blockUser = useBlockUser()

  const allMessages = data?.pages.flatMap((p) => p) ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [allMessages.length])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  async function handleSend() {
    const trimmed = content.trim()
    if (!trimmed && !attachment) return
    setContent('')
    const payload = {
      ...(trimmed ? { content: trimmed } : {}),
      ...(attachment ? { attachment } : {}),
      ...(replyTo
        ? {
            reply_to_message_id: replyTo.id,
            quoted_content: replyTo.content ?? undefined,
            quoted_sender_name: replyTo.sender_name,
          }
        : {}),
    }
    setReplyTo(null)
    setAttachment(null)
    try {
      await sendDm.mutateAsync(payload)
    } catch {
      toast.error('Could not send message')
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large. Maximum size is 10MB.')
      return
    }
    setAttachment(file)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  async function handleBlock() {
    if (!conversation) return
    try {
      await blockUser.mutateAsync({ blocked_id: conversation.partner.id })
      toast.success(`Blocked ${conversation.partner.name}`)
    } catch {
      toast.error('Could not block user')
    }
  }

  const username = conversation?.partner.name ?? `User ${conversationId}`

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-black/20 dark:text-white/90">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold">{username}</div>
            <div className="text-xs text-slate-500 dark:text-white/50">
              {username}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-white/60">
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <Video className="h-4 w-4" />
          </button>
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <Search className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onSelect={handleBlock}
              >
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4"
      >
        {isFetchingNextPage && (
          <div className="px-4 py-2 text-center text-xs text-slate-400 dark:text-white/40">
            Loading older messages...
          </div>
        )}

        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-white/40">
            Loading...
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{username}</div>
              <p className="text-sm text-slate-500 dark:text-white/50 mt-1">
                This is the beginning of your direct message history with{' '}
                <span className="font-medium">{username}</span>.
              </p>
            </div>
          </div>
        ) : (
          <>
            {allMessages.map((msg, i) => {
              const prev = allMessages[i - 1]
              const showDate =
                !prev || !isSameDay(prev.created_at, msg.created_at)
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      <span className="text-xs uppercase text-slate-500 dark:text-white/50">
                        {formatDate(msg.created_at)}
                      </span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>
                  )}
                  <DmMessageItem
                    message={msg}
                    conversationId={conversationId}
                    currentUserId={user?.id ?? 0}
                    onReply={setReplyTo}
                    onScrollToMessage={scrollToMessage}
                    isHighlighted={highlightedMessageId === msg.id}
                    messageRef={(el) => {
                      if (el) messageRefs.current.set(msg.id, el)
                      else messageRefs.current.delete(msg.id)
                    }}
                  />
                </div>
              )
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 pb-6 pt-2">
        {/* Reply preview */}
        {replyTo && (
          <div className="mb-1 flex items-center gap-2 rounded-t-lg border-l-2 border-indigo-500 bg-slate-100 dark:bg-white/5 px-3 py-1.5">
            <Reply size={13} className="text-indigo-500 shrink-0" />
            <div className="flex-1 min-w-0 text-xs text-slate-600 dark:text-white/60">
              <span className="font-semibold text-slate-800 dark:text-white/80">
                {replyTo.sender_name}
              </span>
              <span className="mx-1">·</span>
              <span className="truncate italic">
                {replyTo.content ?? 'This message was deleted'}
              </span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Attachment preview */}
        {attachment && (
          <div className="mb-1 flex items-center gap-2 rounded-t-lg bg-slate-100 dark:bg-white/5 px-3 py-1.5">
            <Paperclip
              size={13}
              className="text-slate-500 dark:text-white/50 shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs text-slate-600 dark:text-white/60 truncate">
              {attachment.name}
              <span className="ml-1 text-slate-400 dark:text-white/30">
                ({(attachment.size / 1024).toFixed(0)} KB)
              </span>
            </div>
            <button
              onClick={() => setAttachment(null)}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60"
            >
              <X size={13} />
            </button>
          </div>
        )}

        <div
          className={cn(
            'flex items-end gap-2 bg-slate-100 dark:bg-white/[0.07] px-4 py-2',
            replyTo || attachment ? 'rounded-b-lg' : 'rounded-lg',
          )}
        >
          {/* File attachment button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition-colors mb-0.5"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />

          <textarea
            ref={inputRef}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/30 text-slate-900 dark:text-white max-h-32"
            placeholder={`Message @${username}`}
            value={content}
            rows={1}
            onChange={(e) => {
              setContent(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight}px`
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={(!content.trim() && !attachment) || sendDm.isPending}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded transition',
              content.trim() || attachment
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'text-slate-400 dark:text-white/30',
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
