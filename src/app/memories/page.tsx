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
import Slider from "react-slick";
import { ChevronLeft, ChevronRight, Heart, Calendar, MapPin, Tag, BookOpen, Image as ImageIcon, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import CallButton from "@/components/VideoCall/CallButton";
import { useSyncActions, ActionType } from "@/hooks/useSyncActions";

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
];

// Custom prev/next arrow components for slider
interface ArrowProps {
  onClick?: () => void;
  className?: string;
}

const PrevArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <button 
      onClick={onClick} 
      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all duration-200"
      aria-label="Previous slide"
    >
      <ChevronLeft className="h-5 w-5 text-gray-700" />
    </button>
  );
};

const NextArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <button 
      onClick={onClick} 
      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all duration-200"
      aria-label="Next slide"
    >
      <ChevronRight className="h-5 w-5 text-gray-700" />
    </button>
  );
};

export default function MemoriesPage() {
  const router = useRouter();
  const { isAuthenticated, memories, addMemory } = useStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayMemories, setDisplayMemories] = useState<MemoryWithStory[]>(demoMemories);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithStory | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const gallerySliderRef = useRef<Slider | null>(null);
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
    }
  }, [memories]);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.8);
        
        if (isVisible) {
          el.classList.add('animate-fade-in');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const handleFirstEntryRedirect = () => {
    localStorage.setItem('newJournalEntry', JSON.stringify({
      mediaUrl: "",
      mediaType: "image",
      caption: "",
      date: format(new Date(), "yyyy-MM-dd"),
      location: "",
      tags: "",
      story: "",
    }));
    router.push('/memories/new');
  };

  const filterMemories = (filter: string) => {
    setActiveFilter(filter);

    if (filter === "all") {
      setDisplayMemories(memories.length > 0 ? memories : demoMemories);
    } else {
      const filtered = (memories.length > 0 ? memories : demoMemories).filter((memory) =>
        memory.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase())
      );
      setDisplayMemories(filtered);
    }
  };

  // Get unique tags for filter
  const allTags = [
    ...new Set(
      (memories.length > 0 ? memories : demoMemories)
        .flatMap((memory) => memory.tags)
    ),
  ];

  // Sort memories by date (newest first)
  const sortedMemories = [...displayMemories].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Group memories by year and month for timeline view
  const groupedMemories = sortedMemories.reduce((groups, memory) => {
    const date = new Date(memory.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (!groups[year]) {
      groups[year] = {};
    }
    
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    
    groups[year][month].push(memory);
    return groups;
  }, {} as Record<number, Record<number, MemoryWithStory[]>>);

  // Settings for the featured slider
  const featuredSliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: () => {
      return (
        <div className="w-3 h-3 rounded-full bg-gray-300 hover:bg-amber-400 mx-1 transition-colors duration-300"></div>
      );
    },
    dotsClass: "slick-dots custom-dots"
  };

  // Settings for the gallery slider
  const gallerySliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Sync with partner when memory is selected
  const handleViewMemory = (memory: MemoryWithStory) => {
    setSelectedMemory(memory);
    
    // Notify partner you're viewing this memory
    syncAction(ActionType.VIEW_MEMORY, {
      memoryId: memory.id,
      caption: memory.caption,
      timestamp: new Date().toISOString()
    }).catch(err => console.error("Failed to sync memory view:", err));
  };
  
  // Show notification when partner views a memory
  useEffect(() => {
    const viewActions = partnerActions.filter(
      action => action.action === ActionType.VIEW_MEMORY && !action.read
    );
    
    if (viewActions.length > 0) {
      const latestAction = viewActions[0];
      
      // Show a toast notification
      toast(`Your partner is viewing "${latestAction.payload.caption}"`, {
        icon: "❤️",
        position: "bottom-right",
      });
      
      // Mark action as read
      // (In a real app, you'd call markAsRead here)
    }
  }, [partnerActions]);

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30">
        {/* Hero section with featured memories */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-amber-900/60 z-10"></div>
          
          {/* Fixed Video Call Button */}
          <div className="absolute top-4 right-4 z-20">
            <CallButton 
              variant="icon"
              partnerId="partner-123" 
              partnerName="Your Partner" 
            />
          </div>
          
          <Slider {...featuredSliderSettings} ref={sliderRef} className="h-full">
            {sortedMemories.slice(0, 5).map((memory) => (
              <div key={memory.id} className="relative h-[70vh]">
                <div className="absolute inset-0">
                  {memory.mediaType === "image" ? (
                    <img 
                      src={memory.mediaUrl} 
                      alt={memory.caption}
                      className="w-full h-full object-cover transition-transform duration-5000 hover:scale-105"
                    />
                  ) : (
                    <video 
                      src={memory.mediaUrl} 
                      muted 
                      autoPlay 
                      loop 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 z-20">
                  <div className="animate-on-scroll opacity-0 transform translate-y-10 transition-all duration-1000">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-semibold mb-3">
                      {format(new Date(memory.date), "MMMM d, yyyy")}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 text-shadow-lg">
                      {memory.caption}
                    </h1>
                    <p className="max-w-2xl text-lg text-white/90 mb-6 line-clamp-2 text-shadow">
                      {memory.story}
                    </p>
                    <Button 
                      onClick={() => setSelectedMemory(memory)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm"
                    >
                      View Memory
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-20">
          {/* Memory Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <Button
              onClick={() => filterMemories("all")}
              variant={activeFilter === "all" ? "default" : "outline"}
              className={cn(
                "rounded-full font-medium border-2 transition-all duration-300",
                activeFilter === "all" 
                  ? "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200" 
                  : "bg-white hover:bg-amber-50 text-amber-700 border-amber-200"
              )}
            >
              All Memories
            </Button>
            
            {allTags.slice(0, 6).map((tag) => (
              <Button
                key={tag}
                onClick={() => filterMemories(tag)}
                variant={activeFilter === tag ? "default" : "outline"}
                className={cn(
                  "rounded-full font-medium border-2 transition-all duration-300",
                  activeFilter === tag 
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200" 
                    : "bg-white hover:bg-amber-50 text-amber-700 border-amber-200"
                )}
              >
                {tag}
              </Button>
            ))}
            
            <Button
              onClick={() => router.push('/journal')}
              variant="outline"
              className="rounded-full font-medium border-2 bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </Button>
          </div>

          {/* Photo Gallery Section */}
          <section className="mb-24 animate-on-scroll opacity-0 transform translate-y-10 transition-all duration-1000">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-amber-800">Photo Gallery</h2>
              <Button 
                onClick={handleFirstEntryRedirect} 
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
            </div>
            
            <div className="relative gallery-slider py-4">
              <Slider {...gallerySliderSettings} ref={gallerySliderRef}>
                {sortedMemories.filter(m => m.mediaType === "image").map((memory) => (
                  <div key={memory.id} className="px-2">
                    <div 
                      className="relative aspect-square overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 hover:shadow-xl group border-4 border-white shadow-md"
                      onClick={() => handleViewMemory(memory)}
                    >
                      <img 
                        src={memory.mediaUrl} 
                        alt={memory.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium text-shadow mb-1 truncate">{memory.caption}</h3>
                        <p className="text-white/80 text-xs text-shadow">
                          {format(new Date(memory.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </section>

          {/* Memories Timeline */}
          <section className="mb-24" ref={timelineRef}>
            <h2 className="text-3xl font-bold text-amber-800 mb-8">Memory Timeline</h2>
            
            <div className="space-y-16">
              {Object.keys(groupedMemories)
                .sort((a, b) => Number(b) - Number(a))
                .map(year => (
                  <div key={year} className="animate-on-scroll opacity-0 transform translate-y-10 transition-all duration-1000">
                    <h3 className="inline-block text-2xl font-bold mb-6 px-5 py-2 bg-amber-100 text-amber-800 rounded-full shadow-sm">
                      {year}
                    </h3>
                    
                    <div className="space-y-12">
                      {Object.keys(groupedMemories[Number(year)])
                        .sort((a, b) => Number(b) - Number(a))
                        .map(month => (
                          <div key={`${year}-${month}`} className="pl-6 border-l-2 border-amber-200">
                            <h4 className="text-xl font-semibold text-amber-700 mb-6 -ml-10 flex items-center">
                              <span className="inline-block w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 mr-2 shadow-sm">
                                <Calendar className="w-4 h-4" />
                              </span>
                              {months[Number(month)]}
                            </h4>
                            
                            <div className="grid grid-cols-1 gap-8">
                              {groupedMemories[Number(year)][Number(month)].map((memory, idx) => (
                                <div 
                                  key={memory.id}
                                  className={`relative pl-8 animate-on-scroll opacity-0 transform translate-y-10 transition-all duration-1000 delay-${idx * 100}`}
                                >
                                  <span className="absolute left-0 top-2 w-3 h-3 rounded-full bg-amber-300 shadow-amber-300 shadow-md"></span>
                                  
                                  <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-amber-100">
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                      <div 
                                        className="relative aspect-square md:aspect-auto cursor-pointer"
                                        onClick={() => handleViewMemory(memory)}
                                      >
                                        {memory.mediaType === "image" ? (
                                          <img 
                                            src={memory.mediaUrl} 
                                            alt={memory.caption}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <video 
                                            src={memory.mediaUrl} 
                                            className="w-full h-full object-cover"
                                          />
                                        )}
                                      </div>
                                      <div className="p-6 md:col-span-2">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {format(new Date(memory.date), "MMMM d, yyyy")}
                                          </span>
                                          {memory.location && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                              <MapPin className="mr-1 h-3 w-3" />
                                              {memory.location}
                                            </span>
                                          )}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-amber-800 mb-3">{memory.caption}</h3>
                                        
                                        <p className="text-amber-700/80 mb-5 line-clamp-3">
                                          {memory.story}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-3">
                                          <div className="flex flex-wrap gap-1">
                                            {memory.tags.map((tag) => (
                                              <span 
                                                key={tag} 
                                                className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium border border-amber-100"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                          <Button
                                            onClick={() => handleViewMemory(memory)}
                                            variant="outline"
                                            size="sm"
                                            className="ml-auto mt-1 text-amber-600 border-amber-200"
                                          >
                                            View Details
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
          
          {/* Add New Memory - Fixed Button */}
          <div className="fixed bottom-8 right-8 z-10">
            <Button 
              onClick={handleFirstEntryRedirect}
              className="rounded-full h-14 w-14 p-0 shadow-lg bg-amber-500 hover:bg-amber-600 flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Memory Detail Dialog */}
        <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
          {selectedMemory && (
            <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-white to-amber-50 border border-amber-100">
              <DialogHeader>
                <DialogTitle className="text-amber-800 text-2xl">{selectedMemory.caption}</DialogTitle>
                <DialogDescription className="text-amber-500 text-sm">
                  {format(new Date(selectedMemory.date), "MMMM d, yyyy")}
                  {selectedMemory.location && ` • ${selectedMemory.location}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg overflow-hidden shadow-md">
                  {selectedMemory.mediaType === "image" ? (
                    <img
                      src={selectedMemory.mediaUrl}
                      alt={selectedMemory.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video src={selectedMemory.mediaUrl} controls className="w-full h-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2 text-amber-700">Our Story</h3>
                  <p className="text-amber-600 mb-4">
                    {selectedMemory.story || "No story added for this memory."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMemory.tags && selectedMemory.tags.map((tag) => (
                      <span key={tag} className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-full border border-amber-100">
                        <Tag className="inline h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-amber-100">
                    <h4 className="font-medium text-sm text-amber-700 mb-2">Share this memory</h4>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-amber-200 text-amber-600 hover:bg-amber-50"
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx global>{`
        .animate-fade-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .text-shadow-lg {
          text-shadow: 0 3px 6px rgba(0,0,0,0.5);
        }
        
        .gallery-slider .slick-track {
          display: flex;
          padding: 2rem 0;
        }
        
        .gallery-slider .slick-slide {
          opacity: 0.5;
          transform: scale(0.9);
          transition: all 0.5s ease;
        }
        
        .gallery-slider .slick-slide.slick-active {
          opacity: 1;
          transform: scale(1);
        }
        
        .gallery-slider .slick-slide.slick-center {
          transform: scale(1.05);
          z-index: 1;
        }
        
        .slick-prev, .slick-next {
          z-index: 10;
        }
        
        .custom-dots {
          bottom: 20px;
          display: flex !important;
          justify-content: center;
          padding: 0;
          margin: 0;
        }
        
        .custom-dots li {
          margin: 0 4px;
        }
        
        .custom-dots li button:before {
          display: none;
        }
      `}</style>
    </PageLayout>
  );
}
