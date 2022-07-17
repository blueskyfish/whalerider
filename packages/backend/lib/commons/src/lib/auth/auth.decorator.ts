import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from './auth.user';
import { getAuthUser } from './auth.util';

/**
 * Usage
 *
 * ```ts
 * @Auth() authUser: AuthUser
 * ```
 */
export const Auth = createParamDecorator<any, any, AuthUser>((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return getAuthUser(req);
});
