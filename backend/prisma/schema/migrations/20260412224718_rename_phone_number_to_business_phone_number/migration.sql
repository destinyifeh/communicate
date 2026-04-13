/*
  Warnings:

  - You are about to drop the `phone_numbers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "phone_numbers" DROP CONSTRAINT "phone_numbers_businessId_fkey";

-- DropTable
DROP TABLE "phone_numbers";

-- CreateTable
CREATE TABLE "business_phone_numbers" (
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

    CONSTRAINT "business_phone_numbers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "business_phone_numbers" ADD CONSTRAINT "business_phone_numbers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
