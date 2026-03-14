import { request } from '#/lib/api'
import type {
  Channel,
  CreateChannelPayload,
  CreateServerPayload,
  JoinServerPayload,
  Member,
  Message,
  SendMessagePayload,
  Server,
  ServerWithChannels,
} from '#/types'

export const serverService = {
  getServers: () => request<Server[]>('/servers'),

  getServer: (id: number) => request<ServerWithChannels>(`/servers/${id}`),

  createServer: (payload: CreateServerPayload) =>
    request<Server>('/servers', { method: 'POST', data: payload }),

  updateServer: (id: number, payload: Partial<CreateServerPayload>) =>
    request<Server>(`/servers/${id}`, { method: 'PATCH', data: payload }),

  deleteServer: (id: number) =>
    request<{ success: boolean }>(`/servers/${id}`, { method: 'DELETE' }),

  joinServer: (payload: JoinServerPayload) =>
    request<{ success: boolean; serverId: number }>('/servers/join', {
      method: 'POST',
      data: payload,
    }),

  leaveServer: (id: number) =>
    request<{ success: boolean }>(`/servers/${id}/leave`, { method: 'POST' }),

  getMembers: (serverId: number) =>
    request<Member[]>(`/servers/${serverId}/members`),

  inviteUser: (serverId: number, userId: number) =>
    request<{ success: boolean }>(`/servers/${serverId}/invite`, {
      method: 'POST',
      data: { userId },
    }),

  getChannels: (serverId: number) =>
    request<Channel[]>(`/servers/${serverId}/channels`),

  createChannel: (serverId: number, payload: CreateChannelPayload) =>
    request<Channel>(`/servers/${serverId}/channels`, {
      method: 'POST',
      data: payload,
    }),

  deleteChannel: (serverId: number, channelId: number) =>
    request<{ success: boolean }>(
      `/servers/${serverId}/channels/${channelId}`,
      { method: 'DELETE' },
    ),

  getMessages: (channelId: number, cursor?: number, limit = 50) => {
    const params: Record<string, string> = { limit: String(limit) }
    if (cursor !== undefined) params.cursor = String(cursor)
    return request<Message[]>(`/channels/${channelId}/messages`, { params })
  },

  sendMessage: (channelId: number, payload: SendMessagePayload) =>
    request<Message>(`/channels/${channelId}/messages`, {
      method: 'POST',
      data: payload,
    }),

  editMessage: (channelId: number, messageId: number, content: string) =>
    request<Message>(`/channels/${channelId}/messages/${messageId}`, {
      method: 'PATCH',
      data: { content },
    }),

  deleteMessage: (channelId: number, messageId: number) =>
    request<{ success: boolean }>(
      `/channels/${channelId}/messages/${messageId}`,
      { method: 'DELETE' },
    ),
}
