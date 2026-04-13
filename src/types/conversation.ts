// Conversation and Message types
import type { Contact } from './contact';

export type ConversationChannel = 'SMS' | 'WHATSAPP' | 'VOICE' | 'EMAIL';
export type ConversationStatus = 'BOT_HANDLED' | 'ESCALATED' | 'AGENT_ACTIVE' | 'CLOSED';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageSender = 'CUSTOMER' | 'BOT' | 'AGENT';
export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface Conversation {
  id: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  subject?: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  starred: boolean;
  detectedIntent?: string;
  intentMetadata?: Record<string, any>;
  assignedAgentId?: string;
  assignedAt?: string;
  escalatedAt?: string;
  escalationReason?: string;
  contactId: string;
  contact?: Contact;
  businessId: string;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  body: string;
  direction: MessageDirection;
  sender: MessageSender;
  status: MessageStatus;
  twilioMessageSid?: string;
  twilioFrom?: string;
  twilioTo?: string;
  emailMessageId?: string;
  emailSubject?: string;
  emailFrom?: string;
  emailTo?: string;
  emailCc?: string;
  emailBcc?: string;
  emailHtml?: string;
  mediaUrls?: string[];
  agentId?: string;
  conversationId: string;
  createdAt: string;
}

export interface SendMessageData {
  body: string;
  mediaUrls?: string[];
  subject?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
}

export interface ConversationFilters {
  channel?: ConversationChannel;
  excludeChannel?: ConversationChannel;
  status?: ConversationStatus;
  starred?: boolean;
  assignedAgentId?: string;
  search?: string;
}

export interface EscalateConversationData {
  reason: string;
  agentId?: string;
}

export interface AssignAgentData {
  agentId: string;
}
