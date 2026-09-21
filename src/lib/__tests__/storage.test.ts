import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { storage, STORAGE_KEYS } from '../storage';

describe('storage', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return store[key] ?? null;
    });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => {
        store[key] = value;
      },
    );

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete store[key];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('storage.set', () => {
    it('stores a string value directly', () => {
      storage.set(STORAGE_KEYS.INSTRUCTIONS, 'test instruction');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.INSTRUCTIONS,
        'test instruction',
      );
      expect(store[STORAGE_KEYS.INSTRUCTIONS]).toBe('test instruction');
    });

    it('stores an object value serialized as JSON', () => {
      const data = { theme: 'dark', notifications: true };
      storage.set(STORAGE_KEYS.GUARDRAILS, data);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.GUARDRAILS,
        JSON.stringify(data),
      );
      expect(store[STORAGE_KEYS.GUARDRAILS]).toBe(JSON.stringify(data));
    });
  });

  describe('storage.get', () => {
    it('returns parsed JSON data when item exists', () => {
      const data = { id: 123, name: 'Task 1' };
      store[STORAGE_KEYS.TASK_RUNS] = JSON.stringify(data);

      const result = storage.get(STORAGE_KEYS.TASK_RUNS);
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TASK_RUNS);
      expect(result).toEqual(data);
    });

    it('returns null when item does not exist', () => {
      const result = storage.get(STORAGE_KEYS.AUTOMATIONS);
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTOMATIONS);
      expect(result).toBeNull();
    });

    it('returns null when stored item has invalid JSON', () => {
      store[STORAGE_KEYS.INSTRUCTIONS] = 'invalid-json-{';

      const result = storage.get(STORAGE_KEYS.INSTRUCTIONS);
      expect(result).toBeNull();
    });
  });

  describe('storage.remove', () => {
    it('removes the specified item from localStorage', () => {
      store[STORAGE_KEYS.MEMORY_RETENTION] = '30d';

      storage.remove(STORAGE_KEYS.MEMORY_RETENTION);
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.MEMORY_RETENTION,
      );
      expect(store[STORAGE_KEYS.MEMORY_RETENTION]).toBeUndefined();
    });
  });
});
