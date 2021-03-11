import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { Logger } from 'winston';
import path from 'path';

import AuthService from '../services/auth-service';
import AuthErrors from '../utils/errors/auth-errors';
import { validateEmail } from '../utils/util-functions';

const fileName = path.basename(__filename);

export default class AuthMiddleware {
  private authService: AuthService;
  private logger: Logger;

  constructor(authService: AuthService, logger: Logger) {
    this.logger = logger;
    this.authService = authService;
  }

  validateLoginUserRequest = (req: Request, res: Response, next: NextFunction) => {
    this.logger.info(`${fileName} : Validating login user request`);

    if (!req.body) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send(AuthErrors.MISSING_REQUEST_BODY.description);
    }

    const errors = [];

    if (!('email' in req.body)) {
      errors.push(AuthErrors.MISSING_EMAIL.description);
    } else if (!validateEmail(req.body.email)) {
      errors.push(AuthErrors.INVALID_EMAIL.description);
    }

    if (!('password' in req.body)) {
      errors.push(AuthErrors.MISSING_PASSWORD.description);
    } else if (req.body.password === '' || (req.body.password as string).trim() === '') {
      errors.push(AuthErrors.INVALID_PASSWORD.description);
    }

    if (errors.length) {
      const error = {
        description: AuthErrors.MISSING_OR_INVALID_FIELDS.description,
        errors,
      };

      return res.status(HttpStatusCodes.BAD_REQUEST).send(error);
    }

    return next();
  }

  validateRefreshTokenRequest = (req: Request, res: Response, next: NextFunction) => {
    this.logger.info(`${fileName} : Validating refresh token request`);

    if (!req.body) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send(AuthErrors.MISSING_REQUEST_BODY.description);
    }

    const errors = [];

    if (!('email' in req.body)) {
      errors.push(AuthErrors.MISSING_EMAIL.description);
    } else if (!validateEmail(req.body.email)) {
      errors.push(AuthErrors.INVALID_EMAIL.description);
    }

    if (!('token' in req.body)) {
      errors.push(AuthErrors.MISSING_TOKEN.description);
    } else if (req.body.token === '' || (req.body.token as string).trim() === '') {
      errors.push(AuthErrors.INVALID_TOKEN.description);
    }

    if (!('refreshToken' in req.body)) {
      errors.push(AuthErrors.MISSING_REFRESH_TOKEN.description);
    } else if (req.body.refreshToken === '' || (req.body.refreshToken as string).trim() === '') {
      errors.push(AuthErrors.INVALID_REFRESH_TOKEN.description);
    }

    if (errors.length) {
      const error = {
        description: AuthErrors.MISSING_OR_INVALID_FIELDS.description,
        errors,
      };

      return res.status(HttpStatusCodes.BAD_REQUEST).send(error);
    }

    return next();
  }

  authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
    this.logger.info(`${fileName} : Authenticating request`);

    if (!req.headers.authorization || req.headers.authorization === '') {
      return res.sendStatus(HttpStatusCodes.FORBIDDEN);
    }

    const token = (req.headers.authorization as string).replace('Bearer ', '');

    try {
      this.authService.verify(token);
    } catch (error) {
      return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }

    return next();
  }
}
