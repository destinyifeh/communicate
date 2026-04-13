import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentBusiness = createParamDecorator(
  (data: 'id' | 'full' | unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User & { currentBusiness?: any };

    if (!user?.currentBusinessId) {
      throw new BadRequestException('No business context found');
    }

    // If 'full' is passed, return the full object
    if (data === 'full') {
      return {
        id: user.currentBusinessId,
        business: user.currentBusiness,
      };
    }

    // Default: return just the business ID string
    return user.currentBusinessId;
  },
);
