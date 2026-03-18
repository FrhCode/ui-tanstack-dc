export type DmReaction = {
  emoji: string
  user_id: number
  user_name: string
}

export type DmRepliedMessage = {
  id: number
  content: string | null
  sender_name: string
  is_deleted: boolean
}

export type DmMessage = {
  id: number
  content: string | null
  is_deleted: boolean
  conversation_id: number
  sender_id: number
  sender_name: string
  attachment_url: string | null
  attachment_name: string | null
  attachment_type: string | null
  attachment_size: number | null
  quoted_content: string | null
  quoted_sender_name: string | null
  reply_to_message_id: number | null
  reply_preview: DmRepliedMessage | null
  created_at: string
  modified_at: string
  reactions: DmReaction[]
}

export type DmConversations = {
  id: number
  user_one_id: number
  user_two_id: number
  created_at: string
  partner: { id: number; name: string }
  last_message: {
    conversation_id: number
    id: number
    content: string | null
    sender_id: number
    sender_name: string
    attachment_url: string | null
    quoted_content: string | null
    quoted_sender_name: string | null
    created_at: Date
    modified_at: Date
  } | null
}

export type DmConversation = {
  id: number
  user_one_id: number
  user_two_id: number
  created_at: string
  partner: { id: number; name: string }
}

export type SendDmPayload = {
  content?: string
  attachment?: File
  quoted_content?: string
  quoted_sender_name?: string
  reply_to_message_id?: number
}

export type DeleteDmMode = 'for_me' | 'for_everyone'

export type SendInvitationRequest = {
  email: string
}

export type OpenDmPayload = {
  id: number
}
