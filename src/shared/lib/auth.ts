import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@shared/types/auth';

export const isTokenExpired = (token: string, bufferMs: number = 0): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 - bufferMs < Date.now();
  } catch {
    return true;
  }
};
