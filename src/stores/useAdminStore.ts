import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  instructions: string;
  guardrails: string;
  files: { id: string; name: string; url: string; size: string }[];
  setInstructions: (instructions: string) => void;
  setGuardrails: (guardrails: string) => void;
  setFiles: (files: { id: string; name: string; url: string; size: string }[]) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      instructions: '',
      guardrails: '',
      files: [],
      setInstructions: (instructions) => set({ instructions }),
      setGuardrails: (guardrails) => set({ guardrails }),
      setFiles: (files) => set({ files }),
    }),
    {
      name: 'admin-editors-storage',
    }
  )
);
