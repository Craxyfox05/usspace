"use client";

import { useVideoCall } from '@/contexts/VideoCallContext';
import { Button } from '@/components/ui/button';
import { PhoneCall, PhoneOff, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

const CallNotification = () => {
  const { call, callActive, answerCall, leaveCall } = useVideoCall();
  const [fadeOut, setFadeOut] = useState(false);

  // Play sound when there's an incoming call
  useEffect(() => {
    if (call?.isReceivingCall) {
      try {
        const audio = new Audio('/sounds/call-ringtone.mp3');
        audio.loop = true;
        audio.play().catch(error => console.warn('Note: Ringtone may be missing:', error));
        
        return () => {
          audio.pause();
          audio.currentTime = 0;
        };
      } catch (error) {
        console.warn('Could not load ringtone:', error);
      }
    }
  }, [call]);

  // Handle the fade out animation before removing
  const handleDecline = () => {
    setFadeOut(true);
    setTimeout(() => {
      leaveCall();
      setFadeOut(false);
    }, 300);
  };

  // Render nothing if no incoming call or already in a call
  if (!call?.isReceivingCall || callActive) return null;

  return (
    <div className={`fixed top-8 right-8 z-50 max-w-md transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="p-5 rounded-xl bg-gradient-to-r from-rose-100 to-amber-50 border-2 border-rose-200 shadow-xl animate-bounce-slow">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-rose-400 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-rose-700">Incoming Call</h3>
            <p className="text-amber-700">{call.name} is calling you ❤️</p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end mt-4">
          <Button 
            onClick={handleDecline}
            variant="outline" 
            className="bg-white/50 border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button 
            onClick={answerCall}
            className="bg-gradient-to-r from-rose-400 to-amber-400 text-white border-none"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Answer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification; 