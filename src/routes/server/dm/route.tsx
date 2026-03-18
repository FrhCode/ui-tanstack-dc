import { useAuth } from '#/auth/AuthProvider'
import { Button } from '#/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
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
import { Popover, PopoverAnchor, PopoverContent } from '#/components/ui/popover'
import {
  useDmConversations,
  useOpenDm,
  useSearchUsers,
} from '#/hooks/useDmQueries'
import { useTheme } from '#/hooks/useTheme'
import { ApiError } from '#/lib/api'
import { UserSearchResult } from '#/types'
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { Headphones, Mic, Moon, Settings, Sun } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/server/dm')({
  component: RouteComponent,
})

const menuItems = [
  { label: 'Friends', icon: '👥', key: '/server/dm/friends' },
  { label: 'Nitro', icon: '💎', key: '/server/dm/nitro' },
  { label: 'Shop', icon: '🛍️', key: '/server/dm/shop' },
  { label: 'Quests', icon: '🧭', key: '/server/dm/quests' },
]

function RouteComponent() {
  const { toggleTheme, theme } = useTheme()
  const { logout, user, isLoading } = useAuth()
  const { data: conversations = [] } = useDmConversations()
  const openDm = useOpenDm()
  const navigate = useNavigate()
  const [dmDialogOpen, setDmDialogOpen] = useState(false)
  const [dmUserId, setDmUserId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const { data: searchResults = [], isFetching: isSearching } =
    useSearchUsers(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  if (isLoading) {
    return <div className="h-screen" />
  }

  if (!user) {
    return null
  }

  function handleDmDialogClose(open: boolean) {
    setDmDialogOpen(open)
    if (!open) {
      setDmUserId(null)
      setSearchQuery('')
      setSuggestionsOpen(false)
    }
  }

  async function handleNewDmSubmit() {
    if (!dmUserId) {
      toast.error('Please enter user')
      return
    }
    try {
      const conv = await openDm.mutateAsync({ id: dmUserId })
      handleDmDialogClose(false)
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

  function handleSelectSuggestion({ id, name }: UserSearchResult) {
    setDmUserId(id)
    setSearchQuery(name)
    setSuggestionsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <>
      <aside className="w-80 shrink-0 flex flex-col pb-4 bg-slate-50 dark:bg-black/30">
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full bg-transparent text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10"
          >
            Find or start a conversation
          </Button>
        </div>

        <div className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                to={item.key}
                key={item.label}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm"
                activeProps={{
                  className:
                    'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white',
                }}
                inactiveProps={{
                  className:
                    'text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/10',
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="my-3 h-px bg-slate-200 dark:bg-white/10" />

          <div className="flex items-center justify-between px-2 text-xs uppercase text-slate-500 dark:text-white/50">
            <span>Direct Messages</span>
            <button
              onClick={() => setDmDialogOpen(true)}
              className="text-base text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
              title="New DM"
            >
              +
            </button>
          </div>

          <Dialog open={dmDialogOpen} onOpenChange={handleDmDialogClose}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Start a Direct Message</DialogTitle>
              </DialogHeader>
              <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
                <PopoverAnchor asChild>
                  <Command shouldFilter={false} className="border rounded-md">
                    <CommandInput
                      ref={inputRef}
                      placeholder="Enter user email"
                      value={searchQuery}
                      onValueChange={(val) => {
                        setSearchQuery(val)
                        setSuggestionsOpen(val.length >= 2)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !suggestionsOpen) {
                          handleNewDmSubmit()
                        }
                        if (e.key === 'Escape') {
                          setSuggestionsOpen(false)
                        }
                      }}
                    />
                  </Command>
                </PopoverAnchor>
                <PopoverContent
                  className="p-0 w-(--radix-popover-trigger-width)"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command shouldFilter={false}>
                    <CommandList>
                      {isSearching ? (
                        <CommandEmpty>Searching...</CommandEmpty>
                      ) : searchResults.length === 0 ? (
                        <CommandEmpty>No users found.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {searchResults.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.email}
                              onSelect={() => handleSelectSuggestion(user)}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                  {user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleDmDialogClose(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleNewDmSubmit} disabled={openDm.isPending}>
                  Open DM
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="mt-2 space-y-1">
            {conversations.map((conv) => (
              <Link
                to="/server/dm/user/$userId"
                params={{ userId: String(conv.id) }}
                key={conv.id}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm"
                activeProps={{
                  className:
                    'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white',
                }}
                inactiveProps={{
                  className:
                    'text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10',
                }}
              >
                <div className="relative shrink-0">
                  <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {conv.partner.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white dark:ring-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-700 dark:text-white/80 truncate">
                    {conv.partner.name}
                  </div>
                  {conv.last_message && (
                    <div className="text-xs text-slate-400 dark:text-white/40 truncate">
                      {conv.last_message.content}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-2 py-2 rounded-lg mx-1 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-white/50 truncate">
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
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  )
}
