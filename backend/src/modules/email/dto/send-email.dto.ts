import { IsString, IsEmail, IsOptional, IsArray, IsUUID } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsEmail()
  @IsOptional()
  replyTo?: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  cc?: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  bcc?: string[];

  @IsUUID()
  @IsOptional()
  conversationId?: string;

  @IsUUID()
  @IsOptional()
  contactId?: string;
}

export class InboundEmailDto {
  @IsString()
  type: string;

  data: {
    id: string;
    from: string;
    to: string[];
    subject: string;
    text?: string;
    html?: string;
    headers?: Record<string, string>;
    attachments?: Array<{
      filename: string;
      content_type: string;
      content: string;
    }>;
  };
}

export class EmailWebhookEventDto {
  @IsString()
  type: string; // 'email.sent', 'email.delivered', 'email.bounced', 'email.complained', 'email.opened', 'email.clicked'

  @IsString()
  @IsOptional()
  created_at?: string;

  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    [key: string]: unknown;
  };
}
