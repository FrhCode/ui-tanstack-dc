import { request } from '#/lib/api'
import type { Friend, FriendRequest, SendFriendRequestPayload } from '#/types'

export const friendsService = {
  getFriends: () => request<Friend[]>('/friends'),

  sendRequest: (payload: SendFriendRequestPayload) =>
    request<FriendRequest>('/friends/requests', {
      method: 'POST',
      data: payload,
    }),

  getIncomingRequests: () =>
    request<FriendRequest[]>('/friends/requests/incoming'),

  getOutgoingRequests: () =>
    request<FriendRequest[]>('/friends/requests/outgoing'),

  cancelRequest: (requestId: number) =>
    request<{ success: boolean }>(`/friends/requests/${requestId}`, {
      method: 'DELETE',
    }),

  acceptRequest: (requestId: number) =>
    request<{ success: boolean }>(`/friends/requests/${requestId}/accept`, {
      method: 'PATCH',
    }),

  rejectRequest: (requestId: number) =>
    request<{ success: boolean }>(`/friends/requests/${requestId}/reject`, {
      method: 'PATCH',
    }),

  removeFriend: (userId: number) =>
    request<{ success: boolean }>(`/friends/${userId}`, {
      method: 'DELETE',
    }),
}
