-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OWNER', 'AGENT');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('STARTER', 'GROWTH', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('BOOKING', 'SUPPORT', 'INQUIRIES', 'MARKETING');

-- CreateEnum
CREATE TYPE "ConversationChannel" AS ENUM ('SMS', 'WHATSAPP', 'VOICE', 'EMAIL');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('BOT_HANDLED', 'ESCALATED', 'AGENT_ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('CUSTOMER', 'BOT', 'AGENT');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "InquiryPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "InquiryCategory" AS ENUM ('GENERAL', 'PRICING', 'AVAILABILITY', 'SUPPORT', 'COMPLAINT', 'FEEDBACK', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'COMPLETED', 'PAUSED', 'FAILED');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('SMS', 'WHATSAPP', 'EMAIL');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "customerNotes" TEXT,
    "serviceType" TEXT,
    "price" DECIMAL(10,2),
    "location" TEXT,
    "meetingUrl" TEXT,
    "reminderSent24h" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent1h" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "source" TEXT NOT NULL DEFAULT 'sms',
    "metadata" JSONB,
    "contactId" TEXT,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "brandColor" TEXT,
    "industry" TEXT,
    "timezone" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "businessHours" JSONB,
    "faqResponses" JSONB,
    "emailFromAddress" TEXT,
    "emailFromName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onboardingCompletedAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_features" (
    "id" TEXT NOT NULL,
    "featureType" "FeatureType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CampaignType" NOT NULL DEFAULT 'SMS',
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "messageTemplate" TEXT NOT NULL,
    "mediaUrls" JSONB,
    "targetTags" JSONB,
    "excludeTags" JSONB,
    "recipientPhones" JSONB,
    "recipientEmails" JSONB,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "messagesSent" INTEGER NOT NULL DEFAULT 0,
    "messagesDelivered" INTEGER NOT NULL DEFAULT 0,
    "messagesFailed" INTEGER NOT NULL DEFAULT 0,
    "messagesRead" INTEGER NOT NULL DEFAULT 0,
    "responses" INTEGER NOT NULL DEFAULT 0,
    "optOuts" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "tags" JSONB,
    "customFields" JSONB,
    "source" TEXT,
    "notes" TEXT,
    "optedOutSms" BOOLEAN NOT NULL DEFAULT false,
    "optedOutWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "optedOutEmail" BOOLEAN NOT NULL DEFAULT false,
    "lastContactedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "channel" "ConversationChannel" NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'BOT_HANDLED',
    "subject" TEXT,
    "lastMessagePreview" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "detectedIntent" TEXT,
    "intentMetadata" JSONB,
    "assignedAgentId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "escalatedAt" TIMESTAMP(3),
    "escalationReason" TEXT,
    "contactId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "twilioMessageSid" TEXT,
    "twilioFrom" TEXT,
    "twilioTo" TEXT,
    "emailMessageId" TEXT,
    "emailSubject" TEXT,
    "emailFrom" TEXT,
    "emailTo" TEXT,
    "emailCc" TEXT,
    "emailBcc" TEXT,
    "emailReplyToMessageId" TEXT,
    "emailHtml" TEXT,
    "mediaUrls" JSONB,
    "agentId" TEXT,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "InquiryPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" "InquiryCategory" NOT NULL DEFAULT 'GENERAL',
    "autoResponded" BOOLEAN NOT NULL DEFAULT false,
    "autoResponseContent" TEXT,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "escalatedAt" TIMESTAMP(3),
    "escalationReason" TEXT,
    "assignedAgentId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "conversationId" TEXT,
    "contactId" TEXT,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'STARTER',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "maxPhoneNumbers" INTEGER NOT NULL DEFAULT 1,
    "maxMessagesPerMonth" INTEGER NOT NULL DEFAULT 100,
    "messagesUsedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "callMinutesUsedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "monthlyPrice" DECIMAL(10,2) NOT NULL DEFAULT 29,
    "currency" TEXT,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twilio_subaccounts" (
    "id" TEXT NOT NULL,
    "accountSid" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "friendlyName" TEXT,
    "workspaceSid" TEXT,
    "messagingServiceSid" TEXT,
    "taskRouterWorkspaceSid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isMock" BOOLEAN NOT NULL DEFAULT false,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "twilio_subaccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_numbers" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "friendlyName" TEXT,
    "twilioSid" TEXT,
    "country" TEXT,
    "areaCode" TEXT,
    "voiceEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "voiceWebhookUrl" TEXT,
    "smsWebhookUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isMock" BOOLEAN NOT NULL DEFAULT false,
    "monthlyCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OWNER',
    "avatarUrl" TEXT,
    "phone" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "currentBusinessId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_slug_key" ON "businesses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_businessId_key" ON "subscriptions"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "twilio_subaccounts_accountSid_key" ON "twilio_subaccounts"("accountSid");

-- CreateIndex
CREATE UNIQUE INDEX "twilio_subaccounts_businessId_key" ON "twilio_subaccounts"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_features" ADD CONSTRAINT "business_features_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twilio_subaccounts" ADD CONSTRAINT "twilio_subaccounts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_numbers" ADD CONSTRAINT "phone_numbers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentBusinessId_fkey" FOREIGN KEY ("currentBusinessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
