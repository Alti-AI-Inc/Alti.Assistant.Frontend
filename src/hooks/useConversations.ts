import {
  ConversationListResponse,
  deleteConversation,
  fetchConversationList,
  fetchSavedConversationList,
  loadSingleConversation,
  loadSingleSharedConversation,
  searchConversations,
} from '@/actions/conversationsAction';
import {
  ActiveConversation,
  useConversationsStore,
} from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export type ConversationDetails = {
  _id: string;
  conversationId: string;
  userId: string;
  title: string;
  status: 'active' | 'inactive';
  metadata: {
    model: string;
    category: string;
    userType: string;
    tags: string[];
    isGuest: boolean;
  };
  messageCount: number;
  isPublic: boolean;
  is_deep_search: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
};

export function useConversations(accessToken?: string) {
  return useInfiniteQuery<ConversationListResponse>({
    queryKey: ['conversations', accessToken],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      try {
        const response = await fetchConversationList(
          accessToken!,
          typeof pageParam === 'number'
            ? (pageParam as number)
            : Number(pageParam || 1),
        );
        if (!response.success) {
          console.error(
            'fetchConversationList failed:',
            response.debugMessage,
            response.message,
          );
          // Return empty list instead of throwing
          return {
            conversations: [],
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        return response.data!;
      } catch (error) {
        console.error('fetchConversationList exception:', error);
        return {
          conversations: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
    },
    getNextPageParam: lastPage =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 10, // 10 min caching
  });
}
export function useSavedConversations(accessToken?: string) {
  return useQuery({
    queryKey: ['saved-conversations', accessToken],
    queryFn: async () => {
      try {
        const response = await fetchSavedConversationList(accessToken!);
        if (!response.success) {
          console.error(
            'fetchSavedConversationList failed:',
            response.debugMessage,
            response.message,
          );
          return [];
        }
        return response.data;
      } catch (error) {
        console.error('fetchSavedConversationList exception:', error);
        return [];
      }
    },
    enabled: !!accessToken, // only run if token exists
    // staleTime: 1000 * 60, // 1 min caching
    staleTime: Infinity,
  });
}

export function useActiveConversation(
  conversationId: string,
  accessToken?: string,
) {
  return useQuery({
    queryKey: ['activeConversation', conversationId, accessToken],
    queryFn: async () => {
      if (!accessToken) return { messages: [] };

      try {
        const response = await loadSingleConversation(
          conversationId,
          accessToken,
        );

        if (!response.success) {
          console.error(
            'loadSingleConversation failed:',
            response.debugMessage,
            response.message,
          );
          return { messages: [] };
        }

        const data = response.data; // should match ActiveConversation type

        // Sanitize messages to avoid showing success text in UI
        if (data && data.messages) {
          data.messages = data.messages.map((msg: any) => {
            if (msg.role === 'assistant') {
              // Document generation metadata mapping
              if (msg.metadata?.documentGenerated && !msg.metadata.document) {
                const { exportResult, uploadResult, collectedParams } =
                  msg.metadata;
                if (exportResult && uploadResult) {
                  msg.metadata.document = {
                    content: collectedParams?.content || '', // Fallback content
                    format: exportResult.format,
                    file: {
                      filePath: exportResult.filePath,
                      fileName: exportResult.fileName,
                      format: exportResult.format,
                      size: exportResult.size,
                    },
                    url: uploadResult.publicUrl || uploadResult.url,
                    metadata: {
                      title:
                        collectedParams?.title ||
                        exportResult.fileName ||
                        'Generated Document',
                      documentType: collectedParams?.documentType || 'document',
                      ...collectedParams,
                    },
                  };
                }
              }

              if (
                msg.content.startsWith('Image generated successfully') ||
                msg.content.startsWith('Image edited successfully') ||
                // msg.content.startsWith('Video generated successfully') ||
                msg.content.startsWith('Intent analysis:')
              ) {
                return { ...msg, content: '' };
              }
            }
            return msg;
          });
        }

        return data;
      } catch (error) {
        console.error('loadSingleConversation exception:', error);
        return { messages: [] };
      }
    },
    enabled: !!conversationId && conversationId !== 'new-chat' && !!accessToken,
    // staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useSharedConversation(id: string) {
  return useQuery({
    queryKey: ['sharedConversation', id],
    queryFn: async (): Promise<ActiveConversation> => {
      try {
        const response = await loadSingleSharedConversation(id);

        if (!response.success) {
          console.error(
            'loadSingleSharedConversation failed:',
            response.debugMessage,
            response.message,
          );
          return { messages: [] };
        }

        const conversation = response.data.conversation; // should match ActiveConversation type

        // Sanitize messages to avoid showing success text in UI
        if (conversation && conversation.messages) {
          conversation.messages = conversation.messages.map((msg: any) => {
            if (msg.role === 'assistant') {
              // Document generation metadata mapping
              if (msg.metadata?.documentGenerated && !msg.metadata.document) {
                const { exportResult, uploadResult, collectedParams } =
                  msg.metadata;
                if (exportResult && uploadResult) {
                  msg.metadata.document = {
                    content: collectedParams?.content || '',
                    format: exportResult.format,
                    file: {
                      filePath: exportResult.filePath,
                      fileName: exportResult.fileName,
                      format: exportResult.format,
                      size: exportResult.size,
                    },
                    url: uploadResult.publicUrl || uploadResult.url,
                    metadata: {
                      title:
                        collectedParams?.title ||
                        exportResult.fileName ||
                        'Generated Document',
                      documentType: collectedParams?.documentType || 'document',
                      ...collectedParams,
                    },
                  };
                }
              }

              if (
                msg.content.startsWith('Image generated successfully') ||
                msg.content.startsWith('Image edited successfully') ||
                msg.content.startsWith('Video generated successfully') ||
                msg.content.startsWith('Intent analysis:')
              ) {
                return { ...msg, content: '' };
              }
            }
            return msg;
          });
        }

        return conversation;
      } catch (error) {
        console.error('loadSingleSharedConversation exception:', error);
        return { messages: [] };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 2 min
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { activeConversation } = useConversationsStore();
  const { data } = useSession();
  const pathname = usePathname();
  const { onClose } = useModalStore();
  const router = useRouter();
  const { setActiveConversation } = useConversationsStore();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!data?.accessToken) {
        console.error('No access token');
        return null; // throw new Error('No access token');
      }
      try {
        const response = await deleteConversation(
          data.accessToken,
          conversationId,
        );
        if (!response.success) {
          console.error(
            'deleteConversation failed:',
            response.debugMessage,
            response.message,
          );
          // throw new Error(response.message);
          return null;
        }
        return response.data;
      } catch (error) {
        console.error('deleteConversation exception:', error);
        return null;
        // throw error;
      }
    },
    onSuccess: (resp, deletedId) => {
      if (!resp) return;
      console.log('Deleted conversation: resp', resp);
      // navigate home if currently viewing deleted chat
      if (
        pathname.endsWith(deletedId) ||
        activeConversation?._id === deletedId
      ) {
        router.push('/');
        setActiveConversation(null);
      }

      queryClient.invalidateQueries({
        predicate: q =>
          q.queryKey[0] === 'conversations' ||
          q.queryKey[0] === 'saved-conversations',
      });
      onClose();
    },
  });
}

export function useSearchConversations(
  accessToken?: string,
  searchTerm?: string,
) {
  return useQuery({
    queryKey: ['search-conversations', accessToken, searchTerm],
    queryFn: async () => {
      try {
        const response = await searchConversations(accessToken!, searchTerm!);
        if (!response.success) {
          console.error(
            'searchConversations failed:',
            response.debugMessage,
            response.message,
          );
          return [];
        }
        return response.data;
      } catch (error) {
        console.error('searchConversations exception:', error);
        return [];
      }
    },
    enabled: !!accessToken && !!searchTerm, // only run when both exist
    staleTime: 0, // always fresh
  });
}
