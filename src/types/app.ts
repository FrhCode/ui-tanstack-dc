export type AppTheme = 'light' | 'dark'

export type ApiResponse<TData> = {
  statusCode: number
  requestId: string
  message: string
  data: TData
}
