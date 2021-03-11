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
import AuthService from '../services/auth-service';
import AuthMiddleware from '../middlewares/auth-middleware';

const fileName = path.basename(__filename);

export default class AuthController {
  logger: Logger;
  authService: AuthService;

  constructor(
    router: Router,
    baseRoute: string,
    logger: Logger,
    authMiddleware: AuthMiddleware,
    authService: AuthService,
  ) {
    this.logger = logger;
    this.authService = authService;

    router.post(`/${baseRoute}/token`, authMiddleware.validateRefreshTokenRequest, this.refreshToken);
    router.post(`/${baseRoute}`, authMiddleware.validateLoginUserRequest, this.loginUser);
  }

  refreshToken = async (req: Request, res: Response) => {
    this.logger.info(`${fileName} - Refreshing token : Data : ${JSON.stringify(req.body)}`);

    try {
      const { token, newRefreshToken: refreshToken } = this.authService.refresh(req.body.refreshToken);
      return res.status(HttpStatusCodes.OK).send({ token, refreshToken });
    } catch (error) {
      if (isServerError(error)) {
        this.logger.error(`${fileName} - Failed to verify token : Error : ${error.description}`);

        return res.status(error.code).send(error.description);
      }

      this.logger.error(`${fileName} - Failed to verify token : Error : ${JSON.stringify(error)}`);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(CommonErrors.INTERNAL_SERVER_ERROR.description);
    }
  }

  loginUser = async (req: Request, res: Response) => {
    const { password, ...bodyWithoutPassword } = req.body;
    this.logger.info(`${fileName} - Logging in : Data : ${JSON.stringify(bodyWithoutPassword)}`);

    try {
      const { token, refreshToken } = await this.authService.login(req.body.email, req.body.password);
      return res.status(HttpStatusCodes.OK).send({ token, refreshToken });
    } catch (error) {
      if (isServerError(error)) {
        this.logger.error(`${fileName} - Failed to login user : Error : ${error.description}`);

        return res.status(error.code).send(error.description);
      }

      this.logger.error(`${fileName} - Failed to login user : Error : ${JSON.stringify(error)}`);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(CommonErrors.INTERNAL_SERVER_ERROR.description);
    }
  }
}
