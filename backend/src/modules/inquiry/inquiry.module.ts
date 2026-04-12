import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { IntentDetectorService } from './services/intent-detector.service';
import { RouterService } from './services/router.service';

@Module({
  // PrismaModule is global, so PrismaService is already available
  controllers: [InquiryController],
  providers: [InquiryService, IntentDetectorService, RouterService],
  exports: [InquiryService, IntentDetectorService],
})
export class InquiryModule {}
