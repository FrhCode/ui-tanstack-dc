import { useAuth } from '#/auth/AuthProvider'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Input } from '#/components/ui/input'
import {
  useBlockUser,
  useBlockedUsers,
  useUnblockUser,
} from '#/hooks/useBlocksQueries'
import { useOpenDm } from '#/hooks/useDmQueries'
import {
  useAcceptRequest,
  useCancelRequest,
  useFriends,
  useIncomingRequests,
  useOutgoingRequests,
  useRejectRequest,
  useRemoveFriend,
  useSendFriendRequest,
} from '#/hooks/useFriendsQueries'
import { ApiError } from '#/lib/api'
import { cn } from '#/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Bell,
  Check,
  HelpCircle,
  Inbox,
  MessageSquare,
  MoreHorizontal,
  UserMinus,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/server/dm/friends')({
  component: RouteComponent,
})

type Tab = 'Online' | 'All' | 'Pending' | 'Blocked' | 'Add Friend'
const tabs: Tab[] = ['Online', 'All', 'Pending', 'Blocked']

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('Online')
  const [search, setSearch] = useState('')
  const [addFriendEmail, setAddFriendEmail] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: friends = [], isLoading: friendsLoading } = useFriends()
  const { data: incoming = [], isLoading: incomingLoading } =
    useIncomingRequests()
  const { data: outgoing = [], isLoading: outgoingLoading } =
    useOutgoingRequests()
  const { data: blocked = [], isLoading: blockedLoading } = useBlockedUsers()

  const sendRequest = useSendFriendRequest()
  const cancelRequest = useCancelRequest()
  const acceptRequest = useAcceptRequest()
  const rejectRequest = useRejectRequest()
  const removeFriend = useRemoveFriend()
  const blockUser = useBlockUser()
  const unblockUser = useUnblockUser()
  const openDm = useOpenDm()

  const pendingCount = incoming.length

  const filteredFriends = friends.filter((f) =>
    f.friend_name.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleMessage(id: number) {
    try {
      const conv = await openDm.mutateAsync({ id })
      navigate({
        to: '/server/dm/user/$userId',
        params: { userId: String(conv.id) },
      })
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
        return
      }
      toast.error('Could not open conversation')
    }
  }

  async function handleSendRequest() {
    const email = addFriendEmail.trim()
    if (!email) {
      toast.error('Please enter an email')
      return
    }
    try {
      await sendRequest.mutateAsync({ email })
      toast.success('Friend request sent!')
      setAddFriendEmail('')
    } catch {
      toast.error('Could not send friend request')
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-black/20 dark:text-white/90">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-slate-500 dark:text-white/60" />
            <span>Friends</span>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-200 pl-4 dark:border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  activeTab === tab
                    ? 'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/10',
                )}
              >
                {tab}
                {tab === 'Pending' && pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
            <Button
              size="sm"
              onClick={() => setActiveTab('Add Friend')}
              className={cn(
                'ml-1 text-xs',
                activeTab === 'Add Friend'
                  ? 'bg-green-700 text-white hover:bg-green-800'
                  : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
              )}
            >
              Add Friend
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded p-1 text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10">
            <Inbox className="h-4 w-4" />
          </button>
          <button className="rounded p-1 text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </button>
          <button className="rounded p-1 text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10">
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Add Friend Tab */}
          {activeTab === 'Add Friend' && (
            <div className="flex flex-col p-8">
              <h2 className="text-lg font-bold">Add Friend</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
                Enter the email of someone you want to add as a friend.
              </p>
              <div className="mt-4 flex gap-2">
                <Input
                  type="email"
                  value={addFriendEmail}
                  onChange={(e) => setAddFriendEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
                  placeholder="Enter User Email"
                  className="max-w-sm"
                />
                <Button
                  onClick={handleSendRequest}
                  disabled={sendRequest.isPending || !addFriendEmail.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {sendRequest.isPending ? 'Sending...' : 'Send Friend Request'}
                </Button>
              </div>
            </div>
          )}

          {/* Online / All tabs */}
          {(activeTab === 'Online' || activeTab === 'All') && (
            <>
              <div className="p-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-slate-100 text-sm text-slate-600 placeholder:text-slate-400 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/40"
                />
              </div>
              {friendsLoading ? (
                <div className="flex flex-1 items-center justify-center text-sm text-slate-500 dark:text-white/50">
                  Loading...
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 pb-10 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40">
                    <Users className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-white/70">
                    {search
                      ? 'No friends match your search.'
                      : 'No friends yet. Add some friends!'}
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-white/40">
                    {activeTab} — {filteredFriends.length}
                  </p>
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-100 dark:hover:bg-white/5 group"
                    >
                      <div className="relative shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {friend.friend_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">
                          {friend.friend_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-white/40">
                          Online
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMessage(friend.friend_id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                          title="Message"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={async () => {
                                try {
                                  await removeFriend.mutateAsync(
                                    friend.friend_id,
                                  )
                                  toast.success(`Removed ${friend.friend_name}`)
                                } catch {
                                  toast.error('Could not remove friend')
                                }
                              }}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove Friend
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onSelect={async () => {
                                try {
                                  await blockUser.mutateAsync({
                                    blocked_id: friend.friend_id,
                                  })
                                  toast.success(`Blocked ${friend.friend_name}`)
                                } catch {
                                  toast.error('Could not block user')
                                }
                              }}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Block
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pending Tab */}
          {activeTab === 'Pending' && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {incomingLoading || outgoingLoading ? (
                <div className="text-sm text-slate-500 dark:text-white/50">
                  Loading...
                </div>
              ) : (
                <>
                  {incoming.length > 0 && (
                    <>
                      <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-white/40">
                        Incoming — {incoming.length}
                      </p>
                      {incoming.map((req) => (
                        <div
                          key={req.id}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-100 dark:hover:bg-white/5 group"
                        >
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {req.requester_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">
                              {req.requester_name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-white/40">
                              Incoming Friend Request
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={async () => {
                                try {
                                  await acceptRequest.mutateAsync(req.id)
                                  toast.success(
                                    `Accepted ${req.requester_name}'s request`,
                                  )
                                } catch {
                                  toast.error('Could not accept request')
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-green-600 hover:bg-green-100 dark:bg-white/10 dark:text-green-400 dark:hover:bg-green-500/20"
                              title="Accept"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await rejectRequest.mutateAsync(req.id)
                                  toast.success('Request rejected')
                                } catch {
                                  toast.error('Could not reject request')
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-red-500 hover:bg-red-100 dark:bg-white/10 dark:text-red-400 dark:hover:bg-red-500/20"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {outgoing.length > 0 && (
                    <>
                      <p className="mt-4 mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-white/40">
                        Outgoing — {outgoing.length}
                      </p>
                      {outgoing.map((req) => {
                        const otherName =
                          req.addressee_id === user?.id
                            ? req.requester_name
                            : req.addressee_name
                        return (
                          <div
                            key={req.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-100 dark:hover:bg-white/5 group"
                          >
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {otherName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold">
                                {otherName}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-white/40">
                                Outgoing Friend Request
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={async () => {
                                  try {
                                    await cancelRequest.mutateAsync(req.id)
                                    toast.success('Request cancelled')
                                  } catch {
                                    toast.error('Could not cancel request')
                                  }
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-red-500 hover:bg-red-100 dark:bg-white/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}

                  {incoming.length === 0 && outgoing.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40">
                        <Users className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-white/70">
                        No pending friend requests
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Blocked Tab */}
          {activeTab === 'Blocked' && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {blockedLoading ? (
                <div className="text-sm text-slate-500 dark:text-white/50">
                  Loading...
                </div>
              ) : blocked.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40">
                    <UserX className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-white/70">
                    No blocked users
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-white/40">
                    Blocked — {blocked.length}
                  </p>
                  {blocked.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-100 dark:hover:bg-white/5 group"
                    >
                      <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {b.blocked_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">
                          {b.blocked_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-white/40">
                          Blocked
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await unblockUser.mutateAsync(b.blocked_id)
                            toast.success(`Unblocked ${b.blocked_name}`)
                          } catch {
                            toast.error('Could not unblock user')
                          }
                        }}
                        className="rounded bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-300 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </section>

        <aside className="w-80 border-l border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/30">
          <div className="text-sm font-semibold">Active Now</div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-black/30">
            <div className="text-sm font-semibold text-slate-700 dark:text-white/80">
              It&apos;s quiet for now...
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-white/50">
              When a friend starts an activity like playing a game or hanging
              out on voice we&apos;ll show it here!
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
