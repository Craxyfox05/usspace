"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore, type Memory, type MediaType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Calendar, MapPin, Tag, BookOpen, Image as ImageIcon, Camera, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import CallButton from "@/components/VideoCall/CallButton";
import { useSyncActions, ActionType } from "@/hooks/useSyncActions";
import { motion } from "framer-motion";

// Extended Memory type to include story
interface MemoryWithStory extends Omit<Memory, 'id'> {
  id?: string;
  story?: string;
}

// Demo memory images and videos
const demoMemories: MemoryWithStory[] = [
  {
    id: "mem1",
    mediaUrl: "https://images.unsplash.com/photo-1535961652354-923cb08225a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y291cGxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Our first date at the beach",
    date: new Date("2023-06-15"),
    location: "Malibu Beach",
    tags: ["First Date", "Beach"],
    story: "We walked along the shoreline until sunset, talking for hours and laughing until our cheeks hurt.",
  },
  {
    id: "mem2",
    mediaUrl: "https://images.unsplash.com/photo-1525361767652-55d954f0536b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvdXBsZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Weekend getaway in the mountains",
    date: new Date("2023-08-22"),
    location: "Blue Ridge Mountains",
    tags: ["Vacation", "Mountains"],
    story: "We disconnected from everything except each other, surrounded by nature's beauty and the peaceful mountain air.",
  },
  {
    id: "mem3",
    mediaUrl: "https://images.unsplash.com/photo-1516589091380-5d8e87df8a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGNvdXBsZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Our anniversary dinner",
    date: new Date("2024-01-30"),
    location: "Italian Restaurant",
    tags: ["Anniversary", "Dinner"],
    story: "Five years of loving each other celebrated with candlelight, wine, and promises for many more years to come.",
  },
  {
    id: "mem4",
    mediaUrl: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Spontaneous picnic in the park",
    date: new Date("2024-02-12"),
    location: "Central Park",
    tags: ["Picnic", "Spring"],
    story: "Sometimes the unplanned moments become the most cherished memories. This day was simply perfect.",
  },
  {
    id: "mem5",
    mediaUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Sunset at the lighthouse",
    date: new Date("2023-10-08"),
    location: "Pacific Coast",
    tags: ["Adventure", "Sunset"],
    story: "The world seemed to pause as we watched the sky painted with colors that matched how we felt inside.",
  },
  {
    id: "mem6",
    mediaUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Morning coffee ritual",
    date: new Date("2023-11-14"),
    location: "Home",
    tags: ["Everyday Moments", "Simple Joys"],
    story: "It's the simple routines that build a life together - these quiet moments mean everything.",
  },
  {
    id: "mem7",
    mediaUrl: "https://images.unsplash.com/photo-1604098893841-1caf0a200feb?auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Cooking together",
    date: new Date("2023-12-25"),
    location: "Home",
    tags: ["Holiday", "Cooking"],
    story: "Our first Christmas dinner prepared together, with music playing and laughter filling the kitchen.",
  },
  {
    id: "mem8",
    mediaUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Concert night",
    date: new Date("2024-03-10"),
    location: "Downtown Venue",
    tags: ["Music", "Date Night"],
    story: "Dancing to our favorite songs, feeling the music connect us even deeper.",
  },
  {
    id: "mem9",
    mediaUrl: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=500&q=60", 
    mediaType: "image" as const,
    caption: "First road trip",
    date: new Date("2023-07-04"),
    location: "Highway 1",
    tags: ["Travel", "Adventure"],
    story: "Windows down, favorite playlist on, and endless possibilities ahead of us.",
  },
  {
    id: "mem10",
    mediaUrl: "https://images.unsplash.com/photo-1617189070333-0fcadf1159e9?auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Holiday festival",
    date: new Date("2024-01-01"),
    location: "City Center",
    tags: ["Festival", "Holiday"],
    story: "A new year beginning with colors, lights, and hopes for even more beautiful days together.",
  },
];

