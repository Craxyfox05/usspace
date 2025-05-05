import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RelationshipStatusProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

// Relationship stages with corresponding emojis and descriptions
const relationshipStages = [
  { 
    name: "Just Started", 
    emoji: "💫", 
    description: "Your relationship is just beginning!",
    minDays: 0,
    maxDays: 30
  },
  { 
    name: "Getting to Know You", 
    emoji: "🌱", 
    description: "Growing together each day",
    minDays: 31,
    maxDays: 90
  },
  { 
    name: "Sweet Connection", 
    emoji: "🍯", 
    description: "Your connection is getting deeper",
    minDays: 91,
    maxDays: 180
  },
  { 
    name: "Deeply Connected", 
    emoji: "❤️", 
    description: "Your bond is growing stronger",
    minDays: 181,
    maxDays: 365
  },
  { 
    name: "Love Birds", 
    emoji: "💑", 
    description: "You're inseparable!",
    minDays: 366,
    maxDays: 730
  },
  { 
    name: "Soulmates", 
    emoji: "⚡", 
    description: "A connection like no other",
    minDays: 731,
    maxDays: 1095
  },
  { 
    name: "Eternal Love", 
    emoji: "💖", 
    description: "Your love is timeless",
    minDays: 1096,
    maxDays: Infinity
  }
];

// Interaction-based status emojis (like Snapchat)
const interactionStatuses = [
  {
    name: "Daily Chat",
    emoji: "💬",
    description: "You chat every day",
    condition: (messageStreak: number) => messageStreak >= 7
  },
  {
    name: "BFFs",
    emoji: "👯",
    description: "Best friends for life!",
    condition: (messageStreak: number, gameCount: number) => messageStreak >= 14 && gameCount >= 5
  },
  {
    name: "Perfect Match",
    emoji: "🔥",
    description: "Your streak is on fire!",
    condition: (messageStreak: number, gameCount: number, matchScore: number) => messageStreak >= 30 && matchScore > 80
  }
];

export default function RelationshipStatus({ size = "md", showLabel = false }: RelationshipStatusProps) {
  const { user, partner, events } = useStore();
  const [daysTogether, setDaysTogether] = useState<number>(0);
  const [stage, setStage] = useState(relationshipStages[0]);
  const [interactionStatus, setInteractionStatus] = useState<typeof interactionStatuses[0] | null>(null);
  
  // Calculate relationship duration and determine stage
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
      
      setDaysTogether(daysDiff);
      
      // Find current relationship stage
      const currentStage = relationshipStages.find(
        stage => daysDiff >= stage.minDays && daysDiff <= stage.maxDays
      ) || relationshipStages[relationshipStages.length - 1];
      
      setStage(currentStage);
    }
    
    // Simulate interaction stats
    // In a real app, this would be based on actual messaging and game activity
    const simulateInteractionStatus = () => {
      const messageStreak = Math.floor(Math.random() * 60); // Random streak 0-60 days
      const gameCount = Math.floor(Math.random() * 20); // Random 0-20 games played
      const matchScore = Math.floor(Math.random() * 100); // Random 0-100 match score
      
      // Find the highest level interaction status that applies
      const status = interactionStatuses
        .filter(status => status.condition(messageStreak, gameCount, matchScore))
        .pop();
      
      setInteractionStatus(status || null);
    };
    
    simulateInteractionStatus();
  }, [events]);
  
  // Determine emoji size based on prop
  const getEmojiSize = () => {
    switch (size) {
      case "sm": return "text-lg";
      case "md": return "text-2xl";
      case "lg": return "text-3xl";
      default: return "text-2xl";
    }
  };
  
  // Format days together into readable text
  const formatDaysTogether = () => {
    if (daysTogether < 30) {
      return `${daysTogether} days`;
    } else if (daysTogether < 365) {
      const months = Math.floor(daysTogether / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(daysTogether / 365);
      const remainingMonths = Math.floor((daysTogether % 365) / 30);
      
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'year' : 'years'}`;
      } else {
        return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
    }
  };
  
  if (!partner) return null;
  
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Relationship stage emoji */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`${getEmojiSize()} cursor-help`} aria-label={stage.name}>
              {stage.emoji}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div className="font-medium">{stage.name}</div>
              <div className="text-xs text-gray-500">{stage.description}</div>
              <div className="text-xs font-medium">Together for {formatDaysTogether()}</div>
            </div>
          </TooltipContent>
        </Tooltip>
        
        {/* Interaction status emoji if available */}
        {interactionStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`${getEmojiSize()} cursor-help`} aria-label={interactionStatus.name}>
                {interactionStatus.emoji}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="font-medium">{interactionStatus.name}</div>
                <div className="text-xs text-gray-500">{interactionStatus.description}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Optional text label */}
        {showLabel && (
          <div className="text-xs font-medium ml-1 text-gray-600">
            {stage.name}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 