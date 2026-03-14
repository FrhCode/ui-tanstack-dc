import { ApiError } from '#/lib/api'
import { serverService } from '#/services/server.service'
import type {
  CreateChannelPayload,
  CreateServerPayload,
  JoinServerPayload,
  Message,
  SendMessagePayload,
} from '#/types'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

// ── Query Keys ──────────────────────────────────────────────────────────────

export const serverKeys = {
  all: ['servers'] as const,
  detail: (id: number) => ['servers', id] as const,
  messages: (channelId: number) => ['messages', channelId] as const,
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function useServers() {
  return useQuery({
    queryKey: serverKeys.all,
    queryFn: () => serverService.getServers(),
  })
}

export function useServer(id: number) {
  return useQuery({
    queryKey: serverKeys.detail(id),
    queryFn: () => serverService.getServer(id),
    enabled: !!id,
    retry: (_, error) =>
      !(error instanceof ApiError && error.statusCode === 403),
  })
}

export function useMessages(channelId: number) {
  return useInfiniteQuery({
    queryKey: serverKeys.messages(channelId),
    queryFn: ({ pageParam }) =>
      serverService.getMessages(channelId, pageParam as number | undefined),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: Message[]) =>
      lastPage.length > 0 ? lastPage[0].id : undefined,
    retry: (_, error) =>
      !(error instanceof ApiError && error.statusCode === 403),
    select: (data) => ({
      ...data,
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateServer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateServerPayload) =>
      serverService.createServer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.all })
    },
  })
}

export function useJoinServer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: JoinServerPayload) =>
      serverService.joinServer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.all })
    },
  })
}

export function useLeaveServer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (serverId: number) => serverService.leaveServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.all })
    },
  })
}

export function useCreateChannel(serverId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateChannelPayload) =>
      serverService.createChannel(serverId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.detail(serverId) })
    },
  })
}

export function useDeleteChannel(serverId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (channelId: number) =>
      serverService.deleteChannel(serverId, channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.detail(serverId) })
    },
  })
}

export function useSendMessage(channelId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      serverService.sendMessage(channelId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serverKeys.messages(channelId),
      })
    },
  })
}

export function useEditMessage(channelId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      serverService.editMessage(channelId, id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serverKeys.messages(channelId),
      })
    },
  })
}

export function useDeleteMessage(channelId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (messageId: number) =>
      serverService.deleteMessage(channelId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serverKeys.messages(channelId),
      })
    },
  })
}
