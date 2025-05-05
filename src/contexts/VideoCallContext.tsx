"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  addDoc,
  where
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'simple-peer';

// Define types for our context
type VideoCallContextType = {
  call: {
    isReceivingCall: boolean;
    from: string;
    name: string;
    signal: any;
  } | null;
  callAccepted: boolean;
  callActive: boolean;
  myVideo: React.MutableRefObject<HTMLVideoElement | null> | null;
  partnerVideo: React.MutableRefObject<HTMLVideoElement | null> | null;
  stream: MediaStream | null;
  isCallMinimized: boolean;
  messages: Message[];
  name: string;
  callId: string | null;
  setIsCallMinimized: (state: boolean) => void;
  answerCall: () => void;
  callPartner: (partnerId: string, partnerName: string) => void;
  leaveCall: () => void;
  sendMessage: (text: string) => Promise<void>;
  setName: (name: string) => void;
};

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: any;
};

// Create context with default values
const VideoCallContext = createContext<VideoCallContextType>({
  call: null,
  callAccepted: false,
  callActive: false,
  myVideo: null,
  partnerVideo: null,
  stream: null,
  isCallMinimized: false,
  messages: [],
  name: '',
  callId: null,
  setIsCallMinimized: () => {},
  answerCall: () => {},
  callPartner: () => {},
  leaveCall: () => {},
  sendMessage: async () => {},
  setName: () => {},
});

export const useVideoCall = () => useContext(VideoCallContext);

// Create provider component
export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
  const [callId, setCallId] = useState<string | null>(null);
  const [call, setCall] = useState<VideoCallContextType['call']>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [connectionRef, setConnectionRef] = useState<Peer.Instance | null>(null);
  
  // Video refs
  const myVideo = { current: null } as React.MutableRefObject<HTMLVideoElement | null>;
  const partnerVideo = { current: null } as React.MutableRefObject<HTMLVideoElement | null>;
  
  // Initialize user media on component mount
  useEffect(() => {
    // Only initialize if the user is authenticated
    if (!auth.currentUser) return;
    
    const setupMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(currentStream);
        
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    
    setupMedia();
    
    // Listen for incoming calls
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();
        if (data?.incomingCall && !callActive) {
          setCall({
            isReceivingCall: true,
            from: data.incomingCall.from,
            name: data.incomingCall.name,
            signal: data.incomingCall.signal,
          });
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [callActive]);
  
  // Listen for messages when in a call
  useEffect(() => {
    if (!callId) return;
    
    const messagesQuery = query(
      collection(db, 'calls', callId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(newMessages);
    });
    
    return () => unsubscribe();
  }, [callId]);
  
  // Call a partner
  const callPartner = async (partnerId: string, partnerName: string) => {
    try {
      if (!stream) {
        console.error('No media stream available');
        return;
      }
      
      // Create a unique call ID
      const newCallId = uuidv4();
      setCallId(newCallId);
      
      // Create call document in Firestore
      await setDoc(doc(db, 'calls', newCallId), {
        initiator: auth.currentUser?.uid,
        receiver: partnerId,
        startTime: serverTimestamp(),
        active: true
      });
      
      // Create peer connection
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream
      });
      
      // Handle connection events
      peer.on('signal', async (data) => {
        // Send signal data to partner via Firestore
        await setDoc(doc(db, 'users', partnerId), {
          incomingCall: {
            from: auth.currentUser?.uid,
            name: name,
            signal: data,
            callId: newCallId
          }
        }, { merge: true });
      });
      
      peer.on('stream', (currentStream) => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = currentStream;
        }
      });
      
      // Save connection ref for later use
      setConnectionRef(peer);
      setCallActive(true);
      
    } catch (error) {
      console.error('Error calling partner:', error);
    }
  };
  
  // Answer an incoming call
  const answerCall = async () => {
    if (!call || !stream) return;
    
    setCallAccepted(true);
    setCallActive(true);
    setCallId(call.signal.callId);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });
    
    peer.on('signal', async (data) => {
      // Send answer signal back to the caller
      await updateDoc(doc(db, 'users', call.from), {
        callAccepted: {
          by: auth.currentUser?.uid,
          signal: data
        }
      });
    });
    
    peer.on('stream', (currentStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = currentStream;
      }
    });
    
    // Connect with the caller's signal
    peer.signal(call.signal);
    
    setConnectionRef(peer);
    setCall(null);
  };
  
  // Leave the current call
  const leaveCall = async () => {
    if (connectionRef) {
      connectionRef.destroy();
    }
    
    if (callId) {
      // Update call status in Firestore
      await updateDoc(doc(db, 'calls', callId), {
        active: false,
        endTime: serverTimestamp()
      });
    }
    
    // Reset state
    setCallActive(false);
    setCallAccepted(false);
    setConnectionRef(null);
    setCallId(null);
    setMessages([]);
    
    // Stop all tracks in the stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Restart media to prepare for next call
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(newStream);
      
      if (myVideo.current) {
        myVideo.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error restarting media:', error);
    }
  };
  
  // Send a chat message
  const sendMessage = async (text: string) => {
    if (!callId || !auth.currentUser) return;
    
    await addDoc(collection(db, 'calls', callId, 'messages'), {
      sender: auth.currentUser.uid,
      senderName: name,
      text,
      timestamp: serverTimestamp()
    });
  };
  
  // Context value
  const value = {
    call,
    callAccepted,
    callActive,
    myVideo,
    partnerVideo,
    stream,
    isCallMinimized,
    messages,
    name,
    callId,
    setIsCallMinimized,
    answerCall,
    callPartner,
    leaveCall,
    sendMessage,
    setName
  };
  
  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
}; 