import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Required fields
    const { userId, partnerId, action, payload } = data;
    
    if (!userId || !partnerId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create action record in Firestore
    const actionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    await setDoc(doc(db, 'synced_actions', actionId), {
      userId,
      partnerId,
      action,
      payload: payload || {},
      timestamp: serverTimestamp(),
      read: false
    });
    
    return NextResponse.json({ success: true, actionId });
  } catch (error) {
    console.error('Error syncing action:', error);
    return NextResponse.json(
      { error: 'Failed to sync action' },
      { status: 500 }
    );
  }
} 