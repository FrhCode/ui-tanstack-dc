export type Friend = {
  id: number
  friend_id: number
  friend_name: string
  since: string
}

export type FriendRequest = {
  id: number
  requester_id: number
  addressee_id: number
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  requester_name: string
  addressee_name: string
}

export type SendFriendRequestPayload = {
  email: string
}
