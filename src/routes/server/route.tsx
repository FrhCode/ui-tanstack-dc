import { ServerSelection } from '#/components/ServerSelection'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/server')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <div className="relative flex h-screen overflow-y-hidden">
      <aside className="w-16 shrink-0 border-r ">
        <ServerSelection />
      </aside>
      <Outlet />

      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-300 text-lg text-slate-900 shadow-lg transition-all hover:bg-slate-400 dark:bg-white/20 dark:text-white/90 dark:hover:bg-white/30"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  )
}
