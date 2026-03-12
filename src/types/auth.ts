export interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}
