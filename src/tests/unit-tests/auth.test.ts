/* eslint-disable import/first */
process.env.NODE_ENV = 'test';
import mocha from 'mocha';
import chai, { assert } from 'chai';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { createContainer } from '../../ioc/ioc-container';
import AuthMiddleware from '../../middlewares/auth-middleware';
import AuthService from '../../services/auth-service';
import CommonErrors from '../../utils/errors/common-errors';
import AuthErrors from '../../utils/errors/auth-errors';

const { describe, it, before } = mocha;

let iocContainer = createContainer();

chai.should();

before(() => {
  dotenv.config({
    path: `${__dirname}/../../../.env`,
  });
});

describe('Auth Middleware', () => {
  describe('Validate Login Request', () => {
    it('should return bad request error because no body was provided', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;
      let responseBody: any = {};

      const request = {};
      const response = {
        status: (code: number) => {
          status = code;
          return response;
        },
        send: (body: any) => {
          responseBody = body;
          return response;
        },
      };

      authMiddleware.validateLoginUserRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      responseBody.should.equal(AuthErrors.MISSING_REQUEST_BODY.description);
    });

    it('should return bad request error because there were required fields missing', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;
      let responseBody: any = {};

      const request = {
        body: {},
      };
      const response = {
        status: (code: number) => {
          status = code;
          return response;
        },
        send: (body: any) => {
          responseBody = body;
          return response;
        },
      };

      authMiddleware.validateLoginUserRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      responseBody.should.have.property('description');
      responseBody.should.have.property('errors');
      responseBody.description.should.equal(AuthErrors.MISSING_OR_INVALID_FIELDS.description);
      responseBody.errors.length.should.equal(2);
      responseBody.errors[0].should.equal(AuthErrors.MISSING_EMAIL.description);
      responseBody.errors[1].should.equal(AuthErrors.MISSING_PASSWORD.description);
    });

    it('should return bad request error because there were invalid fields', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;
      let responseBody: any = {};

      const request = {
        body: {
          email: 'email',
          password: '    ',
        },
      };
      const response = {
        status: (code: number) => {
          status = code;
          return response;
        },
        send: (body: any) => {
          responseBody = body;
          return response;
        },
      };

      authMiddleware.validateLoginUserRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      responseBody.should.have.property('description');
      responseBody.should.have.property('errors');
      responseBody.description.should.equal(AuthErrors.MISSING_OR_INVALID_FIELDS.description);
      responseBody.errors.length.should.equal(2);
      responseBody.errors[0].should.equal(AuthErrors.INVALID_EMAIL.description);
      responseBody.errors[1].should.equal(AuthErrors.INVALID_PASSWORD.description);
    });

    it('should call next function', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      const request = {
        body: {
          email: 'teste@email.com',
          password: 'password',
        },
      };
      const response = {};

      const result = authMiddleware.validateLoginUserRequest(request as Request, response as Response, () => null);

      if (result) assert(false, 'Next Function not called');
    });
  });

  describe('Validate Refresh Token Request', () => {
    it('should return bad request error because no body was provided', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;
      let responseBody: any = {};

      const request = {};
      const response = {
        status: (code: number) => {
          status = code;
          return response;
        },
        send: (body: any) => {
          responseBody = body;
          return response;
        },
      };

      authMiddleware.validateRefreshTokenRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      responseBody.should.equal(AuthErrors.MISSING_REQUEST_BODY.description);
    });

    it('should return bad request error because there were required fields missing', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;
      let responseBody: any = {};

      const request = {
        body: {},
      };
      const response = {
        status: (code: number) => {
          status = code;
          return response;
        },
        send: (body: any) => {
          responseBody = body;
          return response;
        },
      };

      authMiddleware.validateRefreshTokenRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      responseBody.should.have.property('description');
      responseBody.should.have.property('errors');
      responseBody.description.should.equal(AuthErrors.MISSING_OR_INVALID_FIELDS.description);
      responseBody.errors.length.should.equal(3);
      responseBody.errors[0].should.equal(AuthErrors.MISSING_EMAIL.description);
      responseBody.errors[1].should.equal(AuthErrors.MISSING_TOKEN.description);
      responseBody.errors[2].should.equal(AuthErrors.MISSING_REFRESH_TOKEN.description);
    });

    it('should return bad request error because there were invalid fields', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;
      let responseBody: any = {};

      const request = {
        body: {
          email: 'email',
          token: '    ',
          refreshToken: '',
        },
      };
      const response = {
        status: (code: number) => {
          status = code;
          return response;
        },
        send: (body: any) => {
          responseBody = body;
          return response;
        },
      };

      authMiddleware.validateRefreshTokenRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      responseBody.should.have.property('description');
      responseBody.should.have.property('errors');
      responseBody.description.should.equal(AuthErrors.MISSING_OR_INVALID_FIELDS.description);
      responseBody.errors.length.should.equal(3);
      responseBody.errors[0].should.equal(AuthErrors.INVALID_EMAIL.description);
      responseBody.errors[1].should.equal(AuthErrors.INVALID_TOKEN.description);
      responseBody.errors[2].should.equal(AuthErrors.INVALID_REFRESH_TOKEN.description);
    });

    it('should call next function', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      const request = {
        body: {
          email: 'teste@email.com',
          token: 'token',
          refreshToken: 'refreshToken',
        },
      };
      const response = {};

      const result = authMiddleware.validateRefreshTokenRequest(request as Request, response as Response, () => null);

      if (result) assert(false, 'Next Function not called');
    });
  });

  describe('Authenticate Request', () => {
    it('should return forbidden error because no token was provided', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;

      const request = {
        headers: {},
      };
      const response = {
        sendStatus: (code: number) => {
          status = code;
          return response;
        },
      };

      authMiddleware.authenticateRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.FORBIDDEN);
    });

    it('should return unauthorized error because token is invalid', async () => {
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.OK;

      const request = {
        headers: {
          authorization: 'Bearer a',
        },
      };
      const response = {
        sendStatus: (code: number) => {
          status = code;
          return response;
        },
      };

      authMiddleware.authenticateRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.UNAUTHORIZED);
    });

    it('should call next function', async () => {
      iocContainer.service('authService', () => ({
        verify: () => { },
      }));
      const authMiddleware: AuthMiddleware = iocContainer.get('authMiddleware');

      let status = HttpStatusCodes.UNAUTHORIZED;

      const request = {
        headers: {
          authorization: 'Bearer token',
        },
      };
      const response = {};
      const next = () => { status = HttpStatusCodes.OK; };

      const result = authMiddleware.authenticateRequest(request as Request, response as Response, next);

      if (result) assert(false, 'Next Function not called');
      status.should.equal(HttpStatusCodes.OK);
    });
  });
});

describe('Auth Service', () => {
  describe('Login', () => {
    it('should fail to login because there is no user with provided email', async () => {
      iocContainer = createContainer();
      iocContainer.service('userRepository', () => ({
        findOne: async () => null,
      }));

      const authService: AuthService = iocContainer.get('authService');
      try {
        await authService.login('teste@email.com', 'password');
        assert(false, 'Should have thrown error');
      } catch (error) {
        error.should.have.property('code');
        error.should.have.property('description');
        error.code.should.equal(CommonErrors.UNAUTHORIZED.code);
        error.description.should.equal(CommonErrors.UNAUTHORIZED.description);
      }
    });

    it('should fail to login because passwords mismatch', async () => {
      const encryptedPassword = await bcrypt.hash('password', 10);

      iocContainer = createContainer();
      iocContainer.service('userRepository', () => ({
        findOne: async () => ({
          id: 1,
          password: encryptedPassword,
        }),
      }));

      const authService: AuthService = iocContainer.get('authService');
      try {
        await authService.login('teste@email.com', 'passworD');
        assert(false, 'Should have thrown error');
      } catch (error) {
        error.should.have.property('code');
        error.should.have.property('description');
        error.code.should.equal(CommonErrors.UNAUTHORIZED.code);
        error.description.should.equal(CommonErrors.UNAUTHORIZED.description);
      }
    });

    it('should login successfully', async () => {
      const encryptedPassword = await bcrypt.hash('password', 10);

      iocContainer = createContainer();
      iocContainer.service('userRepository', () => ({
        findOne: async () => ({
          id: 1,
          password: encryptedPassword,
        }),
      }));

      const authService: AuthService = iocContainer.get('authService');
      try {
        const { token, refreshToken } = await authService.login('teste@email.com', 'password');
        token.should.not.equal(refreshToken);
      } catch (error) {
        assert(false, `Should not have thrown error : Error : ${error}`);
      }
    });
  });

  describe('Sign', () => {
    it('should create two jwt tokens', () => {
      iocContainer = createContainer();
      const authService: AuthService = iocContainer.get('authService');

      const { token, refreshToken } = authService.sign({ id: 1, email: 'teste@email.com' });

      const decodedToken = jwt.decode(token, { complete: true });
      const decodedRefreshToken = jwt.decode(refreshToken, { complete: true });

      if (!decodedToken || !decodedRefreshToken) {
        assert(false, 'Token not created');
      } else if (typeof decodedToken === 'string' || typeof decodedRefreshToken === 'string') {
        assert(false, 'Token created with wrong type');
      } else {
        decodedToken.payload.exp.should.be.lt(decodedRefreshToken.payload.exp);
      }

      authService.tokenMap.should.have.property(refreshToken);
      authService.tokenMap[refreshToken].email.should.equal('teste@email.com');
    });
  });

  describe('Verify', () => {
    it('should throw unauthorized error for invalid token', () => {
      iocContainer = createContainer();
      const authService: AuthService = iocContainer.get('authService');

      try {
        authService.verify('token');
        assert(false, 'Did not verify invalid token');
      } catch (error) {
        error.should.have.property('code');
        error.should.have.property('description');
        error.code.should.equal(CommonErrors.UNAUTHORIZED.code);
        error.description.should.equal(CommonErrors.UNAUTHORIZED.description);
      }
    });

    it('should return verified data from valid token', () => {
      iocContainer = createContainer();
      const authService: AuthService = iocContainer.get('authService');

      const { token } = authService.sign({ id: 1, email: 'teste@email.com' });

      try {
        const verifiedToken = authService.verify(token);

        if (typeof verifiedToken === 'string') assert(false, `Token verification unsuccessful - ${verifiedToken}`);
        else {
          verifiedToken.should.have.property('id');
          verifiedToken.should.have.property('email');
          const tokenPayload = verifiedToken as { id: number, email: string };
          tokenPayload.id.should.equal(1);
          tokenPayload.email.should.equal('teste@email.com');
        }
      } catch (error) {
        assert(false, `Did not verify valid token : Error : ${JSON.stringify(error)}`);
      }
    });
  });

  describe('Refresh', () => {
    it('should throw error because refresh token is unregistered', () => {
      iocContainer = createContainer();
      const authService: AuthService = iocContainer.get('authService');
      const email = 'teste@email.com';
      const refreshToken = jwt.sign({ id: 1, email }, process.env.PRIVATE_REFRESH_JWT_KEY as string, {
        algorithm: 'RS256',
        expiresIn: 300,
      });

      try {
        authService.refresh({
          email,
          refreshToken,
          token: '',
          status: 'Logged in',
        });
        assert(false, 'Refresh did not consider registered tokens');
      } catch (error: any) {
        error.should.have.property('code');
        error.should.have.property('description');
        error.code.should.equal(CommonErrors.FORBIDDEN.code);
        error.description.should.equal(CommonErrors.FORBIDDEN.description);
      }
    });

    it('should throw error because refresh token has wrong email', () => {
      iocContainer = createContainer();
      const authService: AuthService = iocContainer.get('authService');
      const email = 'teste@email.com';
      const falseEmail = 'teste@false.com';
      const { token, refreshToken } = authService.sign({ id: 1, email });

      try {
        authService.refresh({
          email: falseEmail,
          refreshToken,
          token,
          status: 'Logged in',
        });
        assert(false, 'Refresh did not consider registered tokens');
      } catch (error: any) {
        error.should.have.property('code');
        error.should.have.property('description');
        error.code.should.equal(CommonErrors.FORBIDDEN.code);
        error.description.should.equal(CommonErrors.FORBIDDEN.description);
      }
    });

    it('should refresh token', async () => {
      iocContainer = createContainer();
      const authService: AuthService = iocContainer.get('authService');
      const email = 'teste@email.com';
      const { token, refreshToken } = authService.sign({ id: 1, email });

      let newToken;
      let newRefresh;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const newTokens = authService.refresh({
          email,
          refreshToken,
          token,
          status: 'Logged in',
        });
        newToken = newTokens.token;
        newRefresh = newTokens.newRefreshToken;
      } catch (error: any) {
        assert(false, `Refresh did not work - ${JSON.stringify(error)}`);
      }

      token.should.not.equal(newToken);
      refreshToken.should.not.equal(newRefresh);
    });
  });
});
