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
  
  // Return empty div (button removed)
  return null;
} 