import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as twilio from 'twilio';
import { VoiceService } from './services/voice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../../generated/prisma';
import { PrismaService } from '../../prisma';
import { ConfigService } from '@nestjs/config';

@ApiTags('voice')
@Controller('voice')
export class VoiceController {
  private readonly logger = new Logger(VoiceController.name);

  constructor(
    private readonly voiceService: VoiceService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get access token for Twilio Client SDK
   */
  @Get('token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Twilio Voice access token for browser calling' })
  @ApiResponse({ status: 200, description: 'Access token generated' })
  async getAccessToken(@CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }

    const tokenData = await this.voiceService.generateAccessToken(
      user.id,
      user.currentBusinessId,
    );

    return {
      success: true,
      data: tokenData,
    };
  }

  /**
   * Make an outbound call
   */
  @Post('call')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate an outbound call' })
  @ApiResponse({ status: 201, description: 'Call initiated' })
  async makeCall(
    @CurrentUser() user: User,
    @Body() body: { to: string; from?: string },
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }

    const call = await this.voiceService.makeCall(user.currentBusinessId, {
      to: body.to,
      from: body.from,
    });

    return {
      success: true,
      data: {
        callSid: call.sid,
        to: call.to,
        from: call.from,
        status: call.status,
      },
    };
  }

  /**
   * Log an outbound call (from browser SDK)
   */
  @Post('call/log')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log an outbound call from browser' })
  @ApiResponse({ status: 201, description: 'Call logged' })
  async logCall(
    @CurrentUser() user: User,
    @Body() body: { to: string; callSid?: string; from?: string },
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }

    const conversation = await this.voiceService.logOutboundCall(
      user.currentBusinessId,
      user.id,
      body.to,
      body.callSid || `browser_${Date.now()}`,
      body.from,
    );

    return {
      success: true,
      data: {
        conversationId: conversation.id,
        contactId: conversation.contactId,
      },
    };
  }

  /**
   * Update call status (from browser SDK)
   */
  @Post('call/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update call status from browser' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateCallStatus(
    @Body() body: { callSid: string; status: string; duration?: number },
  ) {
    this.logger.log(`Received call status update: ${JSON.stringify(body)}`);

    await this.voiceService.updateCallStatus(
      body.callSid,
      body.status,
      body.duration,
    );

    return {
      success: true,
    };
  }

  /**
   * End an active call
   */
  @Post('call/:callSid/end')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End an active call' })
  @ApiResponse({ status: 200, description: 'Call ended' })
  async endCall(@Param('callSid') callSid: string) {
    const result = await this.voiceService.endCall(callSid);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Save/update business phone number
   */
  @Post('phone-number')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save or update business phone number' })
  @ApiResponse({ status: 201, description: 'Phone number saved' })
  async savePhoneNumber(
    @CurrentUser() user: User,
    @Body() body: { phoneNumber: string; friendlyName?: string; isPrimary?: boolean },
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }

    const result = await this.voiceService.saveBusinessPhoneNumber(
      user.currentBusinessId,
      body.phoneNumber,
      {
        friendlyName: body.friendlyName,
        isPrimary: body.isPrimary,
      },
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get call history
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get call history' })
  @ApiResponse({ status: 200, description: 'Call history' })
  async getCallHistory(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
    @Query('grouped') grouped?: string,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }

    const history = await this.voiceService.getCallHistory(
      user.currentBusinessId,
      limit ? parseInt(limit, 10) : 50,
      grouped === 'true',
    );

    return {
      success: true,
      data: history,
    };
  }

  /**
   * TwiML webhook for outbound calls
   * This generates the TwiML that tells Twilio how to handle the call
   */
  @Public()
  @Post('twiml')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'TwiML webhook for call handling' })
  async handleTwiml(
    @Res() res: Response,
    @Query('to') to?: string,
    @Body() body?: any,
  ) {
    this.logger.log('TwiML webhook called', { to, body });

    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // Determine if this is an outbound call (has 'to' parameter) or inbound
    if (to) {
      // Outbound call - dial the requested number
      const dial = response.dial({
        callerId: body?.From || this.configService.get('TWILIO_PHONE_NUMBER'),
        timeout: 30,
        record: 'record-from-answer-dual',
      });
      dial.number(to);
    } else if (body?.To) {
      // Inbound call or client-initiated call
      const toNumber = body.To;

      // Check if calling a client identity (browser user)
      if (toNumber.startsWith('client:')) {
        const dial = response.dial({ timeout: 30 });
        dial.client(toNumber.replace('client:', ''));
      } else {
        // Dial the phone number
        const dial = response.dial({
          callerId: body.From || this.configService.get('TWILIO_PHONE_NUMBER'),
          timeout: 30,
        });
        dial.number(toNumber);
      }
    } else {
      // No destination specified - say a message
      response.say('Thank you for calling. Please try again later.');
    }

    res.type('text/xml');
    res.send(response.toString());
  }

  /**
   * Handle incoming voice calls
   */
  @Public()
  @Post('incoming')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook for incoming voice calls' })
  async handleIncomingCall(
    @Res() res: Response,
    @Body() body: any,
  ) {
    this.logger.log('Incoming call webhook', body);

    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    const callerNumber = body.From;
    const calledNumber = body.To;

    // Find the business associated with this phone number
    const phoneNumber = await this.prisma.businessPhoneNumber.findFirst({
      where: { phoneNumber: calledNumber },
      include: { business: true },
    });

    if (!phoneNumber) {
      response.say('This number is not configured. Please try again later.');
      res.type('text/xml');
      return res.send(response.toString());
    }

    const businessId = phoneNumber.businessId;

    // Find or create contact
    let contact = await this.prisma.contact.findFirst({
      where: {
        businessId,
        phone: callerNumber,
      },
    });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: {
          businessId,
          phone: callerNumber,
          source: 'voice',
        },
      });
    }

    // Create a conversation for this call (AGENT_ACTIVE = in progress call)
    const conversation = await this.prisma.conversation.create({
      data: {
        businessId,
        contactId: contact.id,
        channel: 'VOICE',
        status: 'AGENT_ACTIVE',
        externalId: body.CallSid,
        intentMetadata: {
          callerNumber,
          calledNumber,
          callSid: body.CallSid,
          direction: 'inbound',
        },
      },
    });

    // Find an available user/agent to receive the call
    const businessUsers = await this.prisma.user.findMany({
      where: {
        currentBusinessId: businessId,
        isActive: true,
      },
      take: 5,
    });

    if (businessUsers.length > 0) {
      response.say({ voice: 'alice' }, 'Please hold while we connect you.');

      const dial = response.dial({
        timeout: 30,
        action: `${this.configService.get('WEBHOOK_BASE_URL')}/voice/dial-status?conversationId=${conversation.id}`,
      });

      // Try to connect to each user's client
      for (const user of businessUsers) {
        dial.client(`user_${user.id}_${businessId}`);
      }
    } else {
      // No users available - leave a message
      response.say(
        { voice: 'alice' },
        'We are sorry, but no one is available to take your call at this time. Please leave a message after the beep.',
      );
      response.record({
        maxLength: 120,
        action: `${this.configService.get('WEBHOOK_BASE_URL')}/voice/recording?conversationId=${conversation.id}`,
        transcribe: true,
        transcribeCallback: `${this.configService.get('WEBHOOK_BASE_URL')}/voice/transcription?conversationId=${conversation.id}`,
      });
    }

    res.type('text/xml');
    res.send(response.toString());
  }

  /**
   * Call status callback webhook
   */
  @Public()
  @Post('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook for call status updates' })
  async handleCallStatus(@Body() body: any) {
    this.logger.log('Call status update', {
      callSid: body.CallSid,
      status: body.CallStatus,
      duration: body.CallDuration,
    });

    // Find the conversation by external ID (CallSid)
    const conversation = await this.prisma.conversation.findFirst({
      where: { externalId: body.CallSid },
    });

    if (conversation) {
      // Update conversation status based on call status
      const callStatus = body.CallStatus;
      let conversationStatus = conversation.status;

      if (callStatus === 'completed' || callStatus === 'busy' || callStatus === 'no-answer' || callStatus === 'failed') {
        conversationStatus = 'CLOSED';
      }

      // Store call metadata in intentMetadata (existing Json field)
      const existingMetadata = (conversation.intentMetadata as object) || {};

      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          status: conversationStatus,
          intentMetadata: {
            ...existingMetadata,
            callStatus,
            callDuration: body.CallDuration ? parseInt(body.CallDuration, 10) : undefined,
            endTime: callStatus === 'completed' ? new Date().toISOString() : undefined,
          },
        },
      });

      // Create a message record for the call
      if (callStatus === 'completed' && body.CallDuration) {
        await this.prisma.message.create({
          data: {
            conversationId: conversation.id,
            body: `Call ${callStatus} - Duration: ${Math.floor(body.CallDuration / 60)}:${(body.CallDuration % 60).toString().padStart(2, '0')}`,
            direction: 'INBOUND',
            sender: 'CUSTOMER',
            status: 'DELIVERED',
          },
        });
      }
    }

    return { success: true };
  }

  /**
   * Dial status callback (when dial completes)
   */
  @Public()
  @Post('dial-status')
  @HttpCode(HttpStatus.OK)
  async handleDialStatus(
    @Query('conversationId') conversationId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    this.logger.log('Dial status', { conversationId, dialStatus: body.DialCallStatus });

    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // If no one answered, offer voicemail
    if (body.DialCallStatus !== 'answered') {
      response.say(
        { voice: 'alice' },
        'We apologize, but no one is available at the moment. Please leave a message after the beep.',
      );
      response.record({
        maxLength: 120,
        action: `${this.configService.get('WEBHOOK_BASE_URL')}/voice/recording?conversationId=${conversationId}`,
      });
    }

    res.type('text/xml');
    res.send(response.toString());
  }

  /**
   * Recording callback
   */
  @Public()
  @Post('recording')
  @HttpCode(HttpStatus.OK)
  async handleRecording(
    @Query('conversationId') conversationId: string,
    @Body() body: any,
  ) {
    this.logger.log('Recording received', { conversationId, recordingUrl: body.RecordingUrl });

    if (conversationId) {
      await this.prisma.message.create({
        data: {
          conversationId,
          body: `Voicemail received - Recording: ${body.RecordingUrl}`,
          direction: 'INBOUND',
          sender: 'CUSTOMER',
          status: 'DELIVERED',
          twilioMessageSid: body.RecordingSid,
        },
      });
    }

    return { success: true };
  }

  /**
   * Transcription callback
   */
  @Public()
  @Post('transcription')
  @HttpCode(HttpStatus.OK)
  async handleTranscription(
    @Query('conversationId') conversationId: string,
    @Body() body: any,
  ) {
    this.logger.log('Transcription received', { conversationId, transcription: body.TranscriptionText });

    if (conversationId && body.TranscriptionText) {
      // Find and update the voicemail message with transcription
      const messages = await this.prisma.message.findMany({
        where: {
          conversationId,
          twilioMessageSid: body.RecordingSid,
        },
      });

      if (messages.length > 0) {
        await this.prisma.message.update({
          where: { id: messages[0].id },
          data: {
            body: `Voicemail: ${body.TranscriptionText}`,
          },
        });
      }
    }

    return { success: true };
  }
}
