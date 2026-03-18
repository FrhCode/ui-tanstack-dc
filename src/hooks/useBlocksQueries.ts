import { blocksService } from '#/services/blocks.service'
import type { BlockUserPayload } from '#/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { friendKeys } from './useFriendsQueries'

// ── Query Keys ──────────────────────────────────────────────────────────────

export const blockKeys = {
  all: ['blocks'] as const,
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function useBlockedUsers() {
  return useQuery({
    queryKey: blockKeys.all,
    queryFn: () => blocksService.getBlockedUsers(),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useBlockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BlockUserPayload) =>
      blocksService.blockUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockKeys.all })
      queryClient.invalidateQueries({ queryKey: friendKeys.all })
    },
  })
}

export function useUnblockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => blocksService.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockKeys.all })
    },
  })
}
