import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
  instructions: string;
  guardrails: string;
  accounts: string;
  partners: string;
  emails: string;
  apiKeys: string;
  files: { id: string; name: string; url: string; size: string }[];
  setInstructions: (instructions: string) => void;
  setGuardrails: (guardrails: string) => void;
  setAccounts: (accounts: string) => void;
  setPartners: (partners: string) => void;
  setEmails: (emails: string) => void;
  setApiKeys: (apiKeys: string) => void;
  setFiles: (files: { id: string; name: string; url: string; size: string }[]) => void;
}

const ENCRYPTION_KEY = 'alti-secret-admin-storage-encryption-key-static-salt';

function encrypt(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(encodeURIComponent(result));
}

function decrypt(cipherText: string): string {
  const decoded = decodeURIComponent(atob(cipherText));
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

const encryptedStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const rawValue = localStorage.getItem(name);
    if (!rawValue) return null;
    try {
      // Backwards compatibility check: If unencrypted JSON structure exists
      if (rawValue.trim().startsWith('{')) {
        return rawValue;
      }
      return decrypt(rawValue);
    } catch (e) {
      return rawValue;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const encrypted = encrypt(value);
      localStorage.setItem(name, encrypted);
    } catch (e) {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  }
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      instructions: '',
      guardrails: '',
      accounts: '',
      partners: '',
      emails: '',
      apiKeys: '',
      files: [],
      setInstructions: (instructions) => set({ instructions }),
      setGuardrails: (guardrails) => set({ guardrails }),
      setAccounts: (accounts) => set({ accounts }),
      setPartners: (partners) => set({ partners }),
      setEmails: (emails) => set({ emails }),
      setApiKeys: (apiKeys) => set({ apiKeys }),
      setFiles: (files) => set({ files }),
    }),
    {
      name: 'admin-editors-storage',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
