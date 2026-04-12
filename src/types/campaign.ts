// Campaign-related types

export type CampaignType = 'SMS' | 'WHATSAPP' | 'EMAIL';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'PAUSED' | 'FAILED';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  messageTemplate: string;
  mediaUrls?: string[];
  targetTags?: string[];
  excludeTags?: string[];
  recipientPhones?: string[];
  recipientEmails?: string[];
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  totalRecipients: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  messagesRead: number;
  responses: number;
  optOuts: number;
  totalCost: number;
  createdById?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignData {
  name: string;
  description?: string;
  type: CampaignType;
  messageTemplate: string;
  mediaUrls?: string[];
  targetTags?: string[];
  excludeTags?: string[];
  recipientPhones?: string[];
  recipientEmails?: string[];
  scheduledAt?: string;
}

export interface UpdateCampaignData {
  name?: string;
  description?: string;
  messageTemplate?: string;
  mediaUrls?: string[];
  targetTags?: string[];
  excludeTags?: string[];
  scheduledAt?: string;
}

export interface CampaignFilters {
  type?: CampaignType;
  status?: CampaignStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalMessagesSent: number;
  totalDelivered: number;
  totalFailed: number;
  averageDeliveryRate: number;
  averageReadRate: number;
  totalCost: number;
}

export interface SendTestMessageData {
  phone: string;
}
