import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, FeatureType } from '../../generated/prisma';

@ApiTags('business')
@Controller('business')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  async create(@Body() createBusinessDto: CreateBusinessDto, @CurrentUser() user: User) {
    return this.businessService.create(createBusinessDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses for current user' })
  @ApiResponse({ status: 200, description: 'List of businesses' })
  async findAll(@CurrentUser() user: User) {
    return this.businessService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific business' })
  @ApiResponse({ status: 200, description: 'Business details' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.businessService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({ status: 200, description: 'Business updated' })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentUser() user: User,
  ) {
    return this.businessService.update(id, updateBusinessDto, user.id);
  }

  @Post(':id/switch')
  @ApiOperation({ summary: 'Switch to this business as current context' })
  @ApiResponse({ status: 200, description: 'Business context switched' })
  async switchBusiness(@Param('id') id: string, @CurrentUser() user: User) {
    return this.businessService.switchBusiness(id, user.id);
  }

  @Patch(':id/features')
  @ApiOperation({ summary: 'Update business features' })
  @ApiResponse({ status: 200, description: 'Features updated' })
  async updateFeatures(
    @Param('id') id: string,
    @Body() body: { features: FeatureType[] },
    @CurrentUser() user: User,
  ) {
    return this.businessService.updateFeatures(id, body.features, user.id);
  }

  @Patch(':id/features/:featureType/toggle')
  @ApiOperation({ summary: 'Toggle a specific feature' })
  @ApiResponse({ status: 200, description: 'Feature toggled' })
  async toggleFeature(
    @Param('id') id: string,
    @Param('featureType') featureType: FeatureType,
    @Body() body: { enabled: boolean },
    @CurrentUser() user: User,
  ) {
    return this.businessService.toggleFeature(id, featureType, body.enabled, user.id);
  }

  @Put(':id/faq')
  @ApiOperation({ summary: 'Update FAQ responses' })
  @ApiResponse({ status: 200, description: 'FAQs updated' })
  async updateFAQ(
    @Param('id') id: string,
    @Body() body: { faqs: { question: string; answer: string; keywords: string[] }[] },
    @CurrentUser() user: User,
  ) {
    return this.businessService.updateFAQResponses(id, body.faqs, user.id);
  }

  @Put(':id/hours')
  @ApiOperation({ summary: 'Update business hours' })
  @ApiResponse({ status: 200, description: 'Business hours updated' })
  async updateHours(
    @Param('id') id: string,
    @Body() body: { hours: { [key: string]: { open: string; close: string; enabled: boolean } } },
    @CurrentUser() user: User,
  ) {
    return this.businessService.updateBusinessHours(id, body.hours, user.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get business statistics' })
  @ApiResponse({ status: 200, description: 'Business stats' })
  async getStats(@Param('id') id: string, @CurrentUser() user: User) {
    return this.businessService.getStats(id, user.id);
  }
}
