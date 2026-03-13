import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-black/30">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-white/60">
              {this.state.message || 'An unexpected error occurred.'}
            </p>
            <button
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={() => this.setState({ hasError: false, message: '' })}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
