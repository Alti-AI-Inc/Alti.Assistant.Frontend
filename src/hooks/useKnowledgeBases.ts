import {
  deleteKnowledgeBase,
  deleteKnowledgeBaseFile,
  fetchKnowledgeBaseConversations,
  fetchKnowledgeBaseList,
  getKnowledgeBaseFiles,
  KnowledgeBaseFilesResponse,
  loadSingleBaseConversation,
} from '@/actions/knowledgeBaseAction';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

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
    queryFn: async () => {
      const response = await fetchKnowledgeBaseList(accessToken!);
      if (!response.success) {
        console.error('fetchKnowledgeBaseList failed:', response.debugMessage);
        console.error(response.message);
        // throw new Error(response.message);
        return [];
      }
      return response.data;
    },
    enabled: !!accessToken, // only run if token exists
    staleTime: 15000 * 60, // 15 min caching
  });
}

export function useKnowledgeBaseConversations(
  baseId: string,
  accessToken?: string,
) {
  return useQuery<KnowledgebaseConversationsResponse>({
    queryKey: ['knowledgeBasesConversations', baseId, accessToken],
    queryFn: async () => {
      const response = await fetchKnowledgeBaseConversations(
        baseId,
        accessToken!,
      );
      if (!response.success) {
        console.error(
          'fetchKnowledgeBaseConversations failed:',
          response.debugMessage,
        );
        console.error(response.message);
        // throw new Error(response.message);
        return {
          conversations: [],
          totalCount: 0,
          knowledgebaseId: baseId,
          knowledgebaseName: '',
        };
      }
      return response.data;
    },
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
      if (!accessToken) {
        console.error('No access token');
        // throw new Error('No access token');
        return null;
      }
      const response = await loadSingleBaseConversation(
        conversationId,
        accessToken,
      );

      if (!response.success) {
        console.error(
          'loadSingleBaseConversation failed:',
          response.debugMessage,
        );
        // throw new Error(response.message || 'Failed to load conversation');
        return null;
      }

      return response.data; // should match ActiveConversation type
    },
    enabled: !!conversationId && conversationId !== 'new-chat' && !!accessToken,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useKnowledgeBaseFiles(
  baseId: string,
  accessToken?: string,
): UseQueryResult<KnowledgeBaseFilesResponse> {
  return useQuery<KnowledgeBaseFilesResponse>({
    queryKey: ['knowledgeBasesFiles', baseId, accessToken],
    queryFn: async () => {
      const response = await getKnowledgeBaseFiles(baseId, accessToken!);
      if (!response.success) {
        console.error('getKnowledgeBaseFiles failed:', response.debugMessage);
        console.error(response.message);
        // throw new Error(response.message);
        return { files: [], totalCount: 0, knowledgebotId: baseId };
      }
      return response.data!;
    },
    enabled: !!accessToken && !!baseId, // only run if token exists
    staleTime: 15000 * 60, // 15 min caching
  });
}

export function useDeleteKnowledgeBaseFile(
  baseId?: string,
  onClose?: () => void,
) {
  const queryClient = useQueryClient();
  const { data } = useSession();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await deleteKnowledgeBaseFile(fileId, data?.accessToken);
      if (!response.success) {
        console.error('deleteKnowledgeBaseFile failed:', response.debugMessage);
        console.error(response.message);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      // ✅ Automatically refresh file list
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBasesFiles', baseId, data?.accessToken],
      });
      if (onClose) onClose();
    },
    onError: error => {
      console.error('File deletion failed:', error);
    },
  });
}

export function useDeleteKnowledgeBase(onClose?: () => void) {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const { setActiveConversation } = useConversationsStore();

  return useMutation({
    mutationFn: async (baseId: string) => {
      const response = await deleteKnowledgeBase(baseId, data?.accessToken);
      if (!response.success) {
        console.error('deleteKnowledgeBase failed:', response.debugMessage);
        console.error(response.message);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      // ✅ Automatically refresh file list
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBasesList', data?.accessToken],
      });
      setActiveConversation(null);
      if (onClose) onClose();
    },
    onError: error => {
      console.error('File deletion failed:', error);
    },
  });
}
