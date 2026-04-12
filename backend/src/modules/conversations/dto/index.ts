import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ConversationChannel, ConversationStatus } from '@prisma/client';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];
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

export class ConversationQueryDto {
  @ApiPropertyOptional({ enum: ConversationChannel })
  @IsEnum(ConversationChannel)
  @IsOptional()
  channel?: ConversationChannel;

  @ApiPropertyOptional({ enum: ConversationStatus })
  @IsEnum(ConversationStatus)
  @IsOptional()
  status?: ConversationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  starred?: boolean;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assignedAgentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
