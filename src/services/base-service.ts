import { Logger } from 'winston';
import path from 'path';

import { StaticModel } from '../database/models/StaticModel';
import { BaseAttributes, BaseModel } from '../database/models/Base';
import CommonErrors from '../utils/errors/common-errors';

const fileName = path.basename(__filename);

export default class BaseService {
  private baseRepository: StaticModel<BaseModel>;
  private logger: Logger;

  constructor(baseRepository: StaticModel<BaseModel>, logger: Logger) {
    this.baseRepository = baseRepository;
    this.logger = logger;
  }

  create = async (data: BaseAttributes) => {
    try {
      return await this.baseRepository.create({
        ...data,
      });
    } catch (error) {
      this.logger.error(`${fileName} - Error creating object : Error  : ${JSON.stringify(error)}`);
      throw CommonErrors.INTERNAL_SERVER_ERROR;
    }
  }
}
