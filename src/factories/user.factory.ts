import { faker } from '@faker-js/faker';
import { CreateUserRequest } from '../models/user';

export class UserFactory {
  static create(): CreateUserRequest {
    return this.createWith();
  }

  static createWith(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const id = faker.string.nanoid(8);
    const defaults: CreateUserRequest = {
      email: `${id}_${faker.internet.email({ firstName, lastName })}`,
      username: `${faker.internet.username({ firstName, lastName })}_${id}`,
      password: faker.internet.password(),
    };
    return { ...defaults, ...overrides };
  }
}
