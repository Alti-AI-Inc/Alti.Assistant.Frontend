import {
  Conversation,
  ConversationListResponse,
  deleteConversation,
  fetchConversationList,
  fetchSavedConversationList,
  loadSingleConversation,
  loadSingleSharedConversation,
  renameConversationAction,
  searchConversations,
} from '@/actions/conversationsAction';
import {
  ActiveConversation,
  ROLES,
  useConversationsStore,
} from '@/stores/useConversationsStore';
import { ConversationMessage } from '@/types/conversation';
import { useModalStore } from '@/stores/useModalStore';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export const DEFAULT_SAMPLE_CONVERSATIONS: (Conversation & { messages: ConversationMessage[] })[] = [
  {
    _id: 'mock_conv_1',
    conversationId: 'market-analysis-top-tech',
    title: 'Market Analysis & Top Tech Equities',
    updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    messages: [
      {
        role: ROLES.USER,
        content: 'Analyze the current performance and valuation trends of top tech equities.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        role: ROLES.ASSISTANT,
        content: `### Tech Equities Performance & Valuation Analysis

Recent performance across major technology equities highlights resilient revenue expansion driven by enterprise AI adoption and cloud compute demands:

1. **Semiconductors & Accelerators**: Gross margins remain elevated (65–75%) amid sustained hyperscaler capital expenditures.
2. **Enterprise Cloud Software**: Net Retention Rates (NRR) average 112–118% across tier-1 platforms, with stabilizing seat-based licensing.
3. **Valuation Multiples**: Forward EV/Sales multiples are normalizing near historical 5-year averages, demonstrating disciplined capital allocation.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
      },
    ],
  },
  {
    _id: 'mock_conv_2',
    conversationId: 'ai-inference-acceleration',
    title: 'Deep Research: Next-Gen AI Inference',
    updatedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    messages: [
      {
        role: ROLES.USER,
        content: 'Conduct a deep research overview on specialized silicon for AI inference efficiency.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        role: ROLES.ASSISTANT,
        content: `### Executive Summary: Specialized Silicon for AI Inference

- **Hardware Architecture**: Transition toward domain-specific ASICs optimized for low-precision tensor operations (FP8 and INT4 quantization).
- **Memory Bandwidth**: High-Bandwidth Memory (HBM3e) integration reduces latency during the auto-regressive generation phase.
- **Cost Efficiency**: Dedicated inference clusters yield up to 3.5x token-per-watt throughput gains over legacy general-purpose accelerators.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  {
    _id: 'mock_conv_3',
    conversationId: 'contract-review-indemnification',
    title: 'Contract Review & Indemnification Clauses',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        role: ROLES.USER,
        content: 'Review standard mutual NDA and MSA indemnification clauses for IP infringement.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        role: ROLES.ASSISTANT,
        content: `### Contract Review: Indemnification & Risk Allocation

1. **IP Indemnity**: Provide mutual defense against direct third-party intellectual property claims, excluding unauthorized modifications or third-party code combinations.
2. **Liability Cap**: Aggregate liability capped at fees paid over the preceding 12 months, with express exclusions for gross negligence and willful misconduct.
3. **Survival Period**: Confidentiality obligations remain in effect for 3 years post-termination.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      },
    ],
  },
  {
    _id: 'mock_conv_4',
    conversationId: 'aphura-scaling',
    title: 'Aphura Bare-Metal Scaling',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    messages: [
      {
        role: ROLES.USER,
        content: 'What are the recommended auto-scaling policies for ECS Fargate microservices handling burst traffic?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        role: ROLES.ASSISTANT,
        content: `### ECS Fargate Burst-Traffic Auto-Scaling Architecture

- **Primary Metric**: Target tracking scaling on \`ALBRequestCountPerTarget\` (set to 70% of peak tested capacity).
- **Secondary Metric**: Step scaling on CPU and memory utilization with rapid scale-out thresholds (60s evaluation period).
- **Graceful Shutdown**: Configure \`stopTimeout\` to 30s allowing active in-flight requests to complete without connection drops.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
      },
    ],
  },
  {
    _id: 'mock_conv_5',
    conversationId: 'saas-valuation-modeling',
    title: 'SaaS Valuation & Revenue Multiple Modeling',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    messages: [
      {
        role: ROLES.USER,
        content: 'Build a comparison table of enterprise SaaS valuation multiples based on ARR growth and Net Retention Rate (NRR).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
      {
        role: ROLES.ASSISTANT,
        content: `### Enterprise SaaS Valuation Multiples

| Growth Profile | ARR Growth | Net Retention Rate | EV / NTM Revenue |
| :--- | :--- | :--- | :--- |
| Hyper-Growth (Top Decile) | > 40% | > 120% | 12.0x – 16.0x |
| High Performance (Rule of 40+) | 25% – 40% | 110% – 120% | 8.0x – 12.0x |
| Efficient Steady Growth | 15% – 25% | 105% – 110% | 5.5x – 8.0x |
| Low Growth / High FCF | < 15% | 98% – 104% | 3.5x – 5.5x |`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
      },
    ],
  },
];

export function getLocalConversations(): (Conversation & { messages: ConversationMessage[] })[] {
  if (typeof window === 'undefined') return DEFAULT_SAMPLE_CONVERSATIONS;
  try {
    const raw = localStorage.getItem('aphura_conversations');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: Conversation & { messages?: ConversationMessage[] }) => {
          const id = item.conversationId || item._id;
          return {
            ...item,
            _id: item._id || id,
            conversationId: item.conversationId || id,
            messages: (item.messages || []) as ConversationMessage[],
          };
        });
      }
    }
    localStorage.setItem(
      'aphura_conversations',
      JSON.stringify(DEFAULT_SAMPLE_CONVERSATIONS),
    );
    return DEFAULT_SAMPLE_CONVERSATIONS;
  } catch {
    return DEFAULT_SAMPLE_CONVERSATIONS;
  }
}

export function saveLocalConversation(conv: Partial<Conversation & { messages?: ConversationMessage[] }>) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalConversations();
    const targetId = conv.conversationId || conv._id;
    if (!targetId) return;

    const normalizedConv: Conversation & { messages: ConversationMessage[] } = {
      title: 'New Chat',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      messages: [],
      ...conv,
      _id: conv._id || targetId,
      conversationId: conv.conversationId || targetId,
    };

    const idx = list.findIndex(
      c =>
        (targetId && (c.conversationId === targetId || c._id === targetId)) ||
        (normalizedConv.conversationId &&
          c.conversationId === normalizedConv.conversationId) ||
        (normalizedConv._id && c._id === normalizedConv._id),
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...normalizedConv };
    } else {
      list.unshift(normalizedConv);
    }
    localStorage.setItem('aphura_conversations', JSON.stringify(list));
  } catch {}
}

export function removeLocalConversation(convId: string) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalConversations().filter(
      c => c.conversationId !== convId && c._id !== convId,
    );
    localStorage.setItem('aphura_conversations', JSON.stringify(list));
  } catch {}
}

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

export function useConversations(
  accessToken?: string,
  isDeepSearch?: boolean,
  category?: string,
) {
  return useInfiniteQuery<ConversationListResponse>({
    // isDeepSearch and category in queryKey keep caches independent
    queryKey: ['conversations', accessToken, isDeepSearch, category],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const pageNum =
        typeof pageParam === 'number'
          ? (pageParam as number)
          : Number(pageParam || 1);

      if (!accessToken) {
        const localList = getLocalConversations().map(c => ({
          ...c,
          _id: c._id || c.conversationId,
          conversationId: c.conversationId || c._id,
        }));
        return {
          conversations: localList,
          pagination: {
            page: 1,
            limit: 20,
            total: localList.length,
            pages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      try {
        const response = await fetchConversationList(
          accessToken,
          pageNum,
          isDeepSearch,
          category,
        );

        const serverConversations =
          response.success && response.data?.conversations
            ? response.data.conversations
            : [];

        // For page 1, merge server conversations with real local conversations seamlessly
        if (pageNum === 1) {
          const localList = getLocalConversations().map(c => ({
            ...c,
            _id: c._id || c.conversationId,
            conversationId: c.conversationId || c._id,
          }));

          const serverIds = new Set<string>();
          for (const s of serverConversations) {
            if (s.conversationId) serverIds.add(s.conversationId);
            if (s._id) serverIds.add(s._id);
          }

          const merged: Conversation[] = serverConversations.map(s => ({
            ...s,
            _id: s._id || s.conversationId,
            conversationId: s.conversationId || s._id,
          }));

          for (const local of localList) {
            // Don't include sample mock conversations if user has real server conversations
            if (local._id?.startsWith('mock_conv_') && serverConversations.length > 0) {
              continue;
            }
            const localKey = local.conversationId || local._id;
            if (
              localKey &&
              !serverIds.has(localKey) &&
              !serverIds.has(local.conversationId) &&
              !serverIds.has(local._id)
            ) {
              merged.push(local);
              if (local.conversationId) serverIds.add(local.conversationId);
              if (local._id) serverIds.add(local._id);
            }
          }

          // Sort descending by lastActivity / updatedAt / createdAt
          merged.sort((a, b) => {
            const lastActivityA = (a as { lastActivity?: string }).lastActivity;
            const lastActivityB = (b as { lastActivity?: string }).lastActivity;
            const timeA = new Date(
              a.updatedAt || lastActivityA || a.createdAt || 0,
            ).getTime();
            const timeB = new Date(
              b.updatedAt || lastActivityB || b.createdAt || 0,
            ).getTime();
            return timeB - timeA;
          });

          return {
            conversations: merged,
            pagination: response.data?.pagination || {
              page: 1,
              limit: 20,
              total: merged.length,
              pages: Math.ceil(merged.length / 20) || 1,
              hasNext: response.data?.pagination?.hasNext || false,
              hasPrev: false,
            },
          };
        }

        // Subsequent pages (pageNum > 1)
        if (!response.success || !response.data?.conversations?.length) {
          return {
            conversations: [],
            pagination: {
              page: pageNum,
              limit: 20,
              total: 0,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }

        return {
          ...response.data,
          conversations: response.data.conversations.map(s => ({
            ...s,
            _id: s._id || s.conversationId,
            conversationId: s.conversationId || s._id,
          })),
        };
      } catch (error) {
        const localList = getLocalConversations().map(c => ({
          ...c,
          _id: c._id || c.conversationId,
          conversationId: c.conversationId || c._id,
        }));
        return {
          conversations: localList,
          pagination: {
            page: 1,
            limit: 20,
            total: localList.length,
            pages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
    },
    getNextPageParam: lastPage =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    enabled: true,
    retry: false,
    staleTime: 1000 * 30, // 30s caching
  });
}
export function useSavedConversations(accessToken?: string) {
  return useQuery({
    queryKey: ['saved-conversations', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      try {
        const response = await fetchSavedConversationList(accessToken);
        if (!response.success) {
          if (response.statusCode !== 401 && response.statusCode !== 403) {
          }

          return [];
        }
        return response.data;
      } catch (error) {
        return [];
      }
    },
    enabled: !!accessToken, // only run if token exists
    retry: false,
    // staleTime: 1000 * 60, // 1 min caching
    staleTime: Infinity,
  });
}

export function useActiveConversation(
  conversationId: string,
  accessToken?: string,
) {
  const isNew =
    !conversationId ||
    conversationId.startsWith('new') ||
    conversationId === 'new-chat' ||
    conversationId === 'new-search' ||
    conversationId === 'new-research' ||
    conversationId === 'new-monitor';

  return useQuery({
    queryKey: ['activeConversation', conversationId, accessToken],
    enabled: !!accessToken && !!conversationId && !isNew,
    initialData: isNew ? { messages: [] } : undefined,
    queryFn: async () => {
      if (!accessToken) return { messages: [] };

      try {
        const response = await loadSingleConversation(
          conversationId,
          accessToken,
        );

        if (!response.success || !response.data) {
          const localList = getLocalConversations();
          const found = localList.find(
            (c) => c.conversationId === conversationId || c._id === conversationId,
          );
          if (found) {
            return found;
          }
          return { messages: [] };
        }

        const data = response.data; // should match ActiveConversation type

        // Sanitize messages to avoid showing success text in UI
        if (data && data.messages) {
          data.messages = data.messages.map((msg: ConversationMessage) => {
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
                    url: uploadResult.publicUrl || uploadResult.url || '',
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
                msg.content.startsWith('Image generation completed successfully') ||
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
        return { messages: [] };
      }
    },
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
          return { messages: [] };
        }

        const conversation = response.data.conversation; // should match ActiveConversation type

        // Sanitize messages to avoid showing success text in UI
        if (conversation && conversation.messages) {
          conversation.messages = conversation.messages.map((msg: ConversationMessage) => {
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
                    url: uploadResult.publicUrl || uploadResult.url || '',
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
      removeLocalConversation(conversationId);
      if (!data?.accessToken) {
        return { success: true };
      }
      try {
        const response = await deleteConversation(
          data.accessToken,
          conversationId,
        );
        return response?.data || { success: true };
      } catch (error) {
        return { success: true };
      }
    },
    onSuccess: (resp, deletedId) => {
      if (!resp) return;

      // Find the conversationId associated with this deletedId in cache to handle navigation
      let targetConvId = deletedId;
      const conversationListQueries = queryClient.getQueriesData<InfiniteData<ConversationListResponse>>({ queryKey: ['conversations'] });
      for (const [, queryData] of conversationListQueries) {
        if (queryData?.pages) {
          for (const page of queryData.pages) {
            const found = page.conversations?.find((c: Conversation) => c._id === deletedId);
            if (found) {
              targetConvId = found.conversationId;
              break;
            }
          }
        }
      }

      // navigate home if currently viewing deleted chat (checking both _id and conversationId)
      if (
        pathname.endsWith(deletedId) ||
        pathname.endsWith(targetConvId) ||
        activeConversation?._id === deletedId ||
        activeConversation?.conversationId === targetConvId ||
        activeConversation?.conversationId === deletedId
      ) {
         router.push(data?.accessToken ? '/c/new-search' : '/');
        setActiveConversation(null);
      }

      // Manually remove from infinite query cache ('conversations')
      queryClient.setQueriesData<InfiniteData<ConversationListResponse>>({ queryKey: ['conversations'] }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            conversations: (page.conversations || []).filter(
              (chat: Conversation) => chat._id !== deletedId && chat.conversationId !== targetConvId
            ),
          })),
        };
      });

      // Manually remove from saved conversations cache ('saved-conversations')
      queryClient.setQueriesData<Conversation[]>({ queryKey: ['saved-conversations'] }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(
          (chat: Conversation) => chat._id !== deletedId && chat.conversationId !== targetConvId
        );
      });

      // queryClient.invalidateQueries({
      //   predicate: q =>
      //     q.queryKey[0] === 'conversations' ||
      //     q.queryKey[0] === 'saved-conversations',
      // });

      onClose();
    },
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();
  const { activeConversation, setActiveConversation } = useConversationsStore();
  const { data } = useSession();
  const { onClose } = useModalStore();

  return useMutation({
    mutationFn: async ({
      conversationId,
      newTitle,
    }: {
      conversationId: string;
      newTitle: string;
    }) => {
      // 1. Always update local storage for mock/cached conversations
      saveLocalConversation({ conversationId, title: newTitle });

      // 2. Call backend if user is authenticated
      if (data?.accessToken) {
        try {
          const res = await renameConversationAction(
            conversationId,
            newTitle,
            data.accessToken,
          );
          if (!res.success && res.debugMessage) {
          }
        } catch (error) {
        }
      }

      return { conversationId, newTitle };
    },
    onSuccess: ({ conversationId, newTitle }) => {
      // 3. Update active conversation in store if it matches
      if (
        activeConversation?.conversationId === conversationId ||
        activeConversation?._id === conversationId
      ) {
        setActiveConversation({
          ...activeConversation,
          title: newTitle,
        });
      }

      // 4. Manually update infinite query cache ('conversations')
      queryClient.setQueriesData<InfiniteData<ConversationListResponse>>({ queryKey: ['conversations'] }, (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            conversations: (page.conversations || []).map((chat: Conversation) => {
              if (
                chat.conversationId === conversationId ||
                chat._id === conversationId
              ) {
                return { ...chat, title: newTitle };
              }
              return chat;
            }),
          })),
        };
      });

      // 5. Manually update saved conversations cache ('saved-conversations')
      queryClient.setQueriesData<Conversation[]>({ queryKey: ['saved-conversations'] }, (oldData) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;
        return oldData.map((chat: Conversation) => {
          if (
            chat.conversationId === conversationId ||
            chat._id === conversationId
          ) {
            return { ...chat, title: newTitle };
          }
          return chat;
        });
      });

      onClose();
    },
    onError: error => {
      console.error('Rename error:', error);
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
        if (!response.success || !response.data?.length) {
          const localList = getLocalConversations();
          const term = (searchTerm || '').toLowerCase();
          return localList.filter((c) =>
            (c.title || '').toLowerCase().includes(term),
          );
        }
        return response.data;
      } catch (error) {
        const localList = getLocalConversations();
        const term = (searchTerm || '').toLowerCase();
        return localList.filter((c) =>
          (c.title || '').toLowerCase().includes(term),
        );
      }
    },
    enabled: !!accessToken && !!searchTerm, // only run when both exist
    staleTime: 0, // always fresh
  });
}
