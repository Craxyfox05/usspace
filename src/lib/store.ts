import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mood = 'happy' | 'neutral' | 'sad' | 'excited' | 'tired' | 'loved' | null;

export type MediaType = 'image' | 'video';

export type Memory = {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption: string;
  date: Date;
  location?: string;
  tags: string[];
}

export type Event = {
  id: string;
  title: string;
  date: Date;
  type: 'anniversary' | 'birthday' | 'custom' | 'first-date' | 'first-text';
  description?: string;
  reminderEnabled?: boolean;
  reminderDays?: number; // Days before to remind
  reminder?: boolean; // Add this for UI compatibility
}

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarId?: string; // ID of selected SVG avatar
  mood?: Mood;
  moodNote?: string;
  moodLastUpdated?: Date;
  theme?: string;
  // Profile information for gift suggestions
  gender?: string;
  birthdate?: Date;
  hobbies?: string[];
  foodPreferences?: string[];
  favoriteColors?: string[];
  interests?: string[];
  clothingSize?: string;
  shoeSize?: string;
  favoriteStores?: string[];
  wishlist?: string[];
  // Indian cultural preferences
  indianCuisines?: string[];
  favoriteFestivals?: string[];
  traditionalClothing?: string[];
  homeState?: string;
  motherTongue?: string;
  musicPreference?: string[];
  profileCompleted?: boolean;
}

type Partner = {
  id: string | null;
  name: string | null;
  avatar?: string;
  avatarId?: string; // ID of selected SVG avatar
  mood?: Mood;
  moodNote?: string;
  moodLastUpdated?: Date;
  // Profile information for gift suggestions
  gender?: string;
  birthdate?: Date;
  hobbies?: string[];
  foodPreferences?: string[];
  favoriteColors?: string[];
  interests?: string[];
  clothingSize?: string;
  shoeSize?: string;
  favoriteStores?: string[];
  wishlist?: string[];
  // Indian cultural preferences
  indianCuisines?: string[];
  favoriteFestivals?: string[];
  traditionalClothing?: string[];
  homeState?: string;
  motherTongue?: string;
  musicPreference?: string[];
  profileCompleted?: boolean;
}

type JournalEntry = {
  id: string;
  author: 'user' | 'partner';
  content: string;
  date: Date;
  isPublic: boolean;
  attachments?: string[];
  reactions?: { [key: string]: boolean }; // e.g. { 'heart': true }
}

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'partner';
  timestamp: Date;
  isScheduled?: boolean;
  scheduledTime?: Date;
  isVoiceNote?: boolean;
  attachments?: string[];
}

type Milestone = {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'days' | 'months' | 'years' | 'custom';
  value: number; // e.g., 100 days, 1 year
  isReached: boolean;
  memories?: string[]; // IDs of related memories
}

type Quiz = {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    userAnswer?: string;
    partnerAnswer?: string;
  }[];
  completed: boolean;
  date: Date;
}

type AppTheme = {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  doodleStyle: 'classic' | 'minimal' | 'playful';
  backgroundMusic?: string;
}

export type PageTheme = {
  route: string;
  themeName: string;
  primaryColor: string; // hex color or CSS color value
  secondaryColor?: string; // optional secondary/gradient color
  isGradient?: boolean;
}

type UsSpaceStore = {
  user: User | null;
  partner: Partner | null;
  memories: Memory[];
  events: Event[];
  journals: JournalEntry[];
  messages: Message[];
  milestones: Milestone[];
  quizzes: Quiz[];
  themes: AppTheme[];
  pageThemes: PageTheme[];
  currentTheme: string;
  isAuthenticated: boolean;
  gameScores: {
    user: number;
    partner: number;
    history: {
      gameType: string;
      winner: 'user' | 'partner' | 'tie';
      date: Date;
      score?: { user: number; partner: number };
    }[];
  };

  // Auth actions
  setUser: (user: User | null) => void;
  setPartner: (partner: Partner | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  updatePartnerProfile: (profileData: Partial<Partner>) => void;

  // Mood actions
  updateUserMood: (mood: Mood, note?: string) => void;

  // Memory actions
  addMemory: (memory: Omit<Memory, 'id'>) => void;
  updateMemory: (id: string, memory: Partial<Omit<Memory, 'id'>>) => void;
  deleteMemory: (id: string) => void;

  // Event actions
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Omit<Event, 'id'>>) => void;
  deleteEvent: (id: string) => void;

  // Journal actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, entry: Partial<Omit<JournalEntry, 'id'>>) => void;
  deleteJournalEntry: (id: string) => void;

  // Message actions
  addMessage: (message: Omit<Message, 'id'>) => void;
  scheduleMessage: (message: Omit<Message, 'id' | 'isScheduled'>) => void;
  deleteMessage: (id: string) => void;

  // Milestone actions
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, milestone: Partial<Omit<Milestone, 'id'>>) => void;
  deleteMilestone: (id: string) => void;
  checkMilestones: () => void;

  // Quiz actions
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateQuiz: (id: string, quiz: Partial<Omit<Quiz, 'id'>>) => void;
  deleteQuiz: (id: string) => void;

  // Theme actions
  addTheme: (theme: Omit<AppTheme, 'id'>) => void;
  setCurrentTheme: (themeId: string) => void;
  
  // Page theme actions
  addPageTheme: (pageTheme: PageTheme) => void;
  updatePageTheme: (route: string, pageTheme: Partial<PageTheme>) => void;
  deletePageTheme: (route: string) => void;
  getPageTheme: (route: string) => PageTheme | null;

  // Game actions
  addGameResult: (gameType: string, winner: 'user' | 'partner' | 'tie', score?: { user: number; partner: number }) => void;
  resetGameScores: () => void;
}

