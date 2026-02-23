import { create } from 'zustand';

interface KnowledgeBaseStore {
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  setKnowledgeBaseId: (knowledgeBaseId: string) => void;
  setKnowledgeBaseName: (knowledgeBaseName: string) => void;
  clearKnowledgeBaseData: () => void;
}

export const useKnowledgebaseStore = create<KnowledgeBaseStore>((set) => ({
  knowledgeBaseId: '',
  knowledgeBaseName: '',
  setKnowledgeBaseId: (knowledgeBaseId: string) => set({ knowledgeBaseId }),
  setKnowledgeBaseName: (knowledgeBaseName: string) => set({ knowledgeBaseName }),
  clearKnowledgeBaseData: () => set({ knowledgeBaseId: '', knowledgeBaseName: '' }),
}));