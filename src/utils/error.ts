import { APIResponse } from '@playwright/test';

export type ServerSideError<T> = {
  code: number;
  message: T | null;
};

export type ResponseJsonData<T, Y> = {
  data: T;
  error: ServerSideError<Y>;
};

export class ResponseError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(response: APIResponse) {
    super(`[${response.status()}]: "${response.statusText()}"`);
    this.status = response.status();
    this.statusText = response.statusText();
  }
}

export class ServerError extends Error {
  readonly code: number;
  readonly codeMessage: unknown;

  constructor(error: ServerSideError<unknown>) {
    super(`[${error.code}]: "${JSON.stringify(error.message, undefined, 1)}"`);
    this.code = error.code;
    this.codeMessage = error.message;
  }
}
