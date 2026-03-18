import { dmService } from '#/services/dm.service'
import type { DeleteDmMode, DmMessage, OpenDmPayload, SendDmPayload } from '#/types'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

// ── Query Keys ──────────────────────────────────────────────────────────────

export const dmKeys = {
  conversations: ['dm', 'conversations'] as const,
  messages: (conversationId: number) =>
    ['dm', 'messages', conversationId] as const,
  searchUser: (email: string) => ['dm', email] as const,
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function useDmConversations() {
  return useQuery({
    queryKey: dmKeys.conversations,
    queryFn: () => dmService.getConversations(),
  })
}

export function useDmMessages(conversationId: number) {
  return useInfiniteQuery({
    queryKey: dmKeys.messages(conversationId),
    queryFn: ({ pageParam }) =>
      dmService.getMessages(conversationId, pageParam as number | undefined),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: DmMessage[]) =>
      lastPage.length > 0 ? lastPage[0].id : undefined,
    enabled: !!conversationId,
    select: (data) => ({
      ...data,
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  })
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: dmKeys.searchUser(query),
    queryFn: () => dmService.searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 10_000,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useOpenDm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: OpenDmPayload) => dmService.openConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dmKeys.conversations })
    },
  })
}

export function useSendDm(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendDmPayload) =>
      dmService.sendMessage(conversationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dmKeys.messages(conversationId),
      })
      queryClient.invalidateQueries({ queryKey: dmKeys.conversations })
    },
  })
}

export function useEditDm(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      dmService.editMessage(conversationId, id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dmKeys.messages(conversationId),
      })
    },
  })
}

export function useDeleteDm(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, mode }: { messageId: number; mode: DeleteDmMode }) =>
      dmService.deleteMessage(conversationId, messageId, mode),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dmKeys.messages(conversationId),
      })
    },
  })
}

export function useAddDmReaction(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: number; emoji: string }) =>
      dmService.addReaction(conversationId, messageId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dmKeys.messages(conversationId),
      })
    },
  })
}

export function useRemoveDmReaction(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: number; emoji: string }) =>
      dmService.removeReaction(conversationId, messageId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dmKeys.messages(conversationId),
      })
    },
  })
}
