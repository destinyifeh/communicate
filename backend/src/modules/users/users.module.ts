import { Module } from '@nestjs/common';

@Module({
  // PrismaModule is global, so PrismaService is already available
  exports: [],
})
export class UsersModule {}
