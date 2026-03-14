export type Server = {
  id: number
  name: string
  iconUrl: string | null
  inviteCode: string
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
  channelId: number
  senderId: number
  createdAt: string
  modifiedAt: string
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
