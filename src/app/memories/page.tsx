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
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

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

// Component for the animated traveler on the path
const PathTraveler = ({ pathLength }: { pathLength: string }) => {
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { damping: 20, stiffness: 100 });
  
  useEffect(() => {
    const controls = {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const,
    };
    
    progress.set(0);
    setTimeout(() => {
      progress.set(0);
      // Use the built-in methods of MotionValue
      const animateProgress = () => {
        progress.set(0);
        const id = window.setInterval(() => {
          const val = progress.get();
          if (val < 1) {
            progress.set(val + 0.01);
          } else {
            window.clearInterval(id);
            // Reverse the animation
            const reverseId = window.setInterval(() => {
              const reverseVal = progress.get();
              if (reverseVal > 0) {
                progress.set(reverseVal - 0.01);
              } else {
                window.clearInterval(reverseId);
                animateProgress(); // Repeat
              }
            }, controls.duration * 10);
          }
        }, controls.duration * 10);
      };
      
      animateProgress();
    }, 1000);
  }, [progress]);
  
  return (
    <>
      {/* Glowing dot */}
      <motion.circle
        cx="0"
        cy="0"
        r="8"
        fill="url(#glowingDot)"
        filter="url(#glow)"
        style={{
          offsetDistance: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
          offsetPath: `path('M${pathLength}')`,
          offsetRotate: "0deg",
        }}
      />
      
      {/* Heart */}
      <motion.g
        style={{
          offsetDistance: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
          offsetPath: `path('M${pathLength}')`,
          offsetRotate: "0deg",
        }}
        filter="url(#glow)"
      >
        <motion.path 
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#ff6b8c"
          scale={0.7}
          animate={{
            scale: [0.65, 0.75, 0.65],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.g>
    </>
  );
};

export default function MemoriesPage() {
  const router = useRouter();
  const { isAuthenticated, memories, addMemory } = useStore();
  const [displayMemories, setDisplayMemories] = useState<MemoryWithStory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithStory | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);
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

  // Mouse dragging for timeline navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startDragPosition.x;
    const deltaY = e.clientY - startDragPosition.y;
    
    setViewPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  if (!isAuthenticated) {
    return null;
  }

  // Sort memories by date (oldest first for timeline)
  const sortedMemories = [...displayMemories].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Group memories by year for level organization
  const memoryYears = [...new Set(sortedMemories.map(memory => 
    new Date(memory.date).getFullYear()
  ))].sort();

  // Create path string for the curved timeline
  let timelinePath = "";
  
  // Create a winding path that elevates each year
  memoryYears.forEach((year, yearIndex) => {
    const baseX = yearIndex * 600 + 150;
    const baseY = 200 + (yearIndex % 2 === 0 ? -30 : 30);
    
    // If this is the first year, start the path here
    if (yearIndex === 0) {
      timelinePath = `M${baseX},${baseY}`;
    } else {
      const prevX = (yearIndex - 1) * 600 + 450;
      const prevY = 200 + ((yearIndex - 1) % 2 === 0 ? -30 : 30);
      
      // Create a curved path to the next year
      const controlX1 = prevX + 150;
      const controlY1 = prevY + (yearIndex % 2 === 0 ? 80 : -80);
      const controlX2 = baseX - 150;
      const controlY2 = baseY + (yearIndex % 2 === 0 ? 80 : -80);
      
      timelinePath += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${baseX},${baseY}`;
    }
    
    // Continue the path through the year
    const endX = baseX + 300;
    timelinePath += ` Q${baseX + 150},${baseY + (yearIndex % 2 === 0 ? 40 : -40)} ${endX},${baseY}`;
  });

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white py-8">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-rose-800">Memory Journey</h1>
              <p className="text-rose-600">Follow the path of your love story</p>
            </div>
            <Button 
              onClick={handleNewMemory}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center gap-2"
            >
              <Plus size={16} />
              Add Memory
            </Button>
          </div>
          
          {/* Timeline Container */}
          <div 
            className="w-full overflow-hidden border border-rose-100 rounded-xl bg-white shadow-md"
            style={{ 
              height: 'calc(100vh - 200px)',
              minHeight: '500px',
              position: 'relative'
            }}
          >
            {/* Timeline Board */}
            <div
              ref={timelineRef}
              className="w-full h-full overflow-auto p-4 md:p-8 cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ 
                position: 'relative',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <div 
                className="relative"
                style={{ 
                  transform: `translate(${viewPosition.x}px, ${viewPosition.y}px)`,
                  width: '3000px',
                  height: '1500px'
                }}
              >
                {/* Legend */}
                <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-rose-100 shadow-sm z-10">
                  <div className="text-sm font-medium text-rose-800 mb-2">Memory Map</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span>Special Moments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <div className="w-6 h-2 bg-gradient-to-r from-rose-300 to-amber-200 rounded-full"></div>
                    <span>Journey Path</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>Milestone</span>
                  </div>
                </div>

                {/* SVG for the memory journey path */}
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 3000 1000" 
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Gradient for the path */}
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f9a8d4" />
                      <stop offset="50%" stopColor="#fdba74" />
                      <stop offset="100%" stopColor="#fcd34d" />
                    </linearGradient>
                    
                    {/* Glowing dot gradient */}
                    <radialGradient id="glowingDot" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                      <stop offset="70%" stopColor="#fda4af" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#fb7185" stopOpacity="0.5" />
                    </radialGradient>
                    
                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* The curved timeline path with gradient */}
                  <path
                    d={timelinePath}
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                  />
                  
                  {/* Animated traveler on the path */}
                  <PathTraveler pathLength={timelinePath} />
                  
                  {/* Year Labels */}
                  {memoryYears.map((year, yearIndex) => {
                    const baseX = yearIndex * 600 + 150;
                    const baseY = 200 + (yearIndex % 2 === 0 ? -30 : 30);
                    
                    return (
                      <g key={year}>
                        <text
                          x={baseX - 10}
                          y={baseY - 50}
                          fontSize="48"
                          fontWeight="bold"
                          fill="#fda4af"
                          opacity="0.4"
                          textAnchor="start"
                        >
                          {year}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Memory nodes for each item */}
                {memoryYears.map((year, yearIndex) => {
                  const yearMemories = sortedMemories.filter(memory => 
                    new Date(memory.date).getFullYear() === year
                  );
                  
                  // Sort by month
                  yearMemories.sort((a, b) => 
                    new Date(a.date).getMonth() - new Date(b.date).getMonth()
                  );
                  
                  // Base coordinates for this year's timeline section
                  const baseX = yearIndex * 600 + 150;
                  const baseY = 200 + (yearIndex % 2 === 0 ? -30 : 30);
                  
                  return (
                    <div key={year} className="relative">
                      {yearMemories.map((memory, memoryIndex) => {
                        const memoryDate = new Date(memory.date);
                        const month = memoryDate.getMonth();
                        const isSpecial = memory.tags.some(tag => 
                          ["Anniversary", "First Date", "Birthday", "Holiday"].includes(tag)
                        );
                        
                        // Calculate positions along the curved path
                        // This is a simplified calculation - in a real app you'd need to calculate
                        // positions along the Bezier curve more precisely
                        const xOffset = (month + 1) * 25; 
                        const posX = baseX + xOffset;
                        
                        // Add some variation in Y position based on memory index
                        const yOffset = (memoryIndex % 3 - 1) * 40;
                        const posY = baseY + yOffset;
                        
                        return (
                          <motion.div 
                            key={memory.id || memoryIndex}
                            className="absolute"
                            style={{
                              left: `${posX - 30}px`,
                              top: `${posY - 30}px`,
                              zIndex: 20
                            }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              type: "spring", 
                              delay: memoryIndex * 0.1, 
                              duration: 0.5 
                            }}
                          >
                            {/* Memory Node */}
                            <div 
                              className="w-[60px] h-[60px] rounded-full overflow-hidden border-3 shadow-lg cursor-pointer transition-transform hover:scale-110"
                              style={{
                                borderColor: isSpecial ? '#fb7185' : '#fda4af' 
                              }}
                              onClick={() => handleViewMemory(memory)}
                            >
                              <div className="relative w-full h-full">
                                <Image
                                  src={memory.mediaUrl}
                                  alt={memory.caption}
                                  fill
                                  className="object-cover"
                                />
                                
                                {/* Overlay with radial gradient */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 to-transparent opacity-50"></div>
                                
                                {/* Milestone indicator */}
                                {isSpecial && (
                                  <motion.div 
                                    className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1 shadow-sm"
                                    animate={{ 
                                      scale: [1, 1.2, 1], 
                                      rotate: [0, 5, 0, -5, 0] 
                                    }}
                                    transition={{ 
                                      duration: 3, 
                                      repeat: Infinity, 
                                      repeatType: "reverse" 
                                    }}
                                  >
                                    <Star className="h-3 w-3 text-white" />
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            {/* Date label */}
                            <motion.div 
                              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 px-2 py-0.5 rounded text-xs font-handwriting text-gray-700 whitespace-nowrap shadow-sm border border-gray-100"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: memoryIndex * 0.1 + 0.3 }}
                              style={{ fontFamily: "'Caveat', cursive" }}
                            >
                              {format(memoryDate, "MMM d")}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Instructions Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-xs text-gray-600 border border-rose-100 shadow-sm">
              <div className="flex items-center gap-1">
                <span>Drag to navigate</span>
                <span className="px-1 py-0.5 bg-gray-100 rounded">Click a memory to view</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Your love story has {displayMemories.length} chapters and counting...</p>
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
