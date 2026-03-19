import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import type { JwtPayload } from '@shared/types/auth';
import { isTokenExpired } from '@shared/lib/auth';

type User = {
  name: string;
};

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

type AuthActions = {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  initFromStorage: () => Promise<void>;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://dash.omnicomm24.ru/api'
).replace(/\/$/, '');

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<{ access: string; refresh: string }>(
        `${API_BASE_URL}/token/`,
        {
          username,
          password,
        },
      );

      const { access, refresh } = response.data;

      const accessDecoded = jwtDecode<JwtPayload>(access);
      const refreshDecoded = jwtDecode<JwtPayload>(refresh);

      if (!accessDecoded.exp || !refreshDecoded.exp) {
        throw new Error('Invalid tokens received');
      }

      const user: User = {
        name: (accessDecoded.username as string) || (accessDecoded.name as string) || username,
      };

      set({
        isAuthenticated: true,
        accessToken: access,
        refreshToken: refresh,
        user,
        loading: false,
        error: null,
      });

      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, access),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);

      return { success: true };
    } catch (err) {
      let errorMessage = 'Произошла ошибка при авторизации';

      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        errorMessage = String(data?.detail ?? data?.message ?? errorMessage);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      loading: false,
      error: null,
    });

    await Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  },

  refreshAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken || isTokenExpired(refreshToken, 5_000)) {
      await get().logout();
      return null;
    }

    try {
      const response = await axios.post<{ access: string }>(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      const decoded = jwtDecode<JwtPayload>(access);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        throw new Error('Invalid token received');
      }

      set({ accessToken: access, isAuthenticated: true });
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);

      return access;
    } catch {
      await get().logout();
      return null;
    }
  },

  initFromStorage: async () => {
    try {
      set({ loading: true, error: null });

      const [storedAccess, storedRefresh, storedUser] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (!storedAccess || !storedRefresh) {
        set({ loading: false });
        return;
      }

      if (isTokenExpired(storedAccess, 5_000)) {
        // Попробуем обновить access токен через refresh
        const newAccess = await get().refreshAccessToken();
        if (!newAccess) {
          set({ loading: false });
          return;
        }
      }

      const user: User | null = storedUser ? JSON.parse(storedUser) : null;

      set({
        isAuthenticated: true,
        accessToken: storedAccess,
        refreshToken: storedRefresh,
        user,
        loading: false,
        error: null,
      });
    } catch {
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        loading: false,
      });
    }
  },
}));
