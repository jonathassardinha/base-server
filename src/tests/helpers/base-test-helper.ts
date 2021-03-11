/* eslint-disable import/prefer-default-export */
import { BaseAttributes } from '../../database/models/Base';
import { Container } from '../../ioc/ioc-container';

export class BaseTestHelper {
  static returnObjectFromBaseRepository(iocContainer: Container, data: Partial<BaseAttributes>) {
    iocContainer.service('userRepository', () => ({
      findOne: () => ({
        name: data.name,
      }),
    }));
  }

  static changeBaseRepository(iocContainer: Container, repo: any) {
    iocContainer.service('baseRepository', repo);
  }
}
