import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  instructions: string;
  guardrails: string;
  accounts: string;
  files: { id: string; name: string; url: string; size: string }[];
  setInstructions: (instructions: string) => void;
  setGuardrails: (guardrails: string) => void;
  setAccounts: (accounts: string) => void;
  setFiles: (files: { id: string; name: string; url: string; size: string }[]) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      instructions: '',
      guardrails: '',
      accounts: '',
      files: [],
      setInstructions: (instructions) => set({ instructions }),
      setGuardrails: (guardrails) => set({ guardrails }),
      setAccounts: (accounts) => set({ accounts }),
      setFiles: (files) => set({ files }),
    }),
    {
      name: 'admin-editors-storage',
    }
  )
);
