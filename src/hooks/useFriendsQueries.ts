import { friendsService } from '#/services/friends.service'
import type { SendFriendRequestPayload } from '#/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ── Query Keys ──────────────────────────────────────────────────────────────

export const friendKeys = {
  all: ['friends'] as const,
  incoming: ['friends', 'requests', 'incoming'] as const,
  outgoing: ['friends', 'requests', 'outgoing'] as const,
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function useFriends() {
  return useQuery({
    queryKey: friendKeys.all,
    queryFn: () => friendsService.getFriends(),
  })
}

export function useIncomingRequests() {
  return useQuery({
    queryKey: friendKeys.incoming,
    queryFn: () => friendsService.getIncomingRequests(),
  })
}

export function useOutgoingRequests() {
  return useQuery({
    queryKey: friendKeys.outgoing,
    queryFn: () => friendsService.getOutgoingRequests(),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useSendFriendRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendFriendRequestPayload) =>
      friendsService.sendRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.outgoing })
    },
  })
}

export function useCancelRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: number) => friendsService.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.outgoing })
    },
  })
}

export function useAcceptRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: number) => friendsService.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.incoming })
      queryClient.invalidateQueries({ queryKey: friendKeys.all })
    },
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: number) => friendsService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.incoming })
    },
  })
}

export function useRemoveFriend() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => friendsService.removeFriend(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all })
    },
  })
}
