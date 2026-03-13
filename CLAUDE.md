# CLAUDE.md

## Project Overview

Discord-like chat application built with React 19, TypeScript, and the TanStack ecosystem on Vite 7.

## Commands

```bash
npm run dev        # Dev server on port 3000
npm run build      # Production build (run after every code change to verify)
npm run preview    # Preview production build
npm run test       # Run tests (Vitest)
npm run lint       # ESLint check
npm run format     # Prettier check
npm run check      # Prettier write + ESLint fix
```

**IMPORTANT: After every code change, run `npm run build` to ensure no type or build errors.**

## Tech Stack & Libraries

### Routing — TanStack Router v1

File-based routing in `src/routes/`. Adding/removing route files auto-generates `src/routes/routeTree.gen.ts` (do not edit manually). Router config lives in `src/router.tsx`. Protected routes use `AuthProvider` checks. Default preload strategy is `'intent'`.

### Server State — TanStack React Query v5

Use for all server-side data fetching and caching. QueryClient setup in `src/integrations/tanstack-query/root-provider.tsx`. Access via `getContext()`. Devtools available in dev mode.

### HTTP Client — Axios

**Always use `request<T>(endpoint, config)` from `src/lib/api.ts`** — never use raw axios. This wrapper:
- Unwraps the API envelope (`ApiEnvelope<T>` → returns `T` directly)
- Auto-attaches Bearer token from localStorage
- Handles 401 with automatic token refresh and retry
- Converts errors to typed `ApiError` (with `statusCode`, `requestId`, `errors`)

API response envelope format:
```ts
{ statusCode: number, requestId: string, message: string, data: T }
```

### Forms — React Hook Form v7 + Zod v4

Pattern: define a Zod schema → `useForm` with `zodResolver` → `Controller` → `Field` component.

```tsx
const schema = z.object({ email: z.email(), password: z.string().min(8) })
const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })
```

Use `<Field>`, `<FieldGroup>`, `<FieldLabel>`, `<FieldError>` from `src/components/ui/field.tsx` for consistent form layout.

### UI Components — Shadcn/ui (new-york style) + Radix UI v1

Install new components:
```bash
npx shadcn@latest add <component>
```

Config in `components.json`. Base color: zinc. All components use `data-slot` attributes and merge classes with `cn()`.

### Styling — Tailwind CSS v4

Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for all class merging. Dark mode via class strategy (`dark:` prefix). Theme CSS in `src/styles.css`.

### Component Variants — CVA (class-variance-authority)

Use CVA for defining component variants (see `src/components/ui/button.tsx` for reference pattern).

### Icons — Lucide React

```tsx
import { IconName } from 'lucide-react'
```

### Toast Notifications — Sonner

```tsx
import { toast } from 'sonner'
toast.success('Done')
```

Provider: `<Toaster />` in root layout.

### Theme — next-themes + useTheme hook

Custom `useTheme()` from `src/hooks/useTheme.ts` returns `{ theme, toggleTheme }`. Values: `'light' | 'dark'`. Persisted in localStorage. Root layout includes inline script to prevent flash.

### Auth — Context + Service

- Service: `authService` in `src/auth/auth.ts` — `login()`, `register()`, `logout()`, `fetchMe()`, `isAuthenticated()`
- Context: `useAuth()` from `src/auth/AuthProvider.tsx` — provides `user`, `isLoading`, `isAuthenticated`, `login`, `register`, `logout`, `refreshUser`

### Testing — Vitest

Run with `npm run test`.

## Import Aliases

Use `#/*` for all imports (resolves to `./src/*`). The `@/*` alias also exists in tsconfig but does not resolve correctly in the Vite build — **always use `#/`**.

```tsx
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
```

## Directory Structure

```
src/
├── auth/           # Auth service (auth.ts) and context (AuthProvider.tsx)
├── components/
│   └── ui/         # Shadcn/Radix UI primitives (button, input, field, etc.)
├── constant/       # App constants (localStorage keys)
├── hooks/          # Custom hooks (useTheme)
├── integrations/   # Third-party integrations (TanStack Query provider)
├── lib/            # Core utilities (api.ts, utils.ts, site.ts)
├── routes/         # File-based routes (TanStack Router)
├── types/          # TypeScript types organized by domain (auth, messages, app)
└── util/           # Utility helpers (local-storage.util.ts)
```

## Coding Conventions

### Formatting (Prettier)
- No semicolons
- Single quotes
- Trailing commas (all)

### Naming
- Components/types: PascalCase
- Functions/variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Utility/hook files: kebab-case (`local-storage.util.ts`, `useTheme.ts`)

### Components
- Use `data-slot` attribute on root elements
- Merge classes with `cn()` — never manual string concatenation
- Use CVA for variant definitions
- Support `className` prop and spread it via `cn()`

## Key Patterns

### API Requests
```tsx
import { request } from '#/lib/api'
const data = await request<MyType>('/endpoint', { method: 'POST', data: payload })
```
Catch errors with `ApiError`:
```tsx
import { ApiError } from '#/lib/api'
try { ... } catch (err) {
  if (err instanceof ApiError && err.statusCode === 401) { /* handle */ }
}
```

### localStorage
Use `localStorageUtil` from `src/util/local-storage.util.ts`. Define keys in `src/constant/localStorage.ts` as `LOCAL_STORAGE_KEY` object.

### Adding Routes
Create a new file in `src/routes/` following TanStack Router file-based conventions. The route tree regenerates automatically.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001` |

## Verification

After every change:
1. `npm run build` — must pass with no errors
2. `npm run dev` — verify the app loads correctly
3. `npm run test` — if tests exist for the modified area
