import { create } from 'zustand';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const STORAGE_KEY = 'royal-ludo-auth';

function readStoredSession(): Pick<AuthState, 'user' | 'token'> {
  if (typeof globalThis.localStorage === 'undefined') {
    return { user: null, token: null };
  }

  const rawValue = globalThis.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return { user: null, token: null };
  }

  try {
    return JSON.parse(rawValue) as Pick<AuthState, 'user' | 'token'>;
  } catch {
    return { user: null, token: null };
  }
}

function persistSession(user: AuthUser | null, token: string | null): void {
  if (typeof globalThis.localStorage === 'undefined') {
    return;
  }

  if (!user || !token) {
    globalThis.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

const storedSession = readStoredSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedSession.user,
  token: storedSession.token,
  setSession: (user, token) => {
    persistSession(user, token);
    set({ user, token });
  },
  logout: () => {
    persistSession(null, null);
    set({ user: null, token: null });
  },
}));
