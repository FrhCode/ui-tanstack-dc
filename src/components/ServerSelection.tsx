import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useServers } from '#/hooks/useServerQueries'
import { cn } from '#/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateServerDialog } from './CreateServerDialog'

function ServerButton({
  name,
  linkKey,
}: {
  name: string
  linkKey: string
}) {
  const location = useLocation()
  const path = location.pathname
  const isActive = path === linkKey || path.startsWith(linkKey + '/')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={linkKey}
          className={cn(
            'relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-xs text-slate-700 transition dark:bg-white/10 dark:text-white/90',
            isActive
              ? 'rounded-xl bg-slate-300 dark:bg-white/20'
              : 'hover:rounded-xl',
          )}
          aria-label={name}
        >
          {name[0].toUpperCase()}
          {isActive ? (
            <span className="absolute -left-2 top-0 h-full w-1 rounded-r-xl bg-slate-300 dark:bg-white/20" />
          ) : null}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function ServerSelection() {
  const { data: servers, isLoading } = useServers()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="h-screen bg-slate-50 text-slate-900 dark:bg-black/30 dark:text-white/90">
      <div className="py-3 dark:border-white/10">
        <div className="space-y-3 px-2">
          <ServerButton name="Direct Messages" linkKey="/server/dm" />
          <div className="mx-2 my-2 h-px bg-slate-300 dark:bg-white/10" />

          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10"
                />
              ))}
            </>
          ) : (
            servers?.map((server) => (
              <ServerButton
                key={server.id}
                name={server.name}
                linkKey={`/server/${server.id}`}
              />
            ))
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setDialogOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-xl text-green-600 hover:bg-green-600 hover:text-white dark:bg-white/10 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
              >
                +
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add a server</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <CreateServerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
