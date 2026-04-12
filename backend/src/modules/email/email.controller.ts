import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto';

// TODO: Add proper authentication guard
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('email')
// @UseGuards(JwtAuthGuard)
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send an email for a business
   * POST /api/email/:businessId/send
   */
  @Post(':businessId/send')
  @HttpCode(HttpStatus.OK)
  async sendEmail(
    @Param('businessId') businessId: string,
    @Body() dto: SendEmailDto,
  ) {
    this.logger.log(`Sending email for business ${businessId} to ${dto.to}`);

    const result = await this.emailService.sendEmail(businessId, dto);

    return {
      success: true,
      ...result,
    };
  }
}
