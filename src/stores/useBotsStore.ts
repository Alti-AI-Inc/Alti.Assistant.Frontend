import {
  createSpaceAction,
  deleteSpaceAction,
  getSpacesAction,
  updateSpaceAction,
} from '@/actions/spaceActions';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  avatar: string; // Emoji
  createdAt: string;
  data?: string | null;
  guardrails?: string;
  isShared?: boolean;
  metadata?: {
    status?: 'tuning' | 'ready' | 'failed';
    jobId?: string;
    tuningError?: string;
    tuningDatasetUri?: string;
  };
}

export interface BotThread {
  id: string; // conversationId
  botId: string;
  title: string;
  createdAt: string;
}

interface BotsState {
  bots: Chatbot[];
  threads: BotThread[];
  activeBotId: string | null;
  activeBotThreadId: string | null;
  projectTab: 'my' | 'team';

  // Actions
  addBot: (bot: Omit<Chatbot, 'id' | 'createdAt'>, token?: string) => Chatbot;
  addBotAsync: (
    bot: Omit<Chatbot, 'id' | 'createdAt'>,
    token?: string,
  ) => Promise<Chatbot>;
  editBot: (
    id: string,
    updated: Partial<Omit<Chatbot, 'id' | 'createdAt'>>,
    token?: string,
  ) => void;
  deleteBot: (id: string, token?: string) => void;
  setActiveBotId: (id: string | null) => void;

  addThread: (botId: string, threadId: string, title: string) => void;
  deleteThread: (threadId: string) => void;
  setActiveBotThreadId: (threadId: string | null) => void;
  setProjectTab: (tab: 'my' | 'team') => void;

  // Async initialization
  fetchBots: (token?: string) => Promise<void>;

  // Rearrange bots
  reorderBots: (startIndex: number, endIndex: number) => void;
}

export const useBotsStore = create<BotsState>()(
  persist(
    (set, get) => ({
      bots: [],
      threads: [],
      activeBotId: null,
      activeBotThreadId: null,
      projectTab: 'my',

      addBot: (newBotData, _token) => {
        const id = `bot_${Date.now()}`;
        const newBot: Chatbot = {
          ...newBotData,
          id,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          bots: [newBot, ...state.bots],
          activeBotId: id,
        }));

        // Sync with backend asynchronously
        createSpaceAction({
          name: newBot.name,
          description: newBot.description,
          isPrivate: !newBot.isShared,
        })
          .then(result => {
            if (result.success && result.data) {
              const backendBot = result.data;
              const botId = backendBot.id || backendBot._id || id;
              set(state => ({
                bots: state.bots.map(b =>
                  b.id === id ? { ...b, ...backendBot, id: botId } : b,
                ),
                activeBotId:
                  state.activeBotId === id ? botId : state.activeBotId,
              }));
            } else {
              console.error(
                `Failed to create space on backend: ${result.message}`,
              );
              toast.error(
                result.message || 'Space was not saved to the server',
              );
            }
          })
          .catch(err => console.error('Failed to sync addBot to backend', err));

        return newBot;
      },

      addBotAsync: async (newBotData, _token) => {
        const tempId = `bot_${Date.now()}`;
        const tempBot: Chatbot = {
          ...newBotData,
          id: tempId,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          bots: [tempBot, ...state.bots],
          activeBotId: tempId,
        }));

        try {
          const result = await createSpaceAction({
            name: tempBot.name,
            description: tempBot.description,
            isPrivate: !tempBot.isShared,
          });
          if (result.success && result.data) {
            const backendBot = result.data;
            const botId = backendBot.id || backendBot._id || tempId;
            const mappedBot: Chatbot = {
              ...tempBot,
              ...backendBot,
              id: botId,
            };
            set(state => ({
              bots: state.bots.map(b => (b.id === tempId ? mappedBot : b)),
              activeBotId:
                state.activeBotId === tempId ? botId : state.activeBotId,
            }));
            return mappedBot;
          } else {
            console.error(
              `Failed to create space on backend: ${result.message}`,
            );
            toast.error(result.message || 'Space was not saved to the server');
          }
        } catch (err) {
          console.error('Failed to sync addBotAsync to backend', err);
          toast.error('Space was not saved to the server');
        }

        return tempBot;
      },

      editBot: (id, updatedData, _token) => {
        set(state => ({
          bots: state.bots.map(bot =>
            bot.id === id ? { ...bot, ...updatedData } : bot,
          ),
        }));
        // Sync with backend asynchronously only if it is a database chatbot
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isMongoId) {
          updateSpaceAction(id, {
            name: updatedData.name,
            description: updatedData.description,
            isPrivate:
              updatedData.isShared !== undefined
                ? !updatedData.isShared
                : undefined,
          }).then(result => {
            if (!result.success) {
              console.error(
                `Failed to update space on backend: ${result.message}`,
              );
              toast.error(
                result.message || 'Space changes were not saved to the server',
              );
            }
          });
        }
      },

      deleteBot: (id, _token) => {
        set(state => ({
          bots: state.bots.filter(bot => bot.id !== id),
          // Clear active bot if it was deleted
          activeBotId: state.activeBotId === id ? null : state.activeBotId,
          activeBotThreadId:
            state.activeBotId === id ? null : state.activeBotThreadId,
          // Clean up threads associated with the deleted bot
          threads: state.threads.filter(t => t.botId !== id),
        }));
        // Sync with backend only if it is a database chatbot
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isMongoId) {
          deleteSpaceAction(id).then(result => {
            if (!result.success) {
              console.error(
                `Failed to delete space on backend: ${result.message}`,
              );
              toast.error(
                result.message || 'Space was not deleted from the server',
              );
            }
          });
        }
      },

      setActiveBotId: id => {
        set({
          activeBotId: id,
          activeBotThreadId: null, // Reset thread when changing bot
        });
      },

      addThread: (botId, threadId, title) => {
        const newThread: BotThread = {
          id: threadId,
          botId,
          title,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          threads: [...state.threads, newThread],
          activeBotThreadId: threadId,
        }));
      },

      deleteThread: threadId => {
        set(state => ({
          threads: state.threads.filter(t => t.id !== threadId),
          activeBotThreadId:
            state.activeBotThreadId === threadId
              ? null
              : state.activeBotThreadId,
        }));
      },

      setActiveBotThreadId: threadId => set({ activeBotThreadId: threadId }),

      setProjectTab: tab => set({ projectTab: tab }),

      reorderBots: (startIndex, endIndex) => {
        set(state => {
          const result = Array.from(state.bots);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { bots: result };
        });
      },

      fetchBots: async _token => {
        try {
          const result = await getSpacesAction();
          if (result.success && Array.isArray(result.data)) {
            const mapped: Chatbot[] = result.data.map(space => ({
              id: space.id || space._id || '',
              name: space.name,
              description: space.description || '',
              instructions: '',
              model: '',
              avatar: '🗂️',
              createdAt: space.createdAt || new Date().toISOString(),
              isShared: !space.isPrivate,
            }));
            // Newest space first
            mapped.sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime(),
            );
            set({ bots: mapped });
          } else {
            console.error(
              `Failed to fetch spaces from backend: ${result.message}`,
            );
          }
        } catch (error) {
          console.error('Failed to fetch bots from backend', error);
        }
      },
    }),
    {
      name: 'insosearch-custom-bots',
      // bots is intentionally excluded: it must always come fresh from GET /spaces,
      // not from stale localStorage, otherwise hydration can clobber fetched data
      partialize: state => ({
        threads: state.threads,
        activeBotId: state.activeBotId,
        activeBotThreadId: state.activeBotThreadId,
      }),
    },
  ),
);
