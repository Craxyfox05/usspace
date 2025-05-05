"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { 
  Headphones, 
  Share2, 
  Users,
  Music2,
  Radio,
  Disc
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MusicPlayer from "@/components/music/MusicPlayer";
import ShareMusicDialog from "@/components/music/ShareMusicDialog";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

// Dynamically import the SessionHandler component with ssr: false
const SessionHandler = dynamic(() => import("@/components/music/SessionHandler"), { 
  ssr: false,
  loading: () => null
});

export default function ListenTogetherPage() {
  const router = useRouter();
  const { user, partner, isAuthenticated } = useStore();
  const [isSharing, setIsSharing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const handleShareMusic = () => {
    setShareDialogOpen(true);
  };
  
  const startSharedListening = () => {
    setIsSharing(true);
    toast.success("Started a shared listening session!");
  };

  const handleSessionDetected = (sessionId: string) => {
    // In a real app, this would connect to the session
    setTimeout(() => {
      toast.success("Joined listening session!");
      setIsSharing(true);
    }, 1000);
  };
  
  return (
    <PageLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 overflow-hidden">
        {/* Floating SVG Elements */}
        <div className="absolute top-40 left-5 animate-bounce-slow opacity-20 hidden md:block">
          <div className="h-20 w-20 rounded-full bg-amber-200 flex items-center justify-center">
            <Disc className="h-14 w-14 text-amber-600" />
          </div>
        </div>
        
        <div className="absolute bottom-40 right-10 animate-pulse opacity-20 hidden md:block">
          <div className="h-28 w-24 rounded-2xl bg-amber-200 p-2 flex flex-col items-center justify-center">
            <div className="w-full h-12 bg-amber-100 rounded-lg mb-2"></div>
            <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center">
              <Music2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/3 right-20 animate-float opacity-20 hidden md:block">
          <Radio className="h-16 w-16 text-amber-500" />
        </div>
        
        <PageHeader
          title="Listen Together"
          subtitle="Share music experiences with your loved one"
        />
        
        {/* Client-side only component */}
        <SessionHandler onSessionDetected={handleSessionDetected} />
        
        <div className="container py-6 mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Earphones Heart SVG */}
            <div className="relative flex justify-center mb-6">
              <svg width="180" height="80" viewBox="0 0 200 100" className="text-amber-500">
                <path d="M30,50 C30,30 60,0 100,20 C140,0 170,30 170,50" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  className="animate-pulse-slow" />
                
                {/* Left Earphone */}
                <circle cx="30" cy="50" r="10" fill="#f59e0b" />
                <circle cx="30" cy="50" r="6" fill="#fbbf24" />
                <circle cx="30" cy="50" r="2" fill="white" />
                
                {/* Right Earphone */}
                <circle cx="170" cy="50" r="10" fill="#f59e0b" />
                <circle cx="170" cy="50" r="6" fill="#fbbf24" />
                <circle cx="170" cy="50" r="2" fill="white" />
              </svg>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800">Music Brings Us Together</h2>
              <p className="text-amber-700">Share the magic of music with your partner in real-time</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column - iPod Style Music Player */}
              <div className="lg:col-span-5 flex justify-center">
                {/* iPod-style Player */}
                <div className="w-full max-w-[260px] bg-white rounded-[25px] shadow-xl overflow-hidden border-6 border-gray-100">
                  {/* iPod Screen */}
                  <div className="bg-gradient-to-b from-amber-100 to-amber-50 p-4 rounded-t-[18px]">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Headphones className="h-4 w-4 text-amber-700 mr-1" />
                        <span className="text-xs font-medium text-amber-800">Now Playing</span>
                      </div>
                      {isSharing && (
                        <div className="flex items-center">
                          <Users className="h-3 w-3 text-amber-700 mr-1" />
                          <span className="text-xs text-amber-800">Shared</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="aspect-square bg-amber-900/10 rounded-xl mb-2 flex items-center justify-center overflow-hidden relative">
                      {/* Album Art */}
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-spin-slow">
                        <Music2 className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Visualizer */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 px-4">
                        {Array.from({length: 10}).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-amber-500/70 rounded-t animate-sound-wave" 
                            style={{
                              height: `${Math.random() * 15 + 5}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center mb-2">
                      <h3 className="text-base font-bold text-amber-800">Your Melody</h3>
                      <p className="text-xs text-amber-600">UsSpace</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-amber-200 rounded-full mb-1">
                      <div className="h-full w-1/3 bg-amber-500 rounded-full animate-progress"></div>
                    </div>
                    <div className="flex justify-between text-xs text-amber-700">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                  </div>
                  
                  {/* iPod Controls - Click Wheel */}
                  <div className="p-3 bg-white">
                    <div className="w-full aspect-square rounded-full bg-gray-100 flex items-center justify-center relative">
                      {/* Center Button */}
                      <div className="w-1/3 h-1/3 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center">
                          {isSharing ? (
                            <span className="text-white text-xs font-bold">II</span>
                          ) : (
                            <span className="text-white text-xs font-bold">▶</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Top Control */}
                      <div className="absolute top-4 inset-x-0 flex justify-center">
                        <span className="text-amber-800 font-medium text-xs">MENU</span>
                      </div>
                      
                      {/* Bottom Control */}
                      <div className="absolute bottom-4 inset-x-0 flex justify-center">
                        <Headphones className="h-4 w-4 text-amber-800" />
                      </div>
                      
                      {/* Left Control */}
                      <div className="absolute left-4 inset-y-0 flex items-center">
                        <span className="text-amber-800 text-lg">◀︎</span>
                      </div>
                      
                      {/* Right Control */}
                      <div className="absolute right-4 inset-y-0 flex items-center">
                        <span className="text-amber-800 text-lg">▶︎</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column - Features */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Share Button */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center mr-4">
                        <Share2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Share Music</h2>
                        <p className="text-sm text-white/80">Listen together in real-time</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleShareMusic}
                      className="w-full bg-white text-amber-600 hover:bg-amber-50"
                      disabled={isSharing}
                    >
                      {isSharing ? "Currently Sharing" : "Start Sharing"}
                    </Button>
                  </div>
                  
                  {/* Blend Feature */}
                  <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                        <Music2 className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-amber-800">Create a Blend</h2>
                        <p className="text-sm text-amber-700">Mix your music tastes</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                    >
                      Create Blend Playlist
                    </Button>
                  </div>
                  
                  {/* Online Music Integration */}
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 md:col-span-2">
                    <h2 className="text-lg font-medium text-amber-800 mb-4 flex items-center">
                      <Music2 className="h-5 w-5 mr-2 text-amber-600" /> 
                      Connect to Online Music
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Music2 className="h-3 w-3 text-white" />
                        </div>
                        <span>Spotify</span>
                      </Button>
                      
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                          <Music2 className="h-3 w-3 text-white" />
                        </div>
                        <span>Apple Music</span>
                      </Button>
                      
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Music2 className="h-3 w-3 text-white" />
                        </div>
                        <span>Other Services</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Connection status */}
                  {isSharing && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:col-span-2">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-amber-700 mt-0.5 mr-2" />
                        <div>
                          <h3 className="font-medium text-amber-800">Active Session</h3>
                          <p className="text-sm text-amber-700">
                            You {partner ? `and ${partner.name}` : ""} are listening together.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ShareMusicDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onConfirm={startSharedListening}
      />
      
      {/* Add custom animation keyframes for floating elements */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-10%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        @keyframes sound-wave {
          0%, 100% {
            height: 5px;
          }
          50% {
            height: 20px;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 5s infinite;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 20s linear infinite;
        }
        
        .animate-sound-wave {
          animation: sound-wave 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </PageLayout>
  );
} 