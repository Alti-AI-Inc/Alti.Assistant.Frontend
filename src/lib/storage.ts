/**
 * SSR-safe, typed localStorage abstraction.
 * Centralizes all localStorage access with typed keys,
 * eliminating 22+ raw localStorage.getItem calls scattered across 16 files.
 */

const isBrowser = typeof window !== 'undefined';

export const STORAGE_KEYS = {
  TASK_RUNS: 'aphura_task_runs',
  AUTOMATIONS: 'aphura_automations',
  INVITED_NAMES: 'aphura_invited_names',
  INSTRUCTIONS: 'aphura_instructions',
  GUARDRAILS: 'aphura_guardrails',
  MEMORY_RETENTION: 'aphura_memory_retention',
  SUPPORT_REQUESTS: 'aphura_support_requests',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const storage = {
  get<T = unknown>(key: StorageKey): T | null {
    if (!isBrowser) return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  getString(key: StorageKey): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  },

  set(key: StorageKey, value: unknown): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      );
    } catch {
      // Storage full or blocked — fail silently
    }
  },

  remove(key: StorageKey): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },
};
