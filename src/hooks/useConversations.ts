import {
  deleteConversation,
  fetchConversationList,
  loadSingleConversation,
  PostConversation,
} from '@/actions/conversations';
import { ROLES, useConversationsStore } from '@/stores/useConverstionsStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

type Conversation = {
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

export function usePostMessage(conversationId?: string) {
  const queryClient = useQueryClient();
  const { updateActiveConversation, activeConversation } =
    useConversationsStore();

  return useMutation({
    mutationFn: async ({
      message,
      accessToken,
    }: {
      message: string;
      accessToken: string;
    }) => {
      return await PostConversation(
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
      // clear active conversation
      // setActiveConversation(null);
      // invalidate list
      queryClient.invalidateQueries({
        queryKey: ['conversations', data?.accessToken],
      });
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
