import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  verificationEmailTemplate,
  passwordResetEmailTemplate,
  passwordChangedEmailTemplate,
  welcomeEmailTemplate,
} from './templates';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    console.log('=== MAIL SERVICE INIT ===');
    console.log('RESEND_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');

    if (!apiKey || apiKey === 're_xxxxxxxxxxxx') {
      this.logger.warn('RESEND_API_KEY not configured - emails will be logged only');
    }
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get('EMAIL_FROM_DEFAULT', 'onboarding@resend.dev');
    this.fromName = this.configService.get('EMAIL_FROM_NAME', 'Communicate');
    this.frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');

    console.log('FROM EMAIL:', this.fromEmail);
    console.log('FROM NAME:', this.fromName);
    console.log('=========================');
  }

  private get from(): string {
    return `${this.fromName} <${this.fromEmail}>`;
  }

  async sendVerificationEmail(to: string, firstName: string, otp: string): Promise<boolean> {
    console.log('========================================');
    console.log('sendVerificationEmail CALLED');
    console.log('TO:', to);
    console.log('FIRST NAME:', firstName);
    console.log('OTP:', otp);
    console.log('========================================');

    const html = verificationEmailTemplate({ firstName, otp });

    return this.send({
      to,
      subject: 'Verify your email - Communicate',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, firstName: string, token: string): Promise<boolean> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
    const otp = token.length === 6 ? token : undefined;
    const html = passwordResetEmailTemplate({ firstName, resetUrl, otp });

    return this.send({
      to,
      subject: 'Reset your password - Communicate',
      html,
    });
  }

  async sendPasswordChangedEmail(to: string, firstName: string): Promise<boolean> {
    const html = passwordChangedEmailTemplate({ firstName });

    return this.send({
      to,
      subject: 'Password changed - Communicate',
      html,
    });
  }

  async sendWelcomeEmail(to: string, firstName: string, businessName: string): Promise<boolean> {
    const loginUrl = `${this.frontendUrl}/login`;
    const html = welcomeEmailTemplate({ firstName, businessName, loginUrl });

    return this.send({
      to,
      subject: 'Welcome to Communicate!',
      html,
    });
  }

  private async send(options: { to: string; subject: string; html: string }): Promise<boolean> {
    console.log('=== SENDING EMAIL ===');
    console.log('TO:', options.to);
    console.log('SUBJECT:', options.subject);
    console.log('FROM:', this.from);
    console.log('HTML LENGTH:', options.html?.length || 0);

    try {
      const payload = {
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };
      console.log('RESEND PAYLOAD:', JSON.stringify({ ...payload, html: '[TRUNCATED]' }));

      const { data, error } = await this.resend.emails.send(payload);

      console.log('RESEND RESPONSE - data:', data);
      console.log('RESEND RESPONSE - error:', error);

      if (error) {
        this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
        console.log('EMAIL SEND FAILED:', error);
        return false;
      }

      this.logger.log(`Email sent to ${options.to}: ${data?.id}`);
      console.log('EMAIL SENT SUCCESSFULLY - ID:', data?.id);
      console.log('=====================');
      return true;
    } catch (err) {
      this.logger.error(`Failed to send email to ${options.to}`, err);
      console.log('EMAIL SEND EXCEPTION:', err);
      return false;
    }
  }
}
