/* eslint-disable import/first */
process.env.NODE_ENV = 'test';
import mocha from 'mocha';
import chai, { assert } from 'chai';
import { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

import { createContainer } from '../../ioc/ioc-container';
import { BaseAttributes } from '../../database/models/Base';
import BaseService from '../../services/base-service';
import UserErrors from '../../utils/errors/base-errors';
import { BaseTestHelper } from '../helpers/base-test-helper';
import BaseMiddleware from '../../middlewares/base-middleware';

const { describe, it } = mocha;

const iocContainer = createContainer();

chai.should();

describe('Base Middleware', () => {
  describe('Validate Request', () => {
    it('should return error because there is no request body', async () => {
      const baseMiddleware: BaseMiddleware = iocContainer.get('baseMiddleware');

      let status = HttpStatusCodes.OK;
      let resBody = {};

      const request = {};
      const response = {
        status: (newStatus: number) => { status = newStatus; return response; },
        send: (body: any) => { resBody = body; return response; },
      };

      baseMiddleware.validateRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      resBody.should.equal(UserErrors.MISSING_REQUEST_BODY.description);
    });

    it('should return error because there are missing required fields', async () => {
      const baseMiddleware: BaseMiddleware = iocContainer.get('baseMiddleware');

      let status = HttpStatusCodes.OK;
      let resBody: any = {};

      const request = {
        body: {},
      };
      const response = {
        status: (newStatus: number) => { status = newStatus; return response; },
        send: (body: any) => { resBody = body; return response; },
      };

      baseMiddleware.validateRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      resBody.should.have.property('description');
      resBody.should.have.property('errors');
      resBody.description.should.equal(UserErrors.MISSING_OR_INVALID_FIELDS.description);
      resBody.errors.length.should.equal(1);
      resBody.errors[0].should.equal(UserErrors.MISSING_REQUIRED_INTEGER_FIELD.description);
    });

    it('should return error because there are invalid fields', async () => {
      const baseMiddleware: BaseMiddleware = iocContainer.get('baseMiddleware');

      let status = HttpStatusCodes.OK;
      let resBody: any = {};

      const request = {
        body: {
          requiredIntegerField: 'a',
        },
      };
      const response = {
        status: (newStatus: number) => { status = newStatus; return response; },
        send: (body: any) => { resBody = body; return response; },
      };

      baseMiddleware.validateRequest(request as Request, response as Response, () => { });
      status.should.equal(HttpStatusCodes.BAD_REQUEST);
      resBody.should.have.property('description');
      resBody.should.have.property('errors');
      resBody.description.should.equal(UserErrors.MISSING_OR_INVALID_FIELDS.description);
      resBody.errors.length.should.equal(1);
      resBody.errors[0].should.equal(UserErrors.INVALID_INTEGER_FIELD.description);
    });

    it('should call next function', async () => {
      const baseMiddleware: BaseMiddleware = iocContainer.get('baseMiddleware');

      const request = {
        body: {
          requiredIntegerField: 1,
        },
      };
      const response = {};

      const result = baseMiddleware.validateRequest(request as Request, response as Response, () => null);

      if (result) assert(false, 'Next Function not called');
    });
  });
});

describe('Base Service', () => {
  describe('Create', () => {
    it('should create new object', async () => {
      const objects: BaseAttributes[] = [];
      BaseTestHelper.changeBaseRepository(iocContainer, () => ({
        findOne: () => { },
        create: (data: BaseAttributes) => objects.push(data),
      }));

      const baseService: BaseService = iocContainer.get('baseService');
      const object = {
        name: 'Test',
      };

      try {
        await baseService.create({
          ...object,
        });
      } catch (error) {
        assert(false);
      }

      objects.length.should.equal(1);
      objects[0].name.should.equal(object.name);
    });
  });
});
