-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "sender" SET DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE "twilio_subaccounts" ADD COLUMN     "twimlAppSid" TEXT;
