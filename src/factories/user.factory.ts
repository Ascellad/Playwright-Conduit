import { faker } from '@faker-js/faker';
import { CreateUserRequest } from '../models/user';

export class UserFactory {
  static create(): CreateUserRequest {
    return this.createWith();
  }

  static createWith(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    const uniqueId = crypto.randomUUID().replaceAll('-', '');
    const defaults: CreateUserRequest = {
      email: uniqueId + '_' + faker.internet.email(),
      username: faker.internet.username() + '_' + uniqueId,
      password: faker.internet.password(),
    };
    return { ...defaults, ...overrides };
  }
}
