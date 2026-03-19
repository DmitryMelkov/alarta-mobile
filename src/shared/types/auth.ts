import 'axios';

export interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
