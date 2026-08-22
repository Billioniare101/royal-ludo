import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './authStore.js';

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
  };
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: createLocalStorageMock(),
  });
  useAuthStore.getState().logout();
});

describe('auth store', () => {
  it('stores and clears a session', () => {
    useAuthStore.getState().setSession({ id: 'user-1', username: 'alice' }, 'token-123');

    expect(useAuthStore.getState().token).toBe('token-123');

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
