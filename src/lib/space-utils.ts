import { createSpaceAction, getSpacesAction } from '@/actions/spaceActions';
import { useBotsStore } from '@/stores/useBotsStore';

/**
 * Resolves a valid space ID for running searches and research.
 * If activeBotId is set, uses it.
 * If bots exist in the Zustand store, uses the first persistent bot.
 * Otherwise fetches user spaces from the backend.
 * If the user has no spaces, creates a default "General" space.
 */
export async function getOrEnsureSpaceId(tokenOverride?: string): Promise<string> {
  const store = useBotsStore.getState();

  if (store.activeBotId) {
    return store.activeBotId;
  }

  const validBot = store.bots.find(b => b.id && !b.id.startsWith('bot_'));
  if (validBot?.id) {
    return validBot.id;
  }

  try {
    const spacesRes = await getSpacesAction(tokenOverride);
    if (
      spacesRes.success &&
      Array.isArray(spacesRes.data) &&
      spacesRes.data.length > 0
    ) {
      const first = spacesRes.data[0];
      const id = first.id || first._id;
      if (id) {
        store.fetchBots();
        return id;
      }
    }

    const createRes = await createSpaceAction({
      name: 'General',
      description: 'Default general workspace',
      isPrivate: false,
    }, tokenOverride);

    if (createRes.success && createRes.data) {
      const id = createRes.data.id || createRes.data._id;
      if (id) {
        store.fetchBots();
        return id;
      }
    }
  } catch (error) {
    console.error('getOrEnsureSpaceId error:', error);
  }

  return 'general';
}
