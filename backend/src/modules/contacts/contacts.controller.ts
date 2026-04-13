import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import {
  CreateContactDto,
  UpdateContactDto,
  ImportContactsDto,
  AddTagsDto,
  ContactQueryDto,
} from './dto';
import { PaginationDto } from '../../common/dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentBusiness } from '../../common/decorators/current-business.decorator';

@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 409, description: 'Contact with this phone already exists' })
  create(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Body() dto: CreateContactDto,
  ) {
    return this.contactsService.create(businessContext.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts with pagination' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  findAll(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Query() pagination: PaginationDto,
    @Query() filters: ContactQueryDto,
  ) {
    return this.contactsService.findAll(businessContext.id, pagination, filters);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all unique tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  getTags(@CurrentBusiness() businessContext: { id: string; business: any }) {
    return this.contactsService.getTags(businessContext.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get contact statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  getStats(@CurrentBusiness() businessContext: { id: string; business: any }) {
    return this.contactsService.getStats(businessContext.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  findOne(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
  ) {
    return this.contactsService.findOne(businessContext.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  update(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(businessContext.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  delete(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
  ) {
    return this.contactsService.delete(businessContext.id, id);
  }

  @Post(':id/tags')
  @ApiOperation({ summary: 'Add tags to a contact' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Tags added successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  addTags(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
    @Body() dto: AddTagsDto,
  ) {
    return this.contactsService.addTags(businessContext.id, id, dto.tags);
  }

  @Delete(':id/tags')
  @ApiOperation({ summary: 'Remove tags from a contact' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Tags removed successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  removeTags(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
    @Body() dto: AddTagsDto,
  ) {
    return this.contactsService.removeTags(businessContext.id, id, dto.tags);
  }

  @Post(':id/opt-out/:channel')
  @ApiOperation({ summary: 'Opt-out contact from a channel' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiParam({ name: 'channel', enum: ['sms', 'whatsapp', 'email'] })
  @ApiResponse({ status: 200, description: 'Opt-out successful' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  optOut(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
    @Param('channel') channel: 'sms' | 'whatsapp' | 'email',
  ) {
    return this.contactsService.optOut(businessContext.id, id, channel);
  }

  @Post(':id/opt-in/:channel')
  @ApiOperation({ summary: 'Opt-in contact to a channel' })
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiParam({ name: 'channel', enum: ['sms', 'whatsapp', 'email'] })
  @ApiResponse({ status: 200, description: 'Opt-in successful' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  optIn(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Param('id') id: string,
    @Param('channel') channel: 'sms' | 'whatsapp' | 'email',
  ) {
    return this.contactsService.optIn(businessContext.id, id, channel);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk import contacts' })
  @ApiResponse({ status: 200, description: 'Import completed' })
  importContacts(
    @CurrentBusiness() businessContext: { id: string; business: any },
    @Body() dto: ImportContactsDto,
  ) {
    return this.contactsService.importContacts(businessContext.id, dto);
  }
}
