import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateContactDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateContactDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  smsOptIn?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  whatsappOptIn?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailOptIn?: boolean;
}

export class ImportContactsDto {
  @ApiProperty({ type: [CreateContactDto] })
  @IsArray()
  contacts: CreateContactDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  defaultTags?: string[];
}

export class AddTagsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class ContactQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  smsOptIn?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  whatsappOptIn?: boolean;
}
