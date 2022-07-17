import { CryptoService } from '@blueskyfish/backend-core';
import { HttpException, Injectable, Logger, NestMiddleware, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { internalError, unauthorized } from '../errors';
import { OpenApiSetting } from '../openapi';
import { AuthUserRenewal, AuthUserRequired } from './auth.error-codes';
import { AuthData, AuthUser } from './auth.user';
import { setAuthUser } from './auth.util';

/**
 * Unauthorized http error for the missing of auth user.
 */
const authUserRequired = () => unauthorized({
    code: AuthUserRequired,
    message: 'Required an auth user'
  },
  'Unauthorized access'
);

/**
 * Renewal the token is required
 */
const authUserRenewal = () => unauthorized({
  code: AuthUserRenewal,
  message: 'User needs renew authorization'
});

/**
 * Middleware for the consumer of {@link AuthUser}. This service does not renew the authenticity
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware, OnApplicationBootstrap {

  private readonly logger = new Logger(AuthMiddleware.name);

  /**
   * The timeout range (initial 2 hours)
   * @private
   */
  private timeout = 2;

  constructor(private cryptoService: CryptoService, private config: ConfigService) {
  }

  use(req: Request, res: Response, next: NextFunction): any {
    let token = req.header(OpenApiSetting.HttpAuthHeader);
    if (Array.isArray(token)) {
      token = token[0];
    }

    if (token && token !== '') {
      try {
        const authData = this.cryptoService.decryptJson<AuthData>(token);
        if (!authData) {
          return next(authUserRequired());
        }

        const authUser = new AuthUser(authData);
        if (this.renewRequired(authUser)) {
          this.logger.log(`Renew required "${ authUser.id }"`);

          return next(authUserRenewal());
        }

        setAuthUser(req, authUser);

        return next();

      } catch (e: any) {
        if (e instanceof Error && !(e instanceof HttpException)) {
          // internal error
          return next(internalError({
            code: 'auth.internalError',
            message: e.message
          }));
        }
        return next(e);
      }
    }

    return next(authUserRequired());
  }

  onApplicationBootstrap(): any {
    const timeout: number = this.config.get<number>('auth.timeout', 0);
    if (timeout <= 0) {
      this.logger.log('Auth middleware is not check the renewal timeout of the user');
    } else {
      this.logger.log(`Auth middleware is check the renew timeout after "${ timeout }" hours`);
    }
    this.timeout = timeout;
  }

  private renewRequired(authUser: AuthUser): boolean {
    if (this.timeout <= 0) {
      return false;
    }
    const creation = authUser.creation.plus({hour: this.timeout}).toSeconds();
    const now = DateTime.now().toSeconds();
    return creation < now;
  }
}
