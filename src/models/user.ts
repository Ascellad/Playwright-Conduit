export interface User {
  id: number;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  token: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
}

export interface UserResponse {
  user: User;
}

export type LoginRequest = Pick<CreateUserRequest, 'email' | 'password'>;

export interface LoginResponse {
  user: Omit<User, 'id'>;
}

export type TestUser = User & Pick<CreateUserRequest, 'password'>;