// Default themes
const defaultThemes: AppTheme[] = [
  {
    id: 'classic',
    name: 'Classic Love',
    primaryColor: '#e11d48', // Red-500
    secondaryColor: '#f9a8d4', // Pink-300
    doodleStyle: 'classic',
  },
  {
    id: 'minimal',
    name: 'Minimal White',
    primaryColor: '#6b7280', // Gray-500
    secondaryColor: '#e5e7eb', // Gray-200
    doodleStyle: 'minimal',
  },
  {
    id: 'space-love',
    name: 'Space Love',
    primaryColor: '#6d28d9', // Purple-700
    secondaryColor: '#c4b5fd', // Purple-300
    doodleStyle: 'playful',
  },
  {
    id: 'notebook',
    name: 'Notebook Vibes',
    primaryColor: '#1d4ed8', // Blue-700
    secondaryColor: '#bfdbfe', // Blue-200
    doodleStyle: 'classic',
  },
];

// Default page themes
const defaultPageThemes: PageTheme[] = [
  {
    route: '/couples',
    themeName: 'Rose',
    primaryColor: '#e11d48',
    secondaryColor: '#fb7185',
    isGradient: true
  },
  {
    route: '/memories',
    themeName: 'Amber',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    isGradient: true
  },
  {
    route: '/events',
    themeName: 'Rose',
    primaryColor: '#e11d48',
    secondaryColor: '#fb7185',
    isGradient: true
  },
  {
    route: '/listen-together',
    themeName: 'Rose Amber',
    primaryColor: '#be123c',
    secondaryColor: '#f59e0b',
    isGradient: true
  },
  {
    route: '/chat',
    themeName: 'Light Blue',
    primaryColor: '#3b82f6',
    secondaryColor: '#93c5fd',
    isGradient: true
  },
  {
    route: '/games',
    themeName: 'Light Pink',
    primaryColor: '#ec4899',
    secondaryColor: '#f9a8d4',
    isGradient: true
  },
  {
    route: '/settings',
    themeName: 'Rose',
    primaryColor: '#e11d48',
    secondaryColor: '#fb7185',
    isGradient: true
  }
];

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper function to check and create milestones
const checkAndCreateMilestones = (state: {
  events: Event[];
  milestones: Milestone[];
}) => {
  const today = new Date();
  const milestones: Milestone[] = [...state.milestones];

  // Check for day-based milestones (30, 100, 365 days)
  if (state.events.length > 0) {
    // Find earliest date (first date or anniversary)
    const firstEvent = state.events
      .filter(e => e.type === 'first-date' || e.type === 'anniversary')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    if (firstEvent) {
      const startDate = new Date(firstEvent.date);
      const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const milestoneValues = [30, 100, 365, 500, 1000];

      for (const days of milestoneValues) {
        // Check if we've reached this milestone and it's not already created
        if (daysTogether >= days && !milestones.some(m => m.type === 'days' && m.value === days)) {
          milestones.push({
            id: generateId(),
            title: `${days} Days Together!`,
            description: `You've been together for ${days} wonderful days.`,
            date: new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000),
            type: 'days',
            value: days,
            isReached: true
          });
        }
      }
    }
  }

  return milestones;
};

