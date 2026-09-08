import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const PUBLIC_ROUTE = Symbol('isPublicRoute');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public routes still run the strategy so that a caller who *does* send a
    // valid token is identified — that's what attributes activity entries and
    // suppresses self-notifications. Missing or bad tokens are tolerated below.
    context.switchToHttp().getRequest()[PUBLIC_ROUTE] = !!isPublic;

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
    if (context.switchToHttp().getRequest()[PUBLIC_ROUTE]) {
      return (user || undefined) as TUser;
    }

    if (err || !user) {
      throw err || new UnauthorizedException('A valid Bearer token is required.');
    }

    return user;
  }
}
