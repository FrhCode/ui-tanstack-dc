import { useAuth } from '#/auth/AuthProvider'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { ApiError } from '#/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, login, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return <div className="h-screen" />
  }

  if (isAuthenticated) {
    return <Navigate to="/server/dm" />
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await login({ email: data.email, password: data.password })
      await navigate({ to: '/server/dm' })
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        form.setError('email', {
          message: 'Invalid email or password',
        })
        form.setError('password', {
          message: 'Invalid email or password',
        })
      } else {
        toast.error('Sign in failed. Please try again.')
      }
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-black/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-white/10 dark:bg-black/50 dark:shadow-black/40">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <span className="text-lg font-semibold">DC</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-white/60">
            Sign in to continue
          </p>
        </div>
        <form
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Minimum 8 characters"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            className="w-full rounded-lg text-sm font-semibold shadow-sm transition hover:shadow-md dark:shadow-black/40"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className="mt-6 space-y-3 text-center">
          <p className="text-xs text-slate-500 dark:text-white/60">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white"
            >
              Create one
            </Link>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-white/40">
            By signing in, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
