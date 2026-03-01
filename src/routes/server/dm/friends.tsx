import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, HelpCircle, Inbox, Users } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/server/dm/friends')({
  component: RouteComponent,
})

const tabs = ['All', 'Online', 'Pending', 'Blocked']
const activeTab = 'All'

function RouteComponent() {
  const [friendsOnline] = useState(0)

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-black/20 dark:text-white/90">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-slate-500 dark:text-white/60" />
            <span>Friends</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-white/10 md:hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  tab === activeTab
                    ? 'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
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
        <section className="flex flex-1 flex-col">
          <div className="p-4">
            <input
              data-slot="input"
              className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                'bg-slate-100 text-sm text-slate-600 placeholder:text-slate-400 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/40',
              )}
              placeholder="Search"
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 pb-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-sm font-semibold text-slate-600 dark:text-white/70">
              {friendsOnline === 0
                ? 'There are no friends online at this time. Check back later!'
                : 'Friends online'}
            </div>
            <p className="max-w-md text-xs text-slate-500 dark:text-white/50">
              Search for friends, start a DM, or invite them to a server.
            </p>
          </div>
        </section>

        <aside className="w-80 border-l border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/30 lg:hidden">
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
