import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { Logger } from 'winston';
import path from 'path';

import BaseErrors from '../utils/errors/base-errors';

const fileName = path.basename(__filename);

export default class BaseMiddleware {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  validateRequest = (req: Request, res: Response, next: NextFunction) => {
    this.logger.info(`${fileName} : Validating request`);

    if (!req.body) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send(BaseErrors.MISSING_REQUEST_BODY.description);
    }

    const errors = [];

    if (!('requiredIntegerField' in req.body)) {
      errors.push(BaseErrors.MISSING_REQUIRED_INTEGER_FIELD.description);
    } else if (!Number.isInteger(req.body.requiredIntegerField)) {
      errors.push(BaseErrors.INVALID_INTEGER_FIELD.description);
    }

    if (errors.length) {
      const error = {
        description: BaseErrors.MISSING_OR_INVALID_FIELDS.description,
        errors,
      };

      return res.status(HttpStatusCodes.BAD_REQUEST).send(error);
    }

    return next();
  }
}
