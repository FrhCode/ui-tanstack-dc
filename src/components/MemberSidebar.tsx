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
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  useKickMember,
  useMembers,
  useServer,
  useTransferOwnership,
  useUpdateMemberRole,
} from '#/hooks/useServerQueries'
import { ApiError } from '#/lib/api'
import type { Member } from '#/types'
import { Crown, MoreVertical, Shield } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function MemberAvatar({ name, userId }: { name?: string; userId: number }) {
  const letter = name ? name.charAt(0).toUpperCase() : String(userId).charAt(0)
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
      {letter}
    </div>
  )
}

function KickConfirmDialog({
  memberName,
  onConfirm,
  children,
}: {
  memberName: string
  onConfirm: () => void
  children: React.ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kick {memberName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {memberName} from the server. They can rejoin with
            an invite code.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Kick</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function TransferConfirmDialog({
  memberName,
  onConfirm,
  children,
}: {
  memberName: string
  onConfirm: () => void
  children: React.ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Transfer ownership to {memberName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will lose owner privileges. {memberName} will become the new
            server owner. This cannot be undone without their cooperation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Transfer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function MemberRow({
  member,
  isOwner,
  currentUserIsOwner,
  currentUserIsAdmin,
  serverId,
}: {
  member: Member
  isOwner: boolean
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  serverId: number
}) {
  const [open, setOpen] = useState(false)
  const kickMember = useKickMember(serverId)
  const updateRole = useUpdateMemberRole(serverId)
  const transferOwnership = useTransferOwnership(serverId)

  const displayName = member.username ?? `User #${member.user_id}`
  const canAct = (currentUserIsOwner || currentUserIsAdmin) && !isOwner
  const canTransfer = currentUserIsOwner && !isOwner

  async function handleKick() {
    try {
      await kickMember.mutateAsync(member.user_id)
      toast.success(`${displayName} was kicked`)
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to kick member')
    }
  }

  async function handleToggleRole() {
    const newRole = member.role === 'admin' ? 'member' : 'admin'
    try {
      await updateRole.mutateAsync({
        userId: member.user_id,
        payload: { role: newRole },
      })
      toast.success(`${displayName} is now ${newRole}`)
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to update role')
    }
  }

  async function handleTransfer() {
    try {
      await transferOwnership.mutateAsync(member.user_id)
      toast.success(`Ownership transferred to ${displayName}`)
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Failed to transfer ownership')
    }
  }

  return (
    <div className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5">
      <MemberAvatar name={member.username} userId={member.user_id} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 truncate text-sm font-medium text-slate-900 dark:text-white">
          <span className="truncate">{displayName}</span>
          {isOwner && <Crown className="h-3 w-3 shrink-0 text-yellow-500" />}
          {!isOwner && member.role === 'admin' && (
            <Shield className="h-3 w-3 shrink-0 text-blue-400" />
          )}
        </div>
        <div className="text-xs text-slate-500 dark:text-white/40">
          {isOwner ? 'Owner' : member.role === 'admin' ? 'Admin' : 'Member'}
        </div>
      </div>

      {canAct && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 opacity-0 transition-opacity hover:bg-slate-200 group-hover:opacity-100 dark:hover:bg-white/10">
              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setOpen(false)
                handleToggleRole()
              }}
            >
              {member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </DropdownMenuItem>
            {canTransfer && (
              <>
                <DropdownMenuSeparator />
                <TransferConfirmDialog
                  memberName={displayName}
                  onConfirm={() => {
                    setOpen(false)
                    handleTransfer()
                  }}
                >
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-yellow-600 focus:text-yellow-600"
                  >
                    Transfer Ownership
                  </DropdownMenuItem>
                </TransferConfirmDialog>
              </>
            )}
            <DropdownMenuSeparator />
            <KickConfirmDialog
              memberName={displayName}
              onConfirm={() => {
                setOpen(false)
                handleKick()
              }}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                Kick
              </DropdownMenuItem>
            </KickConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export function MemberSidebar({ serverId }: { serverId: number }) {
  const { user } = useAuth()
  const { data: server } = useServer(serverId)
  const { data: members, isLoading } = useMembers(serverId)

  const currentMember = members?.find((m) => m.user_id === user?.id)
  const currentUserIsOwner = server?.ownerId === user?.id
  const currentUserIsAdmin =
    currentUserIsOwner || currentMember?.role === 'admin'

  const sorted = members
    ? [...members].sort((a, b) => {
        const rank = (m: Member) => {
          if (m.user_id === server?.ownerId) return 0
          if (m.role === 'admin') return 1
          return 2
        }
        return rank(a) - rank(b)
      })
    : []

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-slate-50 dark:bg-black/20">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Members{members ? ` — ${members.length}` : ''}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {isLoading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded bg-slate-200 dark:bg-white/10"
              />
            ))}
          </div>
        ) : (
          sorted.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isOwner={member.user_id === server?.ownerId}
              currentUserIsOwner={currentUserIsOwner}
              currentUserIsAdmin={currentUserIsAdmin}
              serverId={serverId}
            />
          ))
        )}
      </div>
    </aside>
  )
}
