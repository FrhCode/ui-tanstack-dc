import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'

type ServerItem = {
  name: string
  badge: string
  // active: boolean;
  key: string
}

function ServerButton({ server }: { server: ServerItem }) {
  const location = useLocation()
  const path = location.pathname

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={server.key}
          className={cn(
            'relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-xs text-slate-700 transition dark:bg-white/10 dark:text-white/90',
            path.includes(server.key)
              ? 'rounded-xl bg-slate-300 dark:bg-white/20'
              : 'hover:rounded-xl',
          )}
          aria-label={server.name}
        >
          {server.name[0]}
          {server.badge ? (
            <span className="absolute -right-1 -top-1 rounded bg-red-600 px-1 text-[9px] font-semibold text-white">
              {server.badge}
            </span>
          ) : null}
          {path.includes(server.key) ? (
            <span className="absolute -left-2 top-0 h-full w-1 rounded-r-xl bg-slate-300 dark:bg-white/20" />
          ) : null}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{server.name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function ServerSelection() {
  const servers: ServerItem[] = [
    { name: 'React JS', badge: '', key: '/server/react-js' },
    { name: 'OPs', badge: '', key: '/server/ops' },
    { name: 'Monster', badge: '', key: '/server/monster' },
  ]

  return (
    <div className="h-screen bg-slate-100 text-slate-900 dark:bg-black/20 dark:text-white/90">
      <div className="py-3 dark:border-white/10 dark:bg-black/40">
        <div className="space-y-3 px-2">
          <ServerButton
            server={{
              name: 'Direct Messages',
              badge: 'DM',
              key: '/server/dm',
            }}
          />
          <div className="mx-2 my-2 h-px bg-slate-300 dark:bg-white/10" />
          {servers.map((server) => (
            <ServerButton key={server.name} server={server} />
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-xl text-green-600 hover:bg-green-600 hover:text-white dark:bg-white/10 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white">
                +
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add a server</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
