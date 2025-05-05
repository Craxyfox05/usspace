"use client";

import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PhoneOff, 
  Minimize, 
  Maximize, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  X, 
  Send, 
  Heart, 
  MessageCircle
} from 'lucide-react';

const FloatingVideoCall = () => {
  const {
    callActive,
    callAccepted,
    myVideo,
    partnerVideo,
    stream,
    leaveCall,
    isCallMinimized,
    setIsCallMinimized,
    messages,
    sendMessage,
    name
  } = useVideoCall();

  const [showChat, setShowChat] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  // Render emoji based on message content
  const renderEmoji = (text: string) => {
    if (text.includes('❤️') || text.includes('love')) return '❤️';
    if (text.includes('😊') || text.includes('happy')) return '😊';
    if (text.includes('😂') || text.includes('laugh')) return '😂';
    if (text.includes('🥰') || text.includes('adore')) return '🥰';
    return '💌';
  };

  // Don't render if no call is active
  if (!callActive) return null;

  // Determine window dimensions based on minimized state
  const windowWidth = isCallMinimized ? '280px' : '350px';
  const windowHeight = isCallMinimized ? '200px' : (showChat ? '500px' : '350px');

  return (
    <Draggable handle=".call-drag-handle" bounds="parent">
      <div 
        className="fixed z-50 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50 border-2 border-rose-200"
        style={{ 
          width: windowWidth, 
          height: windowHeight,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Call Header / Drag Handle */}
        <div className="call-drag-handle bg-gradient-to-r from-rose-400 to-amber-400 py-2 px-3 flex justify-between items-center cursor-move">
          <div className="flex items-center">
            <Heart className="h-4 w-4 text-white mr-2" />
            <span className="text-white font-medium text-sm">
              {isCallMinimized ? 'Active Call' : 'Video Call'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isCallMinimized ? (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-white hover:bg-white/20" 
                onClick={() => setIsCallMinimized(false)}
              >
                <Maximize className="h-3 w-3" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-white hover:bg-white/20" 
                onClick={() => setIsCallMinimized(true)}
              >
                <Minimize className="h-3 w-3" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 text-white hover:bg-rose-500" 
              onClick={leaveCall}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full" style={{ height: isCallMinimized ? '140px' : '240px' }}>
          {/* Partner Video (Large) */}
          {callAccepted && (
            <video
              ref={partnerVideo}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
          
          {/* My Video (Picture-in-picture) */}
          <div className="absolute bottom-2 right-2 w-1/3 h-1/3 z-20 rounded-lg overflow-hidden border border-white shadow-md">
            <video
              ref={myVideo}
              muted
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Video overlay with controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-3 z-30">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className={`rounded-full h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border-white/40 ${isMuted ? 'bg-rose-500/80 text-white' : 'text-white'}`}
                onClick={toggleAudio}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className={`rounded-full h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border-white/40 ${isVideoOff ? 'bg-rose-500/80 text-white' : 'text-white'}`}
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full h-8 w-8 p-0 bg-rose-500/80 text-white backdrop-blur-sm border-white/40"
                onClick={leaveCall}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
              
              {!isCallMinimized && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`rounded-full h-8 w-8 p-0 backdrop-blur-sm border-white/40 text-white ${showChat ? 'bg-amber-400/80' : 'bg-white/20'}`}
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Section (only shown when not minimized and chat is toggled) */}
        {!isCallMinimized && showChat && (
          <div className="bg-white/90 backdrop-blur-sm h-36 flex flex-col">
            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-2 space-y-2"
              style={{ maxHeight: '120px' }}
            >
              {messages.map(message => {
                const isMe = message.sender === name;
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm relative ${
                      isMe ? 'bg-rose-100 text-rose-800 rounded-tr-none' : 'bg-amber-100 text-amber-800 rounded-tl-none'
                    }`}>
                      <span className="absolute -top-1.5 text-xs">
                        {renderEmoji(message.text)}
                      </span>
                      {message.text}
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-amber-400 text-sm italic">
                    Start your conversation...
                  </p>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-2 flex gap-2 border-t border-rose-100">
              <Input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="text-sm border-rose-200 focus:border-rose-300"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="bg-rose-400 hover:bg-rose-500 px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-12 left-0 w-10 h-10 rounded-full bg-amber-100 opacity-20 -z-10"></div>
        <div className="absolute bottom-10 right-5 w-16 h-16 rounded-full bg-rose-100 opacity-30 -z-10"></div>
      </div>
    </Draggable>
  );
};

export default FloatingVideoCall; 