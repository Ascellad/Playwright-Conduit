import { APIRequestContext, APIResponse } from '@playwright/test';
import { ResponseError } from '../utils/error';
import { LoginResponse, LoginRequest, UserResponse, CreateUserRequest } from '../models/user';

const apiEndpoints = {
  users: {
    login: '/users/login',
    createUser: '/users',
    getUser: '/user',
  },
};

export class ApiClient {
  constructor(
    private readonly requestContext: APIRequestContext,
    private readonly baseURL: string,
    private readonly token?: string,
  ) {}

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async login(credentials: LoginRequest): Promise<string> {
    const response = await this.requestContext.post(`${this.baseURL}${apiEndpoints.users.login}`, {
      data: { user: credentials },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok()) {
      throw new ResponseError(response);
    }
    const body = (await response.json()) as LoginResponse;
    return body.user.token;
  }

  async createUserRaw(userData: CreateUserRequest): Promise<APIResponse> {
    return this.requestContext.post(`${this.baseURL}${apiEndpoints.users.createUser}`, {
      data: { user: userData },
      headers: this.getHeaders(),
    });
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    const response = await this.createUserRaw(userData);
    if (!response.ok()) {
      throw new ResponseError(response);
    }
    return (await response.json()) as UserResponse;
  }

  async getUser(): Promise<UserResponse> {
    const response = await this.requestContext.get(`${this.baseURL}${apiEndpoints.users.getUser}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok()) {
      throw new ResponseError(response);
    }
    return (await response.json()) as UserResponse;
  }
}