export const useStore = create<UsSpaceStore>()(
  persist(
    (set, get) => ({
      user: null,
      partner: null,
      memories: [],
      events: [],
      journals: [],
      messages: [],
      milestones: [],
      quizzes: [],
      themes: defaultThemes,
      pageThemes: defaultPageThemes,
      currentTheme: defaultThemes[0].id,
      isAuthenticated: false,
      gameScores: {
        user: 0,
        partner: 0,
        history: []
      },

      // Auth actions
      setUser: (user) => set({ user }),
      setPartner: (partner) => set({ partner }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      logout: () => set({ user: null, partner: null, isAuthenticated: false }),
      updateUserProfile: (profileData) => set((state) => ({
        user: state.user ? { ...state.user, ...profileData } : null
      })),
      updatePartnerProfile: (profileData) => set((state) => ({
        partner: state.partner ? { ...state.partner, ...profileData } : null
      })),

      // Mood actions
      updateUserMood: (mood, note) => set((state) => ({
        user: state.user
          ? {
              ...state.user,
              mood,
              moodNote: note,
              moodLastUpdated: new Date()
            }
          : null
      })),

      // Memory actions
      addMemory: (memory) => set((state) => ({
        memories: [...state.memories, { ...memory, id: generateId(), mediaType: memory.mediaType || 'image' }]
      })),
      updateMemory: (id, memory) => set((state) => ({
        memories: state.memories.map(m =>
          m.id === id ? { ...m, ...memory } : m
        )
      })),
      deleteMemory: (id) => set((state) => ({
        memories: state.memories.filter(memory => memory.id !== id)
      })),

      // Event actions
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: generateId() }]
      })),
      updateEvent: (id, event) => set((state) => ({
        events: state.events.map(e =>
          e.id === id ? { ...e, ...event } : e
        )
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(event => event.id !== id)
      })),

      // Journal actions
      addJournalEntry: (entry) => set((state) => ({
        journals: [...state.journals, { ...entry, id: generateId() }]
      })),
      updateJournalEntry: (id, entry) => set((state) => ({
        journals: state.journals.map(j =>
          j.id === id ? { ...j, ...entry } : j
        )
      })),
      deleteJournalEntry: (id) => set((state) => ({
        journals: state.journals.filter(journal => journal.id !== id)
      })),

      // Message actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, { ...message, id: generateId() }]
      })),
      scheduleMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: generateId(),
          isScheduled: true,
          scheduledTime: message.scheduledTime || new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to 24 hours later
        }]
      })),
      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter(message => message.id !== id)
      })),

      // Milestone actions
      addMilestone: (milestone) => set((state) => ({
        milestones: [...state.milestones, { ...milestone, id: generateId() }]
      })),
      updateMilestone: (id, milestone) => set((state) => ({
        milestones: state.milestones.map(m =>
          m.id === id ? { ...m, ...milestone } : m
        )
      })),
      deleteMilestone: (id) => set((state) => ({
        milestones: state.milestones.filter(milestone => milestone.id !== id)
      })),
      checkMilestones: () => set((state) => ({
        milestones: checkAndCreateMilestones(state)
      })),

      // Quiz actions
      addQuiz: (quiz) => set((state) => ({
        quizzes: [...state.quizzes, { ...quiz, id: generateId() }]
      })),
      updateQuiz: (id, quiz) => set((state) => ({
        quizzes: state.quizzes.map(q =>
          q.id === id ? { ...q, ...quiz } : q
        )
      })),
      deleteQuiz: (id) => set((state) => ({
        quizzes: state.quizzes.filter(quiz => quiz.id !== id)
      })),

      // Theme actions
      addTheme: (theme) => {
        const id = theme.name.toLowerCase().replace(/\s+/g, '-');
        set((state) => ({
          themes: [...state.themes, { ...theme, id }],
          currentTheme: id
        }));
      },
      setCurrentTheme: (themeId) => set({ currentTheme: themeId }),
      
      // Page theme actions
      addPageTheme: (pageTheme) => {
        set((state) => {
          // First check if a theme for this route already exists
          const existingThemeIndex = state.pageThemes.findIndex(
            theme => theme.route === pageTheme.route
          );
          
          if (existingThemeIndex >= 0) {
            // Update existing theme
            const updatedThemes = [...state.pageThemes];
            updatedThemes[existingThemeIndex] = pageTheme;
            return { pageThemes: updatedThemes };
          } else {
            // Add new theme
            return { pageThemes: [...state.pageThemes, pageTheme] };
          }
        });
      },
      
      updatePageTheme: (route, updates) => {
        set((state) => {
          const existingThemeIndex = state.pageThemes.findIndex(
            theme => theme.route === route
          );
          
          if (existingThemeIndex >= 0) {
            const updatedThemes = [...state.pageThemes];
            updatedThemes[existingThemeIndex] = {
              ...updatedThemes[existingThemeIndex],
              ...updates
            };
            return { pageThemes: updatedThemes };
          }
          
          return state;
        });
      },
      
      deletePageTheme: (route) => {
        set((state) => ({
          pageThemes: state.pageThemes.filter(theme => theme.route !== route)
        }));
      },
      
      getPageTheme: (route) => {
        return get().pageThemes.find(theme => theme.route === route) || null;
      },

      // Game actions
      addGameResult: (gameType, winner, score) => set(state => {
        const newHistory = [...state.gameScores.history, {
          gameType,
          winner,
          date: new Date(),
          score
        }];
        
        let userScore = state.gameScores.user;
        let partnerScore = state.gameScores.partner;
        
        if (winner === 'user') userScore += 1;
        if (winner === 'partner') partnerScore += 1;
        
        return {
          gameScores: {
            user: userScore,
            partner: partnerScore,
            history: newHistory
          }
        };
      }),
      resetGameScores: () => set({
        gameScores: {
          user: 0,
          partner: 0,
          history: []
        }
      }),
    }),
    {
      name: 'usspace-storage',
    }
  )
);
