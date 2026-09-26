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
  userContext: Record<string, unknown> | null | undefined;
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
      conversationId === 'new-search' ||
      pathname === '/c/new-search'
    ) {
      try {
        const spaceId = await getOrEnsureSpaceId(accessToken);
        const searchRes = await createSpaceSearchAction(
          spaceId,
          userMessage,
          isNewChatId(conversationId) ? undefined : conversationId,
          accessToken,
          userContext
            ? (userContext as { timezone?: string; localDate?: string; localTime?: string })
            : undefined,
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
                .filter((r: { url?: string }) => !r.url?.toLowerCase().includes('exa.ai'))
                .map((r: { title?: string; url?: string; summary?: string; favicon?: string }) => ({
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
              conversationId ||
              immediateId ||
              `search-${Date.now()}`;

            const turnAnswer =
              turn.responseMessage?.answer ||
              turn.answer ||
              answer ||
              'Here is what I found:';

            return {
              success: true,
              message: 'Success',
              isStreamed: false,
              data: {
                conversationId: resolvedId,
                responseMessage: {
                  answer: turnAnswer.trim(),
                  reference: references,
                  followUps: turn.responseMessage?.followUps || turn.followUps || [],
                },
              },
            };
          }

          const turnRecord = turn as Record<string, unknown>;
          const turnAnswer = (turnRecord?.answer || turnRecord?.summary || turnRecord?.response || turnRecord?.content || '') as string;
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
      } catch (err: unknown) {
        console.warn('[SEARCH FALLBACK] Search threw error, falling back to AI chat:', err instanceof Error ? err.message : String(err));
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
          userContext
            ? (userContext as { timezone?: string; localDate?: string; localTime?: string })
            : undefined,
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
                .filter((r: { url?: string }) => !r.url?.toLowerCase().includes('exa.ai'))
                .map((r: { title?: string; url?: string; summary?: string; favicon?: string }) => ({
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

            const resAnswer =
              turn.responseMessage?.answer ||
              turn.answer ||
              answer ||
              'Here is what I found:';

            return {
              success: true,
              message: 'Success',
              isStreamed: false,
              data: {
                conversationId: resolvedId,
                responseMessage: {
                  answer: resAnswer.trim(),
                  reference: references,
                  followUps: turn.responseMessage?.followUps || turn.followUps || [],
                },
              },
            };
          }

          const turnRecord = turn as Record<string, unknown>;
          const turnAnswer = (turnRecord?.answer || turnRecord?.summary || turnRecord?.response || turnRecord?.content || '') as string;
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
      } catch (err: unknown) {
        console.warn('[RESEARCH FALLBACK] Research threw error, falling back to AI chat:', err instanceof Error ? err.message : String(err));
      }
    }

    return null;
  };

  return { handleSearchOrResearch };
}
