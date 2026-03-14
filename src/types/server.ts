export type Server = {
  id: number
  name: string
  iconUrl: string | null
  invite_code: string
  ownerId: number
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string
}

export type Channel = {
  id: number
  name: string
  type: 'video' | 'mic' | 'message'
  serverId: number
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string
}

export type Message = {
  id: number
  content: string
  channel_id: number
  sender_id: number
  sender_name: string
  created_at: string
  modified_at: string
}

export type Member = {
  id: number
  userId: number
  serverId: number
  role: 'admin' | 'member'
  createdAt: string
}

export type ServerWithChannels = Server & { channels: Channel[] }

export type CreateServerPayload = { name: string; iconUrl?: string }
export type JoinServerPayload = { inviteCode: string }
export type CreateChannelPayload = { name: string; type: Channel['type'] }
export type SendMessagePayload = { content: string }
