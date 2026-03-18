export type BlockedUser = {
  id: number
  blocked_id: number
  blocked_name: string
  created_at: string
}

export type BlockUserPayload = {
  blocked_id: number
}
