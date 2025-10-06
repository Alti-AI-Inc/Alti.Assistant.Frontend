import {
  fetchKnowledgeBaseConversations,
  fetchKnowledgeBaseList,
  loadSingleBaseConversation,
} from '@/actions/knowledgeBaseAction';
import { useQuery } from '@tanstack/react-query';

export type Knowledgebase = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  documentsCount: number;
  totalFileSize: number;
  formattedFileSize: string;
  settings: {
    maxDocuments: number;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type conversation = {
  // metadata: { category: 'knowledgebase'; tags: []; isGuest: false };
  _id: '68e39c3d520c19bac3b7d01c';
  conversationId: 'kb_68e21338c5a42f0c0fd0b14d_bdc848d7-be98-4fe5-a520-ba6be20e1861';
  title: 'Chat with My knowledgebase';
  messageCount: 2;
  lastActivity: '2025-10-06T10:38:55.066Z';
  createdAt: '2025-10-06T10:38:55.066Z';
  updatedAt: '2025-10-06T10:38:55.066Z';
};
export type KnowledgebaseConversationsResponse = {
  conversations: conversation[];
  totalCount: number;
  knowledgebaseId: string;
  knowledgebaseName: string;
};

export function useKnowledgeBases(accessToken?: string) {
  return useQuery<Knowledgebase[]>({
    queryKey: ['knowledgeBasesList', accessToken],
    queryFn: () => fetchKnowledgeBaseList(accessToken!),
    enabled: !!accessToken, // only run if token exists
    staleTime: 15000 * 60, // 5 min caching
  });
}

export function useKnowledgeBaseConversations(
  baseId: string,
  accessToken?: string,
) {
  return useQuery<KnowledgebaseConversationsResponse>({
    queryKey: ['knowledgeBasesConversations', baseId, accessToken],
    queryFn: () => fetchKnowledgeBaseConversations(baseId, accessToken!),
    enabled: !!accessToken, // only run if token exists
    staleTime: 15000 * 60, // 15 min caching
  });
}

export function useActiveBaseConversation(
  conversationId: string,
  accessToken?: string,
) {
  return useQuery({
    queryKey: ['activeBaseConversation', conversationId, accessToken],
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token');
      const response = await loadSingleBaseConversation(
        conversationId,
        accessToken,
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to load conversation');
      }

      return response.data; // should match ActiveConversation type
    },
    enabled: !!conversationId && conversationId !== 'new-chat' && !!accessToken,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}
