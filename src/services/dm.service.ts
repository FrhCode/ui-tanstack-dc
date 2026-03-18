import { request } from '#/lib/api'
import type {
  DeleteDmMode,
  DmConversation,
  DmConversations,
  DmMessage,
  OpenDmPayload,
  SendDmPayload,
  UserSearchResult,
} from '#/types'

export const dmService = {
  openConversation: (payload: OpenDmPayload) =>
    request<DmConversation>('/dm/conversations', {
      method: 'POST',
      data: payload,
    }),

  getConversations: () =>
    request<DmConversations[]>('/dm/conversations?include_last_message=true'),

  getMessages: (conversationId: number, cursor?: number, limit = 50) => {
    const params: Record<string, string> = { limit: String(limit) }
    if (cursor !== undefined) params.cursor = String(cursor)
    return request<DmMessage[]>(
      `/dm/conversations/${conversationId}/messages`,
      { params },
    )
  },

  sendMessage: (conversationId: number, payload: SendDmPayload) => {
    const form = new FormData()
    if (payload.content) form.append('content', payload.content)
    if (payload.attachment) form.append('attachment', payload.attachment)
    if (payload.quoted_content) form.append('quoted_content', payload.quoted_content)
    if (payload.quoted_sender_name) form.append('quoted_sender_name', payload.quoted_sender_name)
    if (payload.reply_to_message_id) form.append('reply_to_message_id', String(payload.reply_to_message_id))
    return request<DmMessage>(`/dm/conversations/${conversationId}/messages`, {
      method: 'POST',
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  editMessage: (conversationId: number, messageId: number, content: string) =>
    request<DmMessage>(
      `/dm/conversations/${conversationId}/messages/${messageId}`,
      { method: 'PATCH', data: { content } },
    ),

  deleteMessage: (conversationId: number, messageId: number, mode: DeleteDmMode) =>
    request<{ success: boolean }>(
      `/dm/conversations/${conversationId}/messages/${messageId}`,
      { method: 'DELETE', data: { mode } },
    ),

  addReaction: (conversationId: number, messageId: number, emoji: string) =>
    request<{ success: boolean }>(
      `/dm/conversations/${conversationId}/messages/${messageId}/reactions`,
      { method: 'POST', data: { emoji } },
    ),

  removeReaction: (conversationId: number, messageId: number, emoji: string) =>
    request<{ success: boolean }>(
      `/dm/conversations/${conversationId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
      { method: 'DELETE' },
    ),

  searchUsers: (query: string) =>
    request<UserSearchResult[]>('dm/users/search', { params: { q: query } }),
}
