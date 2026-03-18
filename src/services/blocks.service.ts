import { request } from '#/lib/api'
import type { BlockedUser, BlockUserPayload } from '#/types'

export const blocksService = {
  getBlockedUsers: () => request<BlockedUser[]>('/blocks'),

  blockUser: (payload: BlockUserPayload) =>
    request<BlockedUser>('/blocks', { method: 'POST', data: payload }),

  unblockUser: (userId: number) =>
    request<{ success: boolean }>(`/blocks/${userId}`, {
      method: 'DELETE',
    }),
}
