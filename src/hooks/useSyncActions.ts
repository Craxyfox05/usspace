"use client";

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

type SyncedAction = {
  id: string;
  userId: string;
  partnerId: string;
  action: string;
  payload: any;
  timestamp: any;
  read: boolean;
};

export enum ActionType {
  ADD_MEMORY = 'add_memory',
  VIEW_MEMORY = 'view_memory',
  JOIN_GAME = 'join_game',
  UPDATE_MOOD = 'update_mood',
  SEND_REACTION = 'send_reaction'
}

export function useSyncActions(partnerId: string) {
  const [partnerActions, setPartnerActions] = useState<SyncedAction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Send an action to be synced with partner
  const syncAction = async (action: string, payload: any = {}) => {
    if (!auth.currentUser) return;
    
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: auth.currentUser.uid,
          partnerId,
          action,
          payload
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync action');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error syncing action:', error);
      throw error;
    }
  };
  
  // Mark an action as read
  const markAsRead = async (actionId: string) => {
    try {
      await updateDoc(doc(db, 'synced_actions', actionId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking action as read:', error);
    }
  };
  
  // Listen for actions from partner
  useEffect(() => {
    if (!auth.currentUser || !partnerId) return;
    
    const userId = auth.currentUser.uid;
    
    const actionsQuery = query(
      collection(db, 'synced_actions'),
      where('partnerId', '==', userId),
      where('userId', '==', partnerId),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(actionsQuery, (snapshot) => {
      const actions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SyncedAction[];
      
      setPartnerActions(actions);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [partnerId]);
  
  return {
    partnerActions,
    loading,
    syncAction,
    markAsRead
  };
} 