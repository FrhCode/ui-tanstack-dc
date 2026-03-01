import { Button } from '#/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Headphones, Mic, Settings } from 'lucide-react'

export const Route = createFileRoute('/server/dm')({
  component: RouteComponent,
})

const menuItems = [
  { label: 'Friends', icon: '👥', key: '/server/dm/friends' },
  { label: 'Nitro', icon: '💎', key: '/server/dm/nitro' },
  { label: 'Shop', icon: '🛍️', key: '/server/dm/shop' },
  { label: 'Quests', icon: '🧭', key: '/server/dm/quests' },
]

const dmItems = [
  {
    name: 'farhanbantulm1',
    status: 'online',
    badge: '',
    key: '/server/dm/user/farhanbantulm1',
  },
  {
    name: 'MaYoAs',
    status: 'idle',
    badge: '24',
    key: '/server/dm/user/MaYoAs',
  },
  {
    name: 'お金は力です',
    status: 'dnd',
    badge: 'EXCL',
    key: '/server/dm/user/お金は力です',
  },
  {
    name: 'rizkyirmawan',
    status: 'offline',
    badge: '',
    key: '/server/dm/user/rizkyirmawan',
  },
]

function RouteComponent() {
  return (
    <>
      <aside className="w-80 flex flex-col pb-4">
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full bg-transparent text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10"
          >
            Find or start a conversation
          </Button>
        </div>

        <div className="flex-1 px-3">
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
            <button className="text-base text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white">
              +
            </button>
          </div>

          <div className="mt-2 space-y-1">
            {dmItems.map((dm) => (
              // <NavLink
              //   to={dm.key}
              //   key={dm.name}
              //   className={({ isActive }) =>
              //     `flex items-center gap-3 rounded-md px-2 py-2 ${
              //       isActive
              //         ? 'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white'
              //         : 'text-slate-500 hover:bg-slate-200 dark:text-white/60 dark:hover:bg-white/10'
              //     }`
              //   }
              // >
              //   <div className="relative">
              //     <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-white/10" />
              //     <span
              //       className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-black ${
              //         dm.status === 'online'
              //           ? 'bg-green-500'
              //           : dm.status === 'idle'
              //             ? 'bg-yellow-500'
              //             : dm.status === 'dnd'
              //               ? 'bg-red-500'
              //               : 'bg-gray-500'
              //       }`}
              //     />
              //   </div>
              //   <div className="flex-1 text-sm text-slate-700 dark:text-white/80">
              //     {dm.name}
              //   </div>
              //   {dm.badge ? (
              //     <div className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              //       {dm.badge}
              //     </div>
              //   ) : null}
              // </NavLink>
              <Link
                to={dm.key}
                key={dm.name}
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
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-white/10" />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-black ${
                      dm.status === 'online'
                        ? 'bg-green-500'
                        : dm.status === 'idle'
                          ? 'bg-yellow-500'
                          : dm.status === 'dnd'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="flex-1 text-sm text-slate-700 dark:text-white/80">
                  {dm.name}
                </div>
                {dm.badge ? (
                  <div className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {dm.badge}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-white/10" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-black" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-900 dark:text-white">
                Farhan
              </div>
              <div className="text-xs text-slate-500 dark:text-white/50">
                Online
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-white/60">
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                <Mic className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                <Headphones className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
                <Settings className="h-4 w-4" />
              </button>
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
