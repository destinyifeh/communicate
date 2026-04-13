import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Contact, Prisma } from '@prisma/client';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../common/dto';
import {
  CreateContactDto,
  UpdateContactDto,
  ImportContactsDto,
  ContactQueryDto,
} from './dto';
import { normalizePhoneNumber } from '../../common/utils';

// Helper to get tags array from Json field
function getTagsArray(tags: Prisma.JsonValue | null | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter((t): t is string => typeof t === 'string');
  return [];
}

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(businessId: string, dto: CreateContactDto): Promise<Contact> {
    const normalizedPhone = normalizePhoneNumber(dto.phone);
    // Get just the digits for flexible matching
    const phoneDigits = dto.phone.replace(/\D/g, '');

    // Check for existing contact with same phone (try multiple formats)
    const existing = await this.prisma.contact.findFirst({
      where: {
        businessId,
        OR: [
          { phone: normalizedPhone },
          { phone: dto.phone },
          { phone: phoneDigits },
          { phone: { contains: phoneDigits.slice(-10) } }, // Last 10 digits
        ],
      },
    });

    if (existing) {
      // Update the existing contact with new info (upsert behavior)
      // This handles the case where a contact was auto-created from a call
      const existingTags = getTagsArray(existing.tags);
      const newTags = dto.tags && dto.tags.length > 0 ? dto.tags : existingTags;

      return this.prisma.contact.update({
        where: { id: existing.id },
        data: {
          firstName: dto.firstName || existing.firstName,
          lastName: dto.lastName || existing.lastName,
          email: dto.email || existing.email,
          tags: newTags,
          notes: dto.notes || existing.notes,
          // Keep the original source - don't overwrite voice/sms with manual
          // This preserves how the contact was first created
        },
      });
    }

    return this.prisma.contact.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: normalizedPhone,
        email: dto.email,
        tags: dto.tags || [],
        source: dto.source || 'manual',
        notes: dto.notes,
        businessId,
      },
    });
  }

  async findAll(
    businessId: string,
    pagination: PaginationDto,
    filters?: ContactQueryDto,
  ): Promise<PaginatedResponseDto<Contact>> {
    const where: Prisma.ContactWhereInput = {
      businessId,
    };

    // Search filter
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Tags filter - for JSON array, we need to check differently
    // Note: Prisma doesn't support hasSome on Json fields directly
    // We'll need to filter in application code or use raw SQL for tag filtering

    // Opt-out filters (inverted logic since schema uses optedOut fields)
    if (filters?.smsOptIn !== undefined) {
      where.optedOutSms = !filters.smsOptIn;
    }
    if (filters?.whatsappOptIn !== undefined) {
      where.optedOutWhatsapp = !filters.whatsappOptIn;
    }

    // Determine sort - use safe defaults
    let orderBy: Prisma.ContactOrderByWithRelationInput = { createdAt: 'desc' };
    if (pagination.sortBy === 'firstName') {
      orderBy = { firstName: pagination.sortOrder || 'desc' };
    } else if (pagination.sortBy === 'lastName') {
      orderBy = { lastName: pagination.sortOrder || 'desc' };
    } else if (pagination.sortBy === 'email') {
      orderBy = { email: pagination.sortOrder || 'desc' };
    } else if (pagination.sortBy === 'createdAt') {
      orderBy = { createdAt: pagination.sortOrder || 'desc' };
    }

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.prisma.contact.count({ where }),
    ]);

    return PaginatedResponseDto.create(data, total, pagination);
  }

  async findOne(businessId: string, id: string): Promise<Contact> {
    const contact = await this.prisma.contact.findFirst({
      where: { id, businessId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(
    businessId: string,
    id: string,
    dto: UpdateContactDto,
  ): Promise<Contact> {
    await this.findOne(businessId, id);

    // If updating phone, check for conflicts
    if (dto.phone) {
      const existing = await this.prisma.contact.findFirst({
        where: {
          businessId,
          phone: normalizePhoneNumber(dto.phone),
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException('Contact with this phone number already exists');
      }
    }

    // Build update data, converting opt-in to opt-out
    const updateData: Prisma.ContactUpdateInput = {
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.phone && { phone: normalizePhoneNumber(dto.phone) }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.smsOptIn !== undefined && { optedOutSms: !dto.smsOptIn }),
      ...(dto.whatsappOptIn !== undefined && { optedOutWhatsapp: !dto.whatsappOptIn }),
      ...(dto.emailOptIn !== undefined && { optedOutEmail: !dto.emailOptIn }),
    };

    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(businessId: string, id: string): Promise<Contact> {
    await this.findOne(businessId, id);

    return this.prisma.contact.delete({
      where: { id },
    });
  }

  async addTags(businessId: string, id: string, tags: string[]): Promise<Contact> {
    const contact = await this.findOne(businessId, id);

    // Merge tags, removing duplicates
    const existingTags = getTagsArray(contact.tags);
    const mergedTags = [...new Set([...existingTags, ...tags])];

    return this.prisma.contact.update({
      where: { id },
      data: { tags: mergedTags },
    });
  }

  async removeTags(businessId: string, id: string, tags: string[]): Promise<Contact> {
    const contact = await this.findOne(businessId, id);

    const existingTags = getTagsArray(contact.tags);
    const filteredTags = existingTags.filter((t) => !tags.includes(t));

    return this.prisma.contact.update({
      where: { id },
      data: { tags: filteredTags },
    });
  }

  async optOut(
    businessId: string,
    id: string,
    channel: 'sms' | 'whatsapp' | 'email',
  ): Promise<Contact> {
    await this.findOne(businessId, id);

    const updateData: Prisma.ContactUpdateInput = {};
    if (channel === 'sms') updateData.optedOutSms = true;
    if (channel === 'whatsapp') updateData.optedOutWhatsapp = true;
    if (channel === 'email') updateData.optedOutEmail = true;

    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  async optIn(
    businessId: string,
    id: string,
    channel: 'sms' | 'whatsapp' | 'email',
  ): Promise<Contact> {
    await this.findOne(businessId, id);

    const updateData: Prisma.ContactUpdateInput = {};
    if (channel === 'sms') updateData.optedOutSms = false;
    if (channel === 'whatsapp') updateData.optedOutWhatsapp = false;
    if (channel === 'email') updateData.optedOutEmail = false;

    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  async importContacts(
    businessId: string,
    dto: ImportContactsDto,
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (const contactData of dto.contacts) {
      try {
        const phone = normalizePhoneNumber(contactData.phone);

        // Check if contact exists
        const existing = await this.prisma.contact.findFirst({
          where: { businessId, phone },
        });

        if (existing) {
          // Update existing contact
          const existingTags = getTagsArray(existing.tags);
          const mergedTags = [
            ...new Set([
              ...existingTags,
              ...(contactData.tags || []),
              ...(dto.defaultTags || []),
            ]),
          ];

          await this.prisma.contact.update({
            where: { id: existing.id },
            data: {
              firstName: contactData.firstName || existing.firstName,
              lastName: contactData.lastName || existing.lastName,
              email: contactData.email || existing.email,
              tags: mergedTags,
            },
          });
          skipped++;
        } else {
          // Create new contact
          await this.prisma.contact.create({
            data: {
              phone,
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              email: contactData.email,
              tags: [
                ...new Set([...(contactData.tags || []), ...(dto.defaultTags || [])]),
              ],
              source: contactData.source || 'import',
              businessId,
            },
          });
          imported++;
        }
      } catch (error) {
        errors.push(`Failed to import ${contactData.phone}: ${error.message}`);
      }
    }

    return { imported, skipped, errors };
  }

  async getTags(businessId: string): Promise<string[]> {
    const contacts = await this.prisma.contact.findMany({
      where: { businessId },
      select: { tags: true },
    });

    // Flatten and dedupe all tags from JSON fields
    const allTags = contacts.flatMap((c) => getTagsArray(c.tags));
    return [...new Set(allTags)].sort();
  }

  async getStats(businessId: string): Promise<{
    total: number;
    smsOptIn: number;
    whatsappOptIn: number;
    emailOptIn: number;
    newThisMonth: number;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Note: optedOut fields are inverted, so we count where optedOut is false
    const [total, smsOptIn, whatsappOptIn, emailOptIn, newThisMonth] =
      await Promise.all([
        this.prisma.contact.count({ where: { businessId } }),
        this.prisma.contact.count({ where: { businessId, optedOutSms: false } }),
        this.prisma.contact.count({ where: { businessId, optedOutWhatsapp: false } }),
        this.prisma.contact.count({ where: { businessId, optedOutEmail: false } }),
        this.prisma.contact.count({
          where: { businessId, createdAt: { gte: startOfMonth } },
        }),
      ]);

    return { total, smsOptIn, whatsappOptIn, emailOptIn, newThisMonth };
  }
}
