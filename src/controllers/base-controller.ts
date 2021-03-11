import {
  Request,
  Response,
  Router,
} from 'express';
import { Logger } from 'winston';
import HttpStatusCodes from 'http-status-codes';
import path from 'path';

import CommonErrors from '../utils/errors/common-errors';
import { isServerError } from '../utils/util-functions';
import BaseService from '../services/base-service';
import AuthMiddleware from '../middlewares/auth-middleware';
import BaseMiddleware from '../middlewares/base-middleware';

const fileName = path.basename(__filename);

export default class BaseController {
  private logger: Logger;
  private baseService: BaseService;

  constructor(
    router: Router,
    baseRoute: string,
    logger: Logger,
    authMiddleware: AuthMiddleware,
    baseMiddleware: BaseMiddleware,
    baseService: BaseService,
  ) {
    this.logger = logger;
    this.baseService = baseService;

    router.post(`/${baseRoute}`,
      authMiddleware.authenticateRequest,
      baseMiddleware.validateRequest,
      this._handleRequest);
  }

  private _handleRequest = async (req: Request, res: Response) => {
    this.logger.info(`${fileName} - Handling request : Data : ${JSON.stringify(req.body)}`);

    try {
      const result = this.baseService.create(req.body.refreshToken);
      return res.status(HttpStatusCodes.OK).send({ result });
    } catch (error) {
      if (isServerError(error)) {
        this.logger.error(`${fileName} - Failed to verify token : Error : ${error.description}`);

        return res.status(error.code).send(error.description);
      }

      this.logger.error(`${fileName} - Failed to verify token : Error : ${JSON.stringify(error)}`);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(CommonErrors.INTERNAL_SERVER_ERROR.description);
    }
  }
}
