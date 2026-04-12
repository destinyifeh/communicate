import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentBusiness = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User & { currentBusiness?: any };

    if (!user?.currentBusinessId) {
      throw new BadRequestException('No business context found');
    }

    return {
      id: user.currentBusinessId,
      business: user.currentBusiness,
    };
  },
);
