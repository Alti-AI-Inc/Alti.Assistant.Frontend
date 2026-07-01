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
  addBotAsync: (bot: Omit<Chatbot, 'id' | 'createdAt'>, token?: string) => Promise<Chatbot>;
  editBot: (id: string, updated: Partial<Omit<Chatbot, 'id' | 'createdAt'>>, token?: string) => void;
  deleteBot: (id: string, token?: string) => void;
  setActiveBotId: (id: string | null) => void;
  
  addThread: (botId: string, threadId: string, title: string) => void;
  deleteThread: (threadId: string) => void;
  setActiveBotThreadId: (threadId: string | null) => void;
  setProjectTab: (tab: 'my' | 'team') => void;
  
  // Async initialization
  fetchBots: (token?: string) => Promise<void>;
}

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://www.insoai.com/api/v1';

const PRELOADED_BOTS: Chatbot[] = [
  {
    id: 'python-expert',
    name: 'Python Expert',
    description: 'Specialist in clean code, refactoring, docstrings, and algorithm optimization.',
    instructions: 'You are an expert Python developer and architect. You write highly pythonic, clean, efficient, and readable code adhering strictly to PEP 8 standards. Always include thorough docstrings, explain design decisions, and suggest performance optimizations where applicable.',
    model: 'Gemini 1.5 Pro',
    avatar: '🐍',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ui-design-guru',
    name: 'UI Design Guru',
    description: 'Expert in modern UI/UX design, tailwind, vanilla CSS styling, and premium color palettes.',
    instructions: 'You are a master UI/UX designer and frontend architect. You specialize in creating stunning, responsive, and visually wowing web interfaces using Tailwind CSS, vanilla CSS, and modern design principles like glassmorphism, smooth animations, and tailored HSL color palettes. Always prioritize design aesthetics and visual excellence.',
    model: 'Gemini 1.5 Pro',
    avatar: '🎨',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'copywriter',
    name: 'AI Copywriter',
    description: 'Creative assistant for drafting emails, blog posts, sales copies, and high-impact headlines.',
    instructions: 'You are a professional copywriter and conversion rates marketing expert. You write high-converting, engaging, and compelling copy for newsletters, social media posts, headlines, articles, and marketing emails. Adapt your tone perfectly to the target audience.',
    model: 'Gemini 1.5 Flash',
    avatar: '✍️',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'Standard conversational assistant for everyday inquiries and brainstorming.',
    instructions: 'You are Alti Assistant, a highly helpful, intelligent, and friendly general-purpose AI chatbot. You assist with general tasks, brainstorming, writing, analysis, and problem-solving.',
    model: 'Gemini 1.5 Flash',
    avatar: '🤖',
    createdAt: new Date().toISOString(),
  },
];

export const useBotsStore = create<BotsState>()(
  persist(
    (set, get) => ({
      bots: PRELOADED_BOTS,
      threads: [],
      activeBotId: null,
      activeBotThreadId: null,
      projectTab: 'my',

      addBot: (newBotData, token) => {
        const id = `bot_${Date.now()}`;
        const newBot: Chatbot = {
          ...newBotData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          bots: [...state.bots, newBot],
          activeBotId: id,
        }));
        
        // Sync with backend asynchronously
        fetch(`${getApiUrl()}/chatbots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(newBot),
        })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data?.data) {
              const backendBot = data.data;
              const botId = backendBot.id || backendBot._id || id;
              set((state) => ({
                bots: state.bots.map((b) => b.id === id ? { ...backendBot, id: botId } : b),
                activeBotId: state.activeBotId === id ? botId : state.activeBotId,
              }));
            }
          }
        })
        .catch((err) => console.error('Failed to sync addBot to backend', err));
        
        return newBot;
      },

      addBotAsync: async (newBotData, token) => {
        const tempId = `bot_${Date.now()}`;
        const tempBot: Chatbot = {
          ...newBotData,
          id: tempId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          bots: [...state.bots, tempBot],
          activeBotId: tempId,
        }));
        
        try {
          const res = await fetch(`${getApiUrl()}/chatbots`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(tempBot),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.data) {
              const backendBot = data.data;
              const botId = backendBot.id || backendBot._id || tempId;
              const mappedBot: Chatbot = {
                ...backendBot,
                id: botId,
              };
              set((state) => ({
                bots: state.bots.map((b) => b.id === tempId ? mappedBot : b),
                activeBotId: state.activeBotId === tempId ? botId : state.activeBotId,
              }));
              return mappedBot;
            }
          }
        } catch (err) {
          console.error('Failed to sync addBotAsync to backend', err);
        }
        
        return tempBot;
      },

      editBot: (id, updatedData, token) => {
        set((state) => ({
          bots: state.bots.map((bot) =>
            bot.id === id ? { ...bot, ...updatedData } : bot
          ),
        }));
        // Sync with backend asynchronously only if it is a database chatbot
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isMongoId) {
          fetch(`${getApiUrl()}/chatbots/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(updatedData),
          }).catch((err) => console.error('Failed to sync editBot to backend', err));
        }
      },

      deleteBot: (id, token) => {
        set((state) => ({
          bots: state.bots.filter((bot) => bot.id !== id),
          // Clear active bot if it was deleted
          activeBotId: state.activeBotId === id ? null : state.activeBotId,
          activeBotThreadId:
            state.activeBotId === id ? null : state.activeBotThreadId,
          // Clean up threads associated with the deleted bot
          threads: state.threads.filter((t) => t.botId !== id),
        }));
        // Sync with backend only if it is a database chatbot
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isMongoId) {
          fetch(`${getApiUrl()}/chatbots/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          }).catch((err) => console.error('Failed to sync deleteBot to backend', err));
        }
      },

      setActiveBotId: (id) => {
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
        set((state) => ({
          threads: [...state.threads, newThread],
          activeBotThreadId: threadId,
        }));
      },

      deleteThread: (threadId) => {
        set((state) => ({
          threads: state.threads.filter((t) => t.id !== threadId),
          activeBotThreadId:
            state.activeBotThreadId === threadId
              ? null
              : state.activeBotThreadId,
        }));
      },

      setActiveBotThreadId: (threadId) => set({ activeBotThreadId: threadId }),

      setProjectTab: (tab) => set({ projectTab: tab }),

      fetchBots: async (token) => {
        try {
          const res = await fetch(`${getApiUrl()}/chatbots`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
              const mapped = data.data.map((bot: any) => ({
                ...bot,
                id: bot.id || bot._id,
              }));
              const merged = [...PRELOADED_BOTS];
              mapped.forEach((b: Chatbot) => {
                if (!merged.some((p) => p.id === b.id)) {
                  merged.push(b);
                }
              });
              set({ bots: merged });
            }
          }
        } catch (error) {
          console.error('Failed to fetch bots from backend', error);
        }
      },
    }),
    {
      name: 'alti-custom-bots',
      partialize: (state) => ({
        bots: state.bots,
        threads: state.threads,
        activeBotId: state.activeBotId,
        activeBotThreadId: state.activeBotThreadId,
      }),
    }
  )
);
