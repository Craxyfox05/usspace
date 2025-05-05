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
        
        <div className="container py-8 max-w-3xl mx-auto relative z-10">
          <div className="bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Headphones className="h-8 w-8 text-amber-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Music Brings Us Together</h1>
                <p className="text-amber-700">Share the magic of music with your partner in real-time</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            {/* Music Player */}
            <div className="mx-auto w-full max-w-md">
              <MusicPlayer isShared={isSharing} onShare={handleShareMusic} />
              
              {/* Share controls */}
              <div className="mt-6">
                <Button 
                  onClick={handleShareMusic}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-5 rounded-xl text-lg"
                  disabled={isSharing}
                >
                  <Share2 className="mr-2 h-5 w-5" /> 
                  {isSharing ? "Currently Sharing" : "Share with Partner"}
                </Button>
              </div>
              
              {/* Connection status */}
              {isSharing && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
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
            
            {/* Online Music Integration */}
            <div className="bg-white rounded-xl border border-amber-100 p-6 shadow-sm">
              <h2 className="text-lg font-medium text-amber-800 mb-4 flex items-center">
                <Music2 className="h-5 w-5 mr-2 text-amber-600" /> 
                Connect to Online Music
              </h2>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-amber-50 flex items-center justify-center border border-amber-100">
                <div className="text-center px-4">
                  <Music2 className="h-10 w-10 text-amber-600 mx-auto mb-3 opacity-60" />
                  <h3 className="text-amber-800 font-medium mb-2">Listen to Your Favorite Music</h3>
                  <p className="text-amber-700 text-sm mb-4">Connect to Spotify, Apple Music, or YouTube Music to play your favorite tracks.</p>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">Connect Service</Button>
                </div>
              </div>
            </div>
            
            {/* Blend Feature */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center mr-4">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create a Blend</h2>
                  <p className="text-sm text-white/80">Mix your music tastes for a perfect shared playlist</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-white text-amber-600 hover:bg-amber-50"
              >
                Create Blend Playlist
              </Button>
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
        
        .animate-bounce-slow {
          animation: bounce-slow 5s infinite;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </PageLayout>
  );
} 