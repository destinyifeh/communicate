import { apiClient } from './api-client';

// Backend wraps responses in this format
interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export interface VoiceToken {
  token: string;
  identity: string;
  expiresIn: number;
  phoneNumber?: string;
  businessName?: string;
}

export interface CallHistoryItem {
  id: string;
  callSid?: string;
  direction: 'inbound' | 'outbound';
  status: string;
  from: string;
  to: string;
  phoneNumber?: string;
  duration: number;
  timestamp: string;
  contact?: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone: string;
  };
  // Grouped history fields
  callCount?: number;
  totalDuration?: number;
  calls?: CallHistoryItem[];
}

export interface MakeCallRequest {
  to: string;
  from?: string;
}

export interface MakeCallResponse {
  callSid: string;
  to: string;
  from: string;
  status: string;
}

export interface LogCallRequest {
  to: string;
  callSid?: string;
  from?: string;
}

export interface LogCallResponse {
  conversationId: string;
  contactId: string;
}

export interface UpdateCallStatusRequest {
  callSid: string;
  status: string;
  duration?: number;
}

class VoiceService {
  /**
   * Get access token for Twilio Client SDK
   */
  async getAccessToken(): Promise<BackendResponse<VoiceToken>> {
    return apiClient.get<BackendResponse<VoiceToken>>('/api/voice/token');
  }

  /**
   * Make an outbound call via REST API
   */
  async makeCall(request: MakeCallRequest): Promise<BackendResponse<MakeCallResponse>> {
    return apiClient.post<BackendResponse<MakeCallResponse>>('/api/voice/call', request);
  }

  /**
   * Log an outbound call from browser SDK
   */
  async logCall(request: LogCallRequest): Promise<BackendResponse<LogCallResponse>> {
    return apiClient.post<BackendResponse<LogCallResponse>>('/api/voice/call/log', request);
  }

  /**
   * Update call status
   */
  async updateCallStatus(request: UpdateCallStatusRequest): Promise<BackendResponse<{ success: boolean }>> {
    return apiClient.post<BackendResponse<{ success: boolean }>>('/api/voice/call/status', request);
  }

  /**
   * End an active call
   */
  async endCall(callSid: string): Promise<BackendResponse<{ success: boolean }>> {
    return apiClient.post<BackendResponse<{ success: boolean }>>(`/api/voice/call/${callSid}/end`);
  }

  /**
   * Get call history
   */
  async getCallHistory(limit?: number, grouped?: boolean): Promise<BackendResponse<CallHistoryItem[]>> {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append('limit', limit.toString());
    if (grouped) searchParams.append('grouped', 'true');
    const params = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get<BackendResponse<CallHistoryItem[]>>(`/api/voice/history${params}`);
  }
}

export const voiceService = new VoiceService();
