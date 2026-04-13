import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma';
import * as twilio from 'twilio';
import { Twilio } from 'twilio';
import { VoiceGrant } from 'twilio/lib/jwt/AccessToken';
import AccessToken = require('twilio/lib/jwt/AccessToken');
import { normalizePhoneNumber } from '../../../common/utils';

export interface VoiceTokenResponse {
  token: string;
  identity: string;
  expiresIn: number;
  phoneNumber?: string;
  businessName?: string;
}

export interface CallOptions {
  to: string;
  from?: string;
  callerId?: string;
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private client: Twilio;
  private accountSid: string;
  private authToken: string;
  private twimlAppSid: string | null = null;
  private useMock: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID', '');
    this.authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN', '');
    this.twimlAppSid = this.configService.get<string>('TWILIO_TWIML_APP_SID', '');
    this.useMock = this.configService.get<string>('TWILIO_USE_MOCK', 'true') === 'true';

    if (!this.useMock && this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
      this.logger.log('Twilio Voice Service initialized with real credentials');
    } else {
      this.logger.warn('Twilio Voice Service running in MOCK mode');
    }
  }

  /**
   * Generate an access token for Twilio Client SDK (browser-based calling)
   */
  async generateAccessToken(userId: string, businessId: string): Promise<VoiceTokenResponse> {
    // Get user identity
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get business info and phone number
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { name: true },
    });

    let phoneNumber = await this.prisma.businessPhoneNumber.findFirst({
      where: { businessId, isPrimary: true },
      select: { phoneNumber: true },
    });

    // If no phone number exists, auto-create one from env variable (lazy initialization)
    const envPhoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    if (!phoneNumber && envPhoneNumber) {
      await this.prisma.businessPhoneNumber.create({
        data: {
          phoneNumber: envPhoneNumber,
          friendlyName: `${business?.name || 'Business'} Line`,
          voiceEnabled: true,
          smsEnabled: true,
          isPrimary: true,
          status: 'active',
          businessId,
        },
      });
      phoneNumber = { phoneNumber: envPhoneNumber };
      this.logger.log(`Auto-created business phone number for business: ${businessId}`);
    }

    const businessPhone = phoneNumber?.phoneNumber || envPhoneNumber;

    // Create a unique identity for this user
    const identity = `user_${userId}_${businessId}`;

    if (this.useMock) {
      // Return a mock token for development
      return {
        token: `mock_token_${identity}_${Date.now()}`,
        identity,
        expiresIn: 3600,
        phoneNumber: businessPhone,
        businessName: business?.name,
      };
    }

    // Get or create TwiML App for this business
    const twimlAppSid = await this.getOrCreateTwimlApp(businessId);

    // Create access token
    const token = new AccessToken(
      this.accountSid,
      this.configService.get<string>('TWILIO_API_KEY_SID', this.accountSid),
      this.configService.get<string>('TWILIO_API_KEY_SECRET', this.authToken),
      {
        identity,
        ttl: 3600, // 1 hour
      },
    );

    // Create Voice grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    return {
      token: token.toJwt(),
      identity,
      expiresIn: 3600,
      phoneNumber: businessPhone,
      businessName: business?.name,
    };
  }

  /**
   * Get or create a TwiML Application for voice calls
   */
  private async getOrCreateTwimlApp(businessId: string): Promise<string> {
    // Check if we have a stored TwiML App SID
    if (this.twimlAppSid) {
      return this.twimlAppSid;
    }

    // Check database for business-specific TwiML app
    const subaccount = await this.prisma.twilioSubaccount.findUnique({
      where: { businessId },
    });

    if (subaccount?.twimlAppSid) {
      return subaccount.twimlAppSid;
    }

    if (this.useMock) {
      return 'AP_mock_twiml_app_sid';
    }

    // Create a new TwiML App
    const webhookBaseUrl = this.configService.get<string>('WEBHOOK_BASE_URL', 'http://localhost:3001/api');

    try {
      const app = await this.client.applications.create({
        friendlyName: `Communicate Voice App - ${businessId}`,
        voiceUrl: `${webhookBaseUrl}/voice/twiml`,
        voiceMethod: 'POST',
        statusCallback: `${webhookBaseUrl}/voice/status`,
        statusCallbackMethod: 'POST',
      });

      // Store the TwiML App SID
      if (subaccount) {
        await this.prisma.twilioSubaccount.update({
          where: { businessId },
          data: { twimlAppSid: app.sid },
        });
      }

      this.logger.log(`Created TwiML App: ${app.sid}`);
      return app.sid;
    } catch (error) {
      this.logger.error('Failed to create TwiML App', error);
      throw error;
    }
  }

  /**
   * Generate TwiML for outbound calls
   */
  generateOutboundTwiml(to: string, callerId: string): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // Dial the number
    const dial = response.dial({
      callerId,
      timeout: 30,
      record: 'record-from-answer-dual', // Record both legs
    });

    dial.number(to);

    return response.toString();
  }

  /**
   * Generate TwiML for inbound calls
   */
  generateInboundTwiml(clientIdentity: string, callerNumber: string): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // Connect to the browser client
    const dial = response.dial({
      timeout: 30,
      record: 'record-from-answer-dual',
    });

    dial.client(clientIdentity);

    return response.toString();
  }

  /**
   * Make an outbound call via Twilio REST API
   */
  async makeCall(businessId: string, options: CallOptions): Promise<any> {
    if (this.useMock) {
      this.logger.log(`[MOCK] Making call to ${options.to}`);
      return {
        sid: `CA_mock_${Date.now()}`,
        to: options.to,
        from: options.from || '+15551234567',
        status: 'queued',
        direction: 'outbound-api',
        dateCreated: new Date(),
      };
    }

    // Get the business phone number
    const phoneNumber = await this.prisma.businessPhoneNumber.findFirst({
      where: {
        businessId,
        isPrimary: true,
      },
    });

    const from = options.from || phoneNumber?.phoneNumber;
    if (!from) {
      throw new Error('No phone number available for outbound calls');
    }

    const webhookBaseUrl = this.configService.get<string>('WEBHOOK_BASE_URL', 'http://localhost:3001/api');

    try {
      const call = await this.client.calls.create({
        to: options.to,
        from,
        url: `${webhookBaseUrl}/voice/twiml?to=${encodeURIComponent(options.to)}`,
        statusCallback: `${webhookBaseUrl}/voice/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
      });

      this.logger.log(`Created call ${call.sid} to ${options.to}`);
      return call;
    } catch (error) {
      this.logger.error('Failed to create call', error);
      throw error;
    }
  }

  /**
   * End an active call
   */
  async endCall(callSid: string): Promise<any> {
    if (this.useMock) {
      this.logger.log(`[MOCK] Ending call ${callSid}`);
      return { sid: callSid, status: 'completed' };
    }

    try {
      const call = await this.client.calls(callSid).update({
        status: 'completed',
      });
      return call;
    } catch (error) {
      this.logger.error(`Failed to end call ${callSid}`, error);
      throw error;
    }
  }

  /**
   * Get call details
   */
  async getCall(callSid: string): Promise<any> {
    if (this.useMock) {
      return {
        sid: callSid,
        status: 'completed',
        duration: 120,
        direction: 'outbound-api',
      };
    }

    try {
      return await this.client.calls(callSid).fetch();
    } catch (error) {
      this.logger.error(`Failed to fetch call ${callSid}`, error);
      throw error;
    }
  }

  /**
   * Log an outbound call to the database
   */
  async logOutboundCall(
    businessId: string,
    userId: string,
    toNumber: string,
    callSid: string,
    fromNumber?: string,
  ): Promise<any> {
    // Normalize phone number for consistent lookup
    const normalizedPhone = normalizePhoneNumber(toNumber);
    // Get just the digits for flexible matching
    const phoneDigits = toNumber.replace(/\D/g, '');

    // Find or create contact for this number (try multiple formats)
    let contact = await this.prisma.contact.findFirst({
      where: {
        businessId,
        OR: [
          { phone: normalizedPhone },
          { phone: toNumber },
          { phone: phoneDigits },
          { phone: { contains: phoneDigits.slice(-10) } },
        ],
      },
    });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: {
          businessId,
          phone: normalizedPhone,
          source: 'voice',
        },
      });
    }

    // Create a conversation for this call
    const conversation = await this.prisma.conversation.create({
      data: {
        businessId,
        contactId: contact.id,
        channel: 'VOICE',
        status: 'AGENT_ACTIVE',
        assignedAgentId: userId,
        externalId: callSid,
        intentMetadata: {
          callerNumber: fromNumber || 'browser',
          calledNumber: toNumber,
          callSid,
          direction: 'outbound',
          startTime: new Date().toISOString(),
        },
      },
      include: {
        contact: true,
      },
    });

    this.logger.log(`Logged outbound call to ${toNumber}, conversation: ${conversation.id}`);
    return conversation;
  }

  /**
   * Update call status and duration
   */
  async updateCallStatus(
    callSid: string,
    status: string,
    duration?: number,
  ): Promise<void> {
    this.logger.log(`Updating call status: callSid=${callSid}, status=${status}, duration=${duration}`);

    const conversation = await this.prisma.conversation.findFirst({
      where: { externalId: callSid },
    });

    if (conversation) {
      const existingMetadata = (conversation.intentMetadata as object) || {};

      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          status: status === 'completed' || status === 'failed' || status === 'busy' || status === 'no-answer'
            ? 'CLOSED'
            : conversation.status,
          intentMetadata: {
            ...existingMetadata,
            callStatus: status,
            callDuration: duration,
            endTime: status === 'completed' ? new Date().toISOString() : undefined,
          },
        },
      });
      this.logger.log(`Updated conversation ${conversation.id} with duration ${duration}`);
    } else {
      this.logger.warn(`No conversation found for callSid: ${callSid}`);
    }
  }

  /**
   * Get call history for a business
   */
  async getCallHistory(businessId: string, limit: number = 50, grouped: boolean = false): Promise<any[]> {
    // Fetch from our database first (logged calls)
    const conversations = await this.prisma.conversation.findMany({
      where: {
        businessId,
        channel: 'VOICE',
      },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2, // Fetch more if we're grouping
    });

    const calls = conversations.map((conv) => {
      const metadata = (conv.intentMetadata as any) || {};
      const phoneNumber = conv.contact?.phone || metadata.calledNumber || metadata.callerNumber || 'Unknown';

      return {
        id: conv.id,
        callSid: conv.externalId,
        direction: metadata.direction || 'inbound',
        status: metadata.callStatus || (conv.status === 'CLOSED' ? 'completed' : 'in-progress'),
        // Always include the actual phone number
        from: metadata.direction === 'outbound' ? 'You' : phoneNumber,
        to: metadata.direction === 'outbound' ? phoneNumber : (metadata.calledNumber || ''),
        // Add phoneNumber field for easy access
        phoneNumber: phoneNumber,
        duration: metadata.callDuration || 0,
        timestamp: conv.createdAt,
        contact: conv.contact,
      };
    });

    if (!grouped) {
      return calls.slice(0, limit);
    }

    // Group calls by phone number
    const groupedCalls = new Map<string, {
      phoneNumber: string;
      contact: any;
      callCount: number;
      totalDuration: number;
      lastCallTimestamp: Date;
      lastCallDirection: string;
      lastCallStatus: string;
      calls: any[];
    }>();

    for (const call of calls) {
      const key = call.phoneNumber;
      if (!groupedCalls.has(key)) {
        groupedCalls.set(key, {
          phoneNumber: call.phoneNumber,
          contact: call.contact,
          callCount: 0,
          totalDuration: 0,
          lastCallTimestamp: call.timestamp,
          lastCallDirection: call.direction,
          lastCallStatus: call.status,
          calls: [],
        });
      }

      const group = groupedCalls.get(key)!;
      group.callCount++;
      group.totalDuration += call.duration || 0;
      group.calls.push(call);

      // Keep the most recent call info
      if (call.timestamp > group.lastCallTimestamp) {
        group.lastCallTimestamp = call.timestamp;
        group.lastCallDirection = call.direction;
        group.lastCallStatus = call.status;
      }
    }

    // Convert map to array and sort by last call timestamp
    const groupedArray = Array.from(groupedCalls.values())
      .sort((a, b) => new Date(b.lastCallTimestamp).getTime() - new Date(a.lastCallTimestamp).getTime())
      .slice(0, limit)
      .map((group) => ({
        id: group.calls[0].id, // Use first call's ID as group ID
        phoneNumber: group.phoneNumber,
        contact: group.contact,
        callCount: group.callCount,
        totalDuration: group.totalDuration,
        direction: group.lastCallDirection,
        status: group.lastCallStatus,
        timestamp: group.lastCallTimestamp,
        // Include all individual calls for expansion
        calls: group.calls,
      }));

    return groupedArray;
  }

  /**
   * Save or update business phone number
   */
  async saveBusinessPhoneNumber(
    businessId: string,
    phoneNumber: string,
    options?: {
      friendlyName?: string;
      voiceEnabled?: boolean;
      smsEnabled?: boolean;
      isPrimary?: boolean;
    },
  ): Promise<any> {
    // Check if a phone number already exists for this business
    const existing = await this.prisma.businessPhoneNumber.findFirst({
      where: { businessId, phoneNumber },
    });

    if (existing) {
      // Update existing
      return this.prisma.businessPhoneNumber.update({
        where: { id: existing.id },
        data: {
          friendlyName: options?.friendlyName,
          voiceEnabled: options?.voiceEnabled ?? existing.voiceEnabled,
          smsEnabled: options?.smsEnabled ?? existing.smsEnabled,
          isPrimary: options?.isPrimary ?? existing.isPrimary,
        },
      });
    }

    // If setting as primary, unset other primary numbers first
    if (options?.isPrimary) {
      await this.prisma.businessPhoneNumber.updateMany({
        where: { businessId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Check if this is the first number (make it primary by default)
    const existingCount = await this.prisma.businessPhoneNumber.count({
      where: { businessId },
    });

    // Create new phone number record
    return this.prisma.businessPhoneNumber.create({
      data: {
        phoneNumber,
        friendlyName: options?.friendlyName || 'Business Line',
        voiceEnabled: options?.voiceEnabled ?? true,
        smsEnabled: options?.smsEnabled ?? true,
        isPrimary: options?.isPrimary ?? existingCount === 0, // First number is primary
        status: 'active',
        businessId,
      },
    });
  }

  /**
   * Get business phone number
   */
  async getBusinessPhoneNumber(businessId: string): Promise<string | null> {
    const phoneNumber = await this.prisma.businessPhoneNumber.findFirst({
      where: { businessId, isPrimary: true },
      select: { phoneNumber: true },
    });

    return phoneNumber?.phoneNumber || this.configService.get<string>('TWILIO_PHONE_NUMBER') || null;
  }
}