export default function MemoriesPage() {
  const router = useRouter();
  const { isAuthenticated, memories, addMemory } = useStore();
  const [displayMemories, setDisplayMemories] = useState<MemoryWithStory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithStory | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [positions, setPositions] = useState<{[key: string]: {x: number, y: number, rotation: number}}>({}); 
  const galleryRef = useRef<HTMLDivElement>(null);
  const { syncAction, partnerActions } = useSyncActions("partner-123");

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Set initial memories from store or demo data
  useEffect(() => {
    if (memories && memories.length > 0) {
      setDisplayMemories(memories);
    } else {
      setDisplayMemories(demoMemories);
    }
  }, [memories]);

  // Initialize random positions and rotations for polaroid cards
  useEffect(() => {
    if (displayMemories.length > 0 && Object.keys(positions).length === 0) {
      const initialPositions: {[key: string]: {x: number, y: number, rotation: number}} = {};
      
      displayMemories.forEach((memory) => {
        const id = memory.id || '';
        // Random rotation between -15 and 15 degrees
        const rotation = Math.random() * 30 - 15;
        // Initial position with slight random offset
        const x = Math.random() * 50 - 25;
        const y = Math.random() * 50 - 25;
        
        initialPositions[id] = { x, y, rotation };
      });
      
      setPositions(initialPositions);
    }
  }, [displayMemories]);

  // Handle dragging events
  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragEnd = (id: string, info: { offset: { x: number, y: number } }) => {
    setDraggingId(null);
    setPositions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: prev[id].x + info.offset.x,
        y: prev[id].y + info.offset.y
      }
    }));
  };

  const handleNewMemory = () => {
    router.push('/memories/new');
  };

  const handleViewMemory = (memory: MemoryWithStory) => {
    setSelectedMemory(memory);
    
    // Send action to partner if they're online
    syncAction(ActionType.VIEW_MEMORY, {
      memoryId: memory.id,
      timestamp: new Date().toISOString()
    }).catch(err => console.error("Failed to sync memory view:", err));
  };

  const closeMemoryView = () => {
    setSelectedMemory(null);
  };

  const handleFlipCard = (id: string) => {
    setPositions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        rotation: prev[id].rotation + 180
      }
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  // Sort memories by date (newest first)
  const sortedMemories = [...displayMemories].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white py-8">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-rose-800">Our Memories</h1>
              <p className="text-rose-600">Moments frozen in time</p>
            </div>
            <Button 
              onClick={handleNewMemory}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center gap-2"
            >
              <Plus size={16} />
              Add Memory
            </Button>
          </div>
          
          {/* Polaroid Gallery */}
          <div 
            ref={galleryRef}
            className="relative w-full bg-[#f8f9fa] border border-gray-200 rounded-xl p-4 md:p-8 min-h-[70vh] overflow-hidden"
          >
            {/* Cork board background texture */}
            <div className="absolute inset-0 bg-[url('/cork-board.png')] opacity-20"></div>
            
            {/* Polaroid Cards */}
            <div className="relative">
              {sortedMemories.map((memory, index) => {
                const id = memory.id || `memory-${index}`;
                const pos = positions[id] || { x: 0, y: 0, rotation: 0 };
                const isSpecial = memory.tags.some(tag => 
                  ["Anniversary", "First Date", "Birthday", "Holiday"].includes(tag)
                );
                
                return (
                  <motion.div
                    key={id}
                    className={cn(
                      "absolute bg-white rounded-md p-3 pb-8 shadow-md cursor-grab active:cursor-grabbing",
                      draggingId === id ? "z-50" : "z-10"
                    )}
                    style={{
                      width: '240px',
                      originX: 0.5,
                      originY: 0.5,
                      left: `calc(${index % 4 * 25 + 5}% + ${pos.x}px)`,
                      top: `calc(${Math.floor(index / 4) * 280 + 30}px + ${pos.y}px)`,
                    }}
                    initial={{
                      rotate: pos.rotation,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                    animate={{
                      rotate: pos.rotation,
                      boxShadow: draggingId === id
                        ? "0 10px 25px rgba(0, 0, 0, 0.2)"
                        : "0 4px 6px rgba(0, 0, 0, 0.1)",
                      scale: draggingId === id ? 1.05 : 1
                    }}
                    whileHover={{
                      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    drag
                    dragMomentum={false}
                    onDragStart={() => handleDragStart(id)}
                    onDragEnd={(e, info) => handleDragEnd(id, info)}
                    onDoubleClick={() => handleFlipCard(id)}
                  >
                    {/* Polaroid Image */}
                    <div className="relative">
                      <div className="relative w-full aspect-square overflow-hidden mb-2">
                        <Image
                          src={memory.mediaUrl}
                          alt={memory.caption}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Special tag for important memories */}
                      {isSpecial && (
                        <div className="absolute top-2 right-2 bg-amber-400 rounded-full p-1 shadow-sm z-20">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      )}
                      
                      {/* Polaroid caption */}
                      <div onClick={() => handleViewMemory(memory)} className="cursor-pointer">
                        <p className="text-center text-sm font-medium text-gray-800 truncate mb-1">
                          {memory.caption}
                        </p>
                        
                        {/* Date in handwritten style */}
                        <p 
                          className="text-center text-xs text-gray-600 font-handwriting"
                          style={{ fontFamily: "'Caveat', cursive" }}
                        >
                          {format(new Date(memory.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                      
                      {/* Tape effect */}
                      <div className="absolute top-[-8px] left-[50%] w-16 h-8 bg-[#ffffff98] transform -translate-x-1/2 opacity-40"></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-xs text-gray-600 border border-rose-100 shadow-sm">
              <div className="flex flex-col gap-1">
                <span>• Drag to rearrange</span>
                <span>• Double-click to flip</span>
                <span>• Click caption to view details</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Your love story has {displayMemories.length} cherished memories and counting...</p>
          </div>
        </div>
      </div>
      
      {/* Memory View Dialog */}
      <Dialog open={!!selectedMemory} onOpenChange={closeMemoryView}>
        {selectedMemory && (
          <DialogContent className="max-w-3xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedMemory.caption}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(selectedMemory.date), "MMMM d, yyyy")}</span>
                  
                  {selectedMemory.location && (
                    <>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{selectedMemory.location}</span>
                    </>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative aspect-video overflow-hidden rounded-lg">
              {selectedMemory.mediaType === "image" ? (
                <Image
                  src={selectedMemory.mediaUrl}
                  alt={selectedMemory.caption}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={selectedMemory.mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {selectedMemory.story && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-rose-700">
                  <BookOpen className="h-4 w-4" />
                  <h3 className="font-medium">Our Story</h3>
                </div>
                <p className="text-gray-700">{selectedMemory.story}</p>
              </div>
            )}
            
            {selectedMemory.tags && selectedMemory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedMemory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeMemoryView}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Add font imports to head */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&display=swap');
        
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
      `}</style>
    </PageLayout>
  );
}
