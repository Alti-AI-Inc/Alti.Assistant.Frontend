import { createSpaceSearchAction } from '@/actions/spaceSearchActions';
import { createSpaceResearchAction } from '@/actions/spaceResearchActions';
import { getOrEnsureSpaceId } from '@/lib/space-utils';
import { extractDirectSearchAnswer } from '@/lib/search-answer';
import { deduplicateReferences, isNewChatId } from './utils';
import { OPTIONS } from '@/stores/useConversationsStore';

interface SearchHandlerArgs {
  selectedOption: string | null;
  conversationId?: string;
  pathname: string;
  accessToken: string;
  userMessage: string;
  immediateId?: string;
  userContext: any;
  userTimeZone: string;
}

export function useSearchHandler() {
  const handleSearchOrResearch = async ({
    selectedOption,
    conversationId,
    pathname,
    accessToken,
    userMessage,
    immediateId,
    userContext,
    userTimeZone,
  }: SearchHandlerArgs) => {
    if (
      selectedOption === OPTIONS.SEARCH ||
      selectedOption === OPTIONS.MONITOR ||
      conversationId === 'new-search' ||
      pathname === '/c/new-search' ||
      conversationId === 'new-monitor' ||
      pathname === '/c/new-monitor'
    ) {
      try {
        const spaceId = await getOrEnsureSpaceId(accessToken);
        const searchRes = await createSpaceSearchAction(
          spaceId,
          userMessage,
          isNewChatId(conversationId) ? undefined : conversationId,
          accessToken,
          userContext,
        );

        if (searchRes.success && searchRes.data) {
          const turn = searchRes.data;
          const results = Array.isArray(turn)
            ? turn
            : turn.results || (Array.isArray(turn.data) ? turn.data : []);

          if (results.length > 0) {
            const answer = extractDirectSearchAnswer(
              userMessage,
              results,
              userTimeZone,
            );

            const references = deduplicateReferences(
              results
                .filter((r: any) => !r.url?.toLowerCase().includes('exa.ai'))
                .map((r: any) => ({
                  title: r.title || r.url,
                  url: r.url,
                  summary: r.summary,
                  favicon: r.favicon,
                })),
            );

            const resolvedId =
              turn.searchSession ||
              turn.id ||
              turn._id ||
              immediateId ||
              (isNewChatId(conversationId)
                ? `search-${Date.now()}`
                : conversationId);

            return {
              success: true,
              message: 'Success',
              isStreamed: false,
              data: {
                conversationId: resolvedId,
                responseMessage: {
                  answer,
                  reference: references,
                },
              },
            };
          }

          const turnAny = turn as any;
          const turnAnswer = turnAny?.answer || turnAny?.summary || turnAny?.response || turnAny?.content || '';
          if (turnAnswer && typeof turnAnswer === 'string' && turnAnswer.trim().length > 0) {
            const resolvedId =
              turn.searchSession || turn.id || turn._id || immediateId ||
              (isNewChatId(conversationId) ? `search-${Date.now()}` : conversationId);
            return {
              success: true,
              message: 'Success',
              isStreamed: false,
              data: {
                conversationId: resolvedId,
                responseMessage: { answer: turnAnswer.trim(), reference: [] },
              },
            };
          }
        }
        console.warn('[SEARCH FALLBACK] Exa search returned no results, falling back to AI chat.');
      } catch (err: any) {
        console.warn('[SEARCH FALLBACK] Search threw error, falling back to AI chat:', err?.message);
      }
    }

    if (
      selectedOption === OPTIONS.RESEARCH ||
      conversationId === 'new-research' ||
      pathname === '/c/new-research'
    ) {
      try {
        const spaceId = await getOrEnsureSpaceId(accessToken);
        const researchRes = await createSpaceResearchAction(
          spaceId,
          userMessage,
          isNewChatId(conversationId) ? undefined : conversationId,
          accessToken,
          userContext,
        );

        if (researchRes.success && researchRes.data) {
          const turn = researchRes.data;
          const results = Array.isArray(turn)
            ? turn
            : turn.results || (Array.isArray(turn.data) ? turn.data : []);

          if (results.length > 0) {
            const answer = extractDirectSearchAnswer(
              userMessage,
              results,
              userTimeZone,
            );

            const references = deduplicateReferences(
              results
                .filter((r: any) => !r.url?.toLowerCase().includes('exa.ai'))
                .map((r: any) => ({
                  title: r.title || r.url,
                  url: r.url,
                  summary: r.summary,
                  favicon: r.favicon,
                })),
            );

            const resolvedId =
              turn.searchSession ||
              turn.id ||
              turn._id ||
              immediateId ||
              (isNewChatId(conversationId)
                ? `research-${Date.now()}`
                : conversationId);

            return {
              success: true,
              message: 'Success',
              isStreamed: false,
              data: {
                conversationId: resolvedId,
                responseMessage: {
                  answer,
                  reference: references,
                },
              },
            };
          }

          const turnAny = turn as any;
          const turnAnswer = turnAny?.answer || turnAny?.summary || turnAny?.response || turnAny?.content || '';
          if (turnAnswer && typeof turnAnswer === 'string' && turnAnswer.trim().length > 0) {
            const resolvedId =
              turn.searchSession || turn.id || turn._id || immediateId ||
              (isNewChatId(conversationId) ? `research-${Date.now()}` : conversationId);
            return {
              success: true,
              message: 'Success',
              isStreamed: false,
              data: {
                conversationId: resolvedId,
                responseMessage: { answer: turnAnswer.trim(), reference: [] },
              },
            };
          }
        }
        console.warn('[RESEARCH FALLBACK] Research returned no results, falling back to AI chat.');
      } catch (err: any) {
        console.warn('[RESEARCH FALLBACK] Research threw error, falling back to AI chat:', err?.message);
      }
    }

    return null;
  };

  return { handleSearchOrResearch };
}
