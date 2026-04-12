import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 20);
  }

  get take(): number {
    return this.limit || 20;
  }
}

export class PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasMore = page < this.totalPages;
  }
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(data: T[], total: number, pagination: PaginationDto) {
    this.data = data;
    this.meta = new PaginationMeta(total, pagination.page || 1, pagination.limit || 20);
  }

  static create<T>(data: T[], total: number, pagination: PaginationDto): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(data, total, pagination);
  }
}

export class DateRangeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endDate?: string;
}
