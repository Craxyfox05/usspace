import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RelationshipStreaksProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showDetails?: boolean;
}

// Relationship streak levels with corresponding emojis, descriptions, and nicknames
const streakLevels = [
  { 
    name: "New Friends", 
    emoji: "👋", 
    nickname: "Friend",
    description: "You're just getting to know each other!",
    minDays: 0,
    maxDays: 7
  },
  { 
    name: "Buddies", 
    emoji: "🤝", 
    nickname: "Buddy",
    description: "Getting closer each day",
    minDays: 8,
    maxDays: 14
  },
  { 
    name: "Good Friends", 
    emoji: "🌟", 
    nickname: "Bestie",
    description: "Your connection is growing stronger",
    minDays: 15,
    maxDays: 30
  },
  { 
    name: "BFFs", 
    emoji: "✨", 
    nickname: "BFF",
    description: "Best friends forever!",
    minDays: 31,
    maxDays: 60
  },
  { 
    name: "Soul Connection", 
    emoji: "💯", 
    nickname: "Sweetie",
    description: "Your bond is truly special",
    minDays: 61,
    maxDays: 90
  },
  { 
    name: "Fire Streak", 
    emoji: "🔥", 
    nickname: "Honey",
    description: "Your streak is on fire!",
    minDays: 91,
    maxDays: 120
  },
  { 
    name: "Perfect Match", 
    emoji: "⚡", 
    nickname: "Babe",
    description: "You're a perfect match!",
    minDays: 121,
    maxDays: 180
  },
  { 
    name: "Love Birds", 
    emoji: "💘", 
    nickname: "Darling",
    description: "True love birds!",
    minDays: 181,
    maxDays: 365
  },
  { 
    name: "Soulmates", 
    emoji: "💖", 
    nickname: "Soulmate",
    description: "You've found your soulmate",
    minDays: 366,
    maxDays: Infinity
  }
];

// Interaction icons to show beside the streak
const interactionIcons = [
  {
    name: "Daily Chats",
    emoji: "💬",
    description: "You chat every day"
  },
  {
    name: "Game Partners",
    emoji: "🎮",
    description: "You love playing games together"
  },
  {
    name: "Memory Makers",
    emoji: "📸",
    description: "Creating beautiful memories together"
  },
  {
    name: "Heart Connection",
    emoji: "❤️",
    description: "Deep emotional connection"
  }
];

export default function RelationshipStreaks({ size = "md", showLabel = false, showDetails = false }: RelationshipStreaksProps) {
  const { user, partner, events, messages } = useStore();
  const [streakDays, setStreakDays] = useState<number>(0);
  const [streakLevel, setStreakLevel] = useState(streakLevels[0]);
  const [interactions, setInteractions] = useState<typeof interactionIcons[0] | null>(null);
  
  // Calculate streak days and determine level
  useEffect(() => {
    // Find the earliest relationship event (first date or anniversary)
    const firstEvent = events?.filter(e => 
      e.type === 'first-date' || e.type === 'anniversary'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (firstEvent) {
      const startDate = new Date(firstEvent.date);
      const today = new Date();
      const timeDiff = today.getTime() - startDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      setStreakDays(daysDiff);
      
      // Find current streak level
      const currentLevel = streakLevels.find(
        level => daysDiff >= level.minDays && daysDiff <= level.maxDays
      ) || streakLevels[streakLevels.length - 1];
      
      setStreakLevel(currentLevel);
    }
    
    // Select a random interaction icon
    const randomInteraction = interactionIcons[Math.floor(Math.random() * interactionIcons.length)];
    setInteractions(randomInteraction);
    
  }, [events, messages]);
  
  // Determine emoji size based on prop
  const getEmojiSize = () => {
    switch (size) {
      case "sm": return "text-lg";
      case "md": return "text-2xl";
      case "lg": return "text-3xl";
      default: return "text-2xl";
    }
  };
  
  // Format streak days into readable text
  const formatStreakDays = () => {
    if (streakDays === 1) {
      return "1 day";
    } else if (streakDays < 30) {
      return `${streakDays} days`;
    } else if (streakDays < 365) {
      const months = Math.floor(streakDays / 30);
      const days = streakDays % 30;
      if (days === 0) {
        return `${months} ${months === 1 ? 'month' : 'months'}`;
      }
      return `${months} ${months === 1 ? 'month' : 'months'}, ${days} days`;
    } else {
      const years = Math.floor(streakDays / 365);
      const months = Math.floor((streakDays % 365) / 30);
      
      if (months === 0) {
        return `${years} ${years === 1 ? 'year' : 'years'}`;
      } else {
        return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
      }
    }
  };
  
  if (!partner) return null;
  
  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {/* Streak level emoji */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`${getEmojiSize()} cursor-help`} aria-label={streakLevel.name}>
                {streakLevel.emoji}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="font-medium">{streakLevel.name}</div>
                <div className="text-xs text-gray-500">{streakLevel.description}</div>
                <div className="text-xs font-medium">Streak: {formatStreakDays()}</div>
                <div className="text-xs italic text-red-500">Call them: "{streakLevel.nickname}"</div>
              </div>
            </TooltipContent>
          </Tooltip>
          
          {/* Interaction icon if available */}
          {interactions && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${getEmojiSize()} cursor-help`} aria-label={interactions.name}>
                  {interactions.emoji}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div className="font-medium">{interactions.name}</div>
                  <div className="text-xs text-gray-500">{interactions.description}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Label */}
          {showLabel && (
            <div className="text-lg font-medium text-gray-800">
              {streakLevel.name}
            </div>
          )}
        </div>
        
        {/* Display additional details outside of tooltip when showDetails is true */}
        {showLabel && (
          <div className="mt-3 space-y-1">
            <div className="text-sm text-gray-600">{streakLevel.description}</div>
            <div className="text-sm font-medium">Streak: {streakDays} days</div>
            <div className="text-sm italic text-rose-600">Call them: "{streakLevel.nickname}"</div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 