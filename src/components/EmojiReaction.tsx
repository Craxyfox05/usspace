"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useSyncActions, ActionType } from '@/hooks/useSyncActions';
import { Heart, SmilePlus } from 'lucide-react';
import { toast } from 'sonner';

const EMOJIS = ['❤️', '😍', '🥰', '😘', '💋', '😊', '😂', '🌹', '✨', '💖'];

export default function EmojiReaction() {
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const { syncAction, partnerActions } = useSyncActions("partner-123");
  
  // Handle partner reactions
  useEffect(() => {
    const reactionActions = partnerActions.filter(
      action => action.action === ActionType.SEND_REACTION && !action.read
    );
    
    if (reactionActions.length > 0) {
      const latestAction = reactionActions[0];
      
      // Display the reaction emoji
      setSelectedEmoji(latestAction.payload.emoji);
      setAnimate(true);
      
      // Reset after animation
      setTimeout(() => {
        setAnimate(false);
        setSelectedEmoji(null);
      }, 2000);
    }
  }, [partnerActions]);
  
  // Send emoji reaction to partner
  const sendReaction = (emoji: string) => {
    setSelectedEmoji(emoji);
    setAnimate(true);
    setShowEmojis(false);
    
    // Sync with partner
    syncAction(ActionType.SEND_REACTION, {
      emoji,
      timestamp: new Date().toISOString()
    }).catch(err => console.error("Failed to send reaction:", err));
    
    // Reset after animation
    setTimeout(() => {
      setAnimate(false);
      setSelectedEmoji(null);
    }, 2000);
  };
  
  return (
    <div className="fixed bottom-28 right-8 z-40 flex flex-col items-end">
      {/* Emoji selector */}
      {showEmojis && (
        <div className="mb-4 bg-white rounded-full shadow-lg border border-rose-100 p-2 grid grid-cols-5 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="w-10 h-10 text-xl hover:scale-125 transition-transform duration-200 flex items-center justify-center"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      
      {/* Emoji display (animated) */}
      {selectedEmoji && (
        <div 
          className={`absolute bottom-20 right-10 text-6xl transform transition-all duration-500 ${
            animate ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
          }`}
          style={{ 
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
            zIndex: 50
          }}
        >
          {selectedEmoji}
        </div>
      )}
      
      {/* Reaction button */}
      <Button
        onClick={() => setShowEmojis(!showEmojis)}
        className="rounded-full h-12 w-12 p-0 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg"
      >
        {showEmojis ? (
          <Heart className="h-5 w-5" />
        ) : (
          <SmilePlus className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
} 