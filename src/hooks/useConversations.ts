import {
  deleteConversation,
  fetchConversationList,
  fetchSavedConversationList,
  loadSingleConversation,
  loadSingleSharedConversation,
  PostConversation,
  searchConversations,
} from '@/actions/conversationsAction';
import {
  ActiveConversation,
  ROLES,
  useConversationsStore,
} from '@/stores/useConverstionsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export type Conversation = {
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
  return useQuery({
    queryKey: ['conversations', accessToken],
    queryFn: () => fetchConversationList(accessToken!),
    enabled: !!accessToken, // only run if token exists
    staleTime: 1000 * 60, // 1 min caching
  });
}
export function useSavedConversations(accessToken?: string) {
  return useQuery({
    queryKey: ['saved-conversations', accessToken],
    queryFn: () => fetchSavedConversationList(accessToken!),
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
      if (!accessToken) throw new Error('No access token');
      const response = await loadSingleConversation(
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

export function useSharedConversation(id: string, accessToken?: string) {
  return useQuery({
    queryKey: ['sharedConversation', id, accessToken],
    queryFn: async (): Promise<ActiveConversation> => {
      if (!accessToken) throw new Error('No access token');
      const response = await loadSingleSharedConversation(id, accessToken);

      if (!response.success) {
        throw new Error(response.message || 'Failed to load conversation');
      }

      return response.data.conversation; // should match ActiveConversation type
    },
    enabled: !!id && !!accessToken,
    staleTime: 1000 * 60 * 5, // 2 min
  });
}

export function usePostMessage(conversationId?: string) {
  const queryClient = useQueryClient();
  const { updateActiveConversation, activeConversation } =
    useConversationsStore();

  return useMutation({
    mutationFn: async ({
      apiUrl,
      message,
      accessToken,
    }: {
      apiUrl: string;
      message: string;
      accessToken: string;
    }) => {
      return await PostConversation(
        apiUrl,
        message,
        accessToken,
        conversationId === 'new-chat'
          ? activeConversation?.conversationId || undefined
          : conversationId,
      );
    },
    onMutate: async ({ message }) => {
      // optimistic update: add user message immediately
      updateActiveConversation(message, ROLES.USER);
    },
    onSuccess: response => {
      if (response.data?.responseMessage?.answer) {
        updateActiveConversation(
          response.data.responseMessage.answer,
          ROLES.ASSISTANT,
        );
      }

      // refresh sidebar list
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });

      // refresh active conversation
      if (response.data?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ['activeConversation', response.data.conversationId],
        });
      }
    },
    onError: err => {
      console.error('Message post failed:', err);
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const pathname = usePathname();
  const { onClose } = useModalStore();
  const router = useRouter();
  // const { setActiveConversation } = useConversationsStore();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!data?.accessToken) throw new Error('No access token');
      return await deleteConversation(data.accessToken, conversationId);
    },
    onSuccess: (_, deletedId) => {
      // navigate home if currently viewing deleted chat
      if (pathname.endsWith(deletedId)) {
        router.push('/');
      }

      queryClient.invalidateQueries({
        predicate: q =>
          q.queryKey[0] === 'conversations' ||
          q.queryKey[0] === 'saved-conversations',
      });
      onClose();
    },
    onMutate: async (conversationId: string) => {
      // Cancel outgoing refetches so they don’t overwrite optimistic update
      await queryClient.cancelQueries({
        queryKey: ['conversations', data?.accessToken],
      });

      // Snapshot previous data
      const previousConversations = queryClient.getQueryData<Conversation[]>([
        'conversations',
        data?.accessToken,
      ]);

      // Optimistically remove conversation
      queryClient.setQueryData<Conversation[]>(
        ['conversations', data?.accessToken],
        (old: Conversation[] = []) =>
          old.filter(c => c.conversationId !== conversationId),
      );

      return { previousConversations };
    },
    onError: (err, conversationId, context) => {
      // Rollback
      if (context?.previousConversations) {
        queryClient.setQueryData(
          ['conversations', data?.accessToken],
          context.previousConversations,
        );
      }
      console.error('Failed to delete conversation:', err);
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['conversations', data?.accessToken],
      });
    },
  });
}

export function useSearchConversations(
  accessToken?: string,
  searchTerm?: string,
) {
  return useQuery({
    queryKey: ['search-conversations', accessToken, searchTerm],
    queryFn: () => searchConversations(accessToken!, searchTerm!),
    enabled: !!accessToken && !!searchTerm, // only run when both exist
    staleTime: 0, // always fresh
  });
}
