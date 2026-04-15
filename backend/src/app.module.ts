import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma';
import { MailModule } from './modules/mail';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { TwilioModule } from './modules/twilio/twilio.module';
import { BookingModule } from './modules/booking/booking.module';
import { InquiryModule } from './modules/inquiry/inquiry.module';
import { SupportModule } from './modules/support/support.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { BillingModule } from './modules/billing/billing.module';
import { EmailModule } from './modules/email/email.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ConversationsModule } from './modules/conversations/conversations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    ContactsModule,
    ConversationsModule,
    TwilioModule,
    BookingModule,
    InquiryModule,
    SupportModule,
    MessagingModule,
    CampaignsModule,
    BillingModule,
    EmailModule,
  ],
})
export class AppModule {}
