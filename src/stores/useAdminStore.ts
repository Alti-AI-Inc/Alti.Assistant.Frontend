import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  instructions: string;
  guardrails: string;
  accounts: string;
  partners: string;
  files: { id: string; name: string; url: string; size: string }[];
  setInstructions: (instructions: string) => void;
  setGuardrails: (guardrails: string) => void;
  setAccounts: (accounts: string) => void;
  setPartners: (partners: string) => void;
  setFiles: (files: { id: string; name: string; url: string; size: string }[]) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      instructions: '',
      guardrails: '',
      accounts: '',
      partners: '',
      files: [],
      setInstructions: (instructions) => set({ instructions }),
      setGuardrails: (guardrails) => set({ guardrails }),
      setAccounts: (accounts) => set({ accounts }),
      setPartners: (partners) => set({ partners }),
      setFiles: (files) => set({ files }),
    }),
    {
      name: 'admin-editors-storage',
    }
  )
);
