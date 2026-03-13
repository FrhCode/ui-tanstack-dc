import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import { AuthProvider } from '#/auth/AuthProvider'
import { ErrorBoundary } from '#/components/ErrorBoundary'
import { TooltipProvider } from '#/components/ui/tooltip'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {\n  try {\n    const storedTheme = localStorage.getItem('theme')\n    if (!storedTheme) return\n    const theme = JSON.parse(storedTheme)\n    const html = document.documentElement\n    html.classList.toggle('dark', theme === 'dark')\n  } catch (_) {}\n})()`,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
        <TooltipProvider>
          <TanStackQueryProvider>
            <AuthProvider>
              {children}
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
            </AuthProvider>
          </TanStackQueryProvider>
        </TooltipProvider>
        </ErrorBoundary>
        <Scripts />
      </body>
    </html>
  )
}
