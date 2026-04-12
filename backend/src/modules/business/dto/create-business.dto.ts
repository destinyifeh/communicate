import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsArray,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { FeatureType } from '@prisma/client';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'A leading provider of innovative solutions', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'https://acme.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'contact@acme.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Technology', required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ example: 'America/New_York', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    example: ['booking', 'inquiries'],
    enum: FeatureType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(FeatureType, { each: true })
  features: FeatureType[];
}

export class UpdateBusinessDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timezone?: string;
}
