import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// NOTE: Sensitive admin settings (API keys, account credentials, etc.) should
// be stored server-side. localStorage is inherently accessible to any JS on
// the page and must not be relied upon for secrets in production.

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
      storage: createJSONStorage(() => localStorage),
    }
  )
);
