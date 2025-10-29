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
    queryFn: ({ pageParam }) =>
      fetchConversationList(
        accessToken!,
        typeof pageParam === 'number'
          ? (pageParam as number)
          : Number(pageParam || 1),
      ),
    getNextPageParam: lastPage =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 10, // 10 min caching
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

export function useSharedConversation(id: string) {
  return useQuery({
    queryKey: ['sharedConversation', id],
    queryFn: async (): Promise<ActiveConversation> => {
      const response = await loadSingleSharedConversation(id);

      if (!response.success) {
        throw new Error(response.message || 'Failed to load conversation');
      }

      return response.data.conversation; // should match ActiveConversation type
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
  // const { setActiveConversation } = useConversationsStore();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!data?.accessToken) throw new Error('No access token');
      return await deleteConversation(data.accessToken, conversationId);
    },
    onSuccess: (resp, deletedId) => {
      console.log('Deleted conversation: resp', resp);
      // navigate home if currently viewing deleted chat
      if (
        pathname.endsWith(deletedId) ||
        activeConversation?._id === deletedId
      ) {
        router.push('/chat');
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
      const previousConversations = queryClient.getQueryData<ConversationDetails[]>([
        'conversations',
        data?.accessToken,
      ]);

      // Optimistically remove conversation
      queryClient.setQueryData<ConversationDetails[]>(
        ['conversations', data?.accessToken],
        (old: ConversationDetails[] = []) =>
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
