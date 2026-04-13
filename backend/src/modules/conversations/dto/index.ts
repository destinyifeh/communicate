import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { ConversationChannel, ConversationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];

  @ApiPropertyOptional({ description: 'Email subject (for email channel)' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ description: 'HTML content (for email channel)' })
  @IsString()
  @IsOptional()
  html?: string;
}

export class StartConversationDto {
  @ApiProperty()
  @IsUUID()
  contactId: string;

  @ApiProperty({ enum: ConversationChannel })
  @IsEnum(ConversationChannel)
  channel: ConversationChannel;

  @ApiProperty()
  @IsString()
  message: string;
}

export class EscalateConversationDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  agentId?: string;
}

export class AssignAgentDto {
  @ApiProperty()
  @IsUUID()
  agentId: string;
}

export class ConversationQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ConversationChannel })
  @IsEnum(ConversationChannel)
  @IsOptional()
  channel?: ConversationChannel;

  @ApiPropertyOptional({ enum: ConversationChannel, description: 'Exclude this channel from results' })
  @IsEnum(ConversationChannel)
  @IsOptional()
  excludeChannel?: ConversationChannel;

  @ApiPropertyOptional({ enum: ConversationStatus })
  @IsEnum(ConversationStatus)
  @IsOptional()
  status?: ConversationStatus;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  starred?: boolean;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assignedAgentId?: string;
}
