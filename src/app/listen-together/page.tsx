"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { 
  Headphones, 
  ListMusic, 
  Music2, 
  Share2, 
  UserPlus2, 
  Heart, 
  Plus,
  Users,
  Radio,
  Mic2,
  Music,
  PlayCircle
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MusicPlayer from "@/components/music/MusicPlayer";
import PlaylistCard from "@/components/music/PlaylistCard";
import ShareMusicDialog from "@/components/music/ShareMusicDialog";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

// Dynamically import the SessionHandler component with ssr: false
const SessionHandler = dynamic(() => import("@/components/music/SessionHandler"), { 
  ssr: false,
  loading: () => null
});

// Sample playlist data
const playlists = [
  {
    id: "1",
    title: "Romantic Evening",
    description: "Perfect for a cozy night in with your loved one",
    coverImage: "/images/playlist1.jpg",
    trackCount: 12,
    isFeatured: true
  },
  {
    id: "2",
    title: "Chill Vibes",
    description: "Relaxing tunes to unwind together",
    coverImage: "/images/playlist2.jpg",
    trackCount: 18
  },
  {
    id: "3",
    title: "Throwback Hits",
    description: "Nostalgic songs from your favorite decades",
    trackCount: 24
  },
  {
    id: "4",
    title: "Dance Party",
    description: "Upbeat tracks to dance the night away",
    coverImage: "/images/playlist4.jpg",
    trackCount: 15
  },
  {
    id: "5",
    title: "Focus Together",
    description: "Perfect background music for working side by side",
    trackCount: 20
  }
];

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
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30">
        <PageHeader
          title="Listen Together"
          subtitle="Share music experiences with your loved one"
        />
        
        {/* Client-side only component */}
        <SessionHandler onSessionDetected={handleSessionDetected} />
        
        <div className="container py-8 max-w-6xl">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Music Player */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <MusicPlayer isShared={isSharing} onShare={handleShareMusic} />
                
                {/* Share controls */}
                <div className="mt-6 flex flex-col gap-4">
                  <Button 
                    onClick={handleShareMusic}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                    disabled={isSharing}
                  >
                    <Share2 className="mr-2 h-5 w-5" /> 
                    {isSharing ? "Currently Sharing" : "Share with Partner"}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center justify-center border-amber-200 text-amber-700 hover:bg-amber-50">
                      <Heart className="mr-2 h-4 w-4" /> Favorites
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center border-amber-200 text-amber-700 hover:bg-amber-50">
                      <ListMusic className="mr-2 h-4 w-4" /> History
                    </Button>
                  </div>
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

                {/* Music Pod SVG Icons Section */}
                <div className="mt-8 bg-amber-50/60 border border-amber-100 rounded-lg p-4">
                  <h3 className="font-medium text-amber-800 mb-3">Music & Podcast Tools</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                        <Radio className="h-5 w-5 text-amber-700" />
                      </div>
                      <span className="text-xs text-amber-700">Radio</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                        <Mic2 className="h-5 w-5 text-amber-700" />
                      </div>
                      <span className="text-xs text-amber-700">Podcasts</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                        <Music className="h-5 w-5 text-amber-700" />
                      </div>
                      <span className="text-xs text-amber-700">Singles</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                        <PlayCircle className="h-5 w-5 text-amber-700" />
                      </div>
                      <span className="text-xs text-amber-700">Albums</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Playlists */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-800">Playlists</h2>
                <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Plus className="h-4 w-4 mr-2" /> New Playlist
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist.id} 
                    className="group border border-amber-100 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={playlist.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop"} 
                        alt={playlist.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs font-medium px-2 py-1 bg-amber-800/80 text-white rounded-full">
                          {playlist.trackCount} tracks
                        </span>
                      </div>
                      {playlist.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs font-medium px-2 py-1 bg-amber-500/90 text-white rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-amber-800 mb-1">{playlist.title}</h3>
                      <p className="text-sm text-amber-700">{playlist.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6 text-amber-800">For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 flex items-center gap-4 hover:from-amber-500 hover:to-amber-600 transition-all shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Daily Mix</h3>
                      <p className="text-sm text-white/80">Based on your taste</p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-amber-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800">Love Songs</h3>
                      <p className="text-sm text-amber-700">Romantic favorites</p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-amber-50 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-400 flex items-center justify-center">
                      <Music2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800">New Releases</h3>
                      <p className="text-sm text-amber-700">Fresh music for you</p>
                    </div>
                  </div>
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
    </PageLayout>
  );
} 