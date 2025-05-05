"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Music, Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/profile/Avatar";
import { toast } from "sonner";

type MusicPlayerProps = {
  isShared?: boolean;
  onShare?: () => void;
};

const MusicPlayer = ({ isShared = false, onShare }: MusicPlayerProps) => {
  const { user, partner } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrack, setActiveTrack] = useState({
    title: "Your Melody",
    artist: "UsSpace",
    coverUrl: "/music/cover1.jpg"
  });
  const [isPartnerListening, setIsPartnerListening] = useState(false);
  const [visualizerValues, setVisualizerValues] = useState<number[]>(Array(20).fill(0));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/music/sample-track.mp3");
    
    const audio = audioRef.current;
    
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    
    // Set initial volume
    audio.volume = volume / 100;
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        audio.removeEventListener("loadedmetadata", () => {});
        audio.removeEventListener("timeupdate", () => {});
        audio.removeEventListener("ended", () => {});
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Simulate partner joining after 5 seconds in shared mode
  useEffect(() => {
    if (isShared) {
      const timer = setTimeout(() => {
        setIsPartnerListening(true);
        toast.success(`${partner?.name || "Your partner"} joined your listening session!`);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isShared, partner?.name]);
  
  // Update visualizer animation
  useEffect(() => {
    const updateVisualizer = () => {
      // Create a simulated visualizer effect
      const newValues = visualizerValues.map(() => {
        if (isPlaying) {
          return Math.random() * 100;
        } else {
          return 5;
        }
      });
      
      setVisualizerValues(newValues);
      animationRef.current = requestAnimationFrame(updateVisualizer);
    };
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateVisualizer);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      // Reset to low values when not playing
      setVisualizerValues(Array(20).fill(5));
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, visualizerValues]);
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
    
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };
  
  const handleSeek = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      toast.success("Invitation link copied to clipboard!");
    }
  };
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-rose-800 via-rose-700 to-amber-600 p-6 text-white shadow-xl w-full max-w-md mx-auto">
      {/* Visualizer */}
      <div className="flex items-end justify-center h-16 mb-6 gap-1">
        {visualizerValues.map((value, index) => (
          <div 
            key={index}
            className={cn(
              "w-2 bg-white bg-opacity-80 rounded-t transition-all duration-100",
              isPlaying ? "animate-pulse" : ""
            )}
            style={{ 
              height: `${value}%`, 
              opacity: value / 100,
              transitionDelay: `${index * 30}ms`
            }}
          />
        ))}
      </div>
      
      {/* Album art and info */}
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center overflow-hidden mr-4">
          <Music className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{activeTrack.title}</h3>
          <p className="text-gray-200">{activeTrack.artist}</p>
          
          {/* Shared listening status */}
          {isShared && (
            <div className="flex items-center mt-2 text-xs text-amber-200">
              <div className="flex -space-x-2">
                <Avatar type="user" size="xs" className="border-2 border-rose-800" />
                {isPartnerListening && (
                  <Avatar type="partner" size="xs" className="border-2 border-rose-800" />
                )}
              </div>
              <span className="ml-2">
                {isPartnerListening 
                  ? "Listening together" 
                  : "Waiting for partner to join..."}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Seek bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" className="text-white rounded-full h-10 w-10">
            <SkipBack size={20} />
          </Button>
          
          <Button 
            size="icon" 
            onClick={togglePlayPause}
            className="bg-white text-rose-700 hover:bg-gray-200 hover:text-rose-600 rounded-full h-12 w-12"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          
          <Button size="icon" variant="ghost" className="text-white rounded-full h-10 w-10">
            <SkipForward size={20} />
          </Button>
        </div>
        
        <div className="flex items-center w-24">
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-white h-8 w-8 mr-2"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Share button */}
      {!isShared && (
        <div className="mt-4">
          <Button 
            onClick={handleShare}
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with Partner
          </Button>
        </div>
      )}
      
      {/* Animated waves at bottom */}
      <div className="mt-6 overflow-hidden h-4 relative">
        <div className="absolute inset-0 flex justify-around items-end">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "bg-white bg-opacity-20 w-1 rounded-t",
                isPlaying ? "animate-sound-wave" : "h-1"
              )}
              style={{
                height: isPlaying ? '100%' : '10%',
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${0.7 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 