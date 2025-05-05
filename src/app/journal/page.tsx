"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore, type Memory, type MediaType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import CallButton from "@/components/VideoCall/CallButton";

// Extended Memory type to include story
interface MemoryWithStory extends Omit<Memory, 'id'> {
  id?: string;
  story?: string;
}

export default function JournalPage() {
  const router = useRouter();
  const { isAuthenticated, memories, addMemory } = useStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayMemories, setDisplayMemories] = useState<MemoryWithStory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithStory | null>(null);

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
      // Use demo data if no memories exist
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
        }
      ];
      setDisplayMemories(demoMemories);
    }
  }, [memories]);

  if (!isAuthenticated) {
    return null;
  }

  const handleFirstEntryRedirect = () => {
    // Store the default memory state in localStorage for the new entry page
    localStorage.setItem('newJournalEntry', JSON.stringify({
      mediaUrl: "",
      mediaType: "image",
      caption: "",
      date: format(new Date(), "yyyy-MM-dd"),
      location: "",
      tags: "",
      story: "",
    }));
    // Redirect to the new entry page
    router.push('/memories/new');
  };

  const filterMemories = (filter: string) => {
    setActiveFilter(filter);

    if (filter === "all") {
      setDisplayMemories(memories.length > 0 ? memories : displayMemories);
    } else {
      const filtered = (memories.length > 0 ? memories : displayMemories).filter((memory) =>
        memory.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase())
      );
      setDisplayMemories(filtered);
    }
  };

  // Get unique tags for filter
  const allTags = [
    ...new Set(
      displayMemories.flatMap((memory) => memory.tags)
    ),
  ];

  return (
    <PageLayout>
      <div className="container max-w-7xl mx-auto pt-12 pb-16 px-4 bg-gradient-to-b from-pink-50/50 to-white rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent">
            Shared Journal
          </h1>
          <CallButton 
            variant="outline" 
            partnerId="partner-123" 
            partnerName="Your Partner" 
            className="mr-2"
          />
        </div>
        <p className="text-lg text-center text-pink-500 mb-16 max-w-2xl mx-auto font-light">
          Capturing our story, one moment at a time
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area - Current Journal */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pink-800">Our Journal</h2>
              <Button 
                onClick={() => router.push('/all-entries')} 
                variant="outline" 
                className="text-pink-600 border-pink-200 hover:bg-pink-50"
              >
                View All Entries
              </Button>
            </div>
            
            {/* Latest Entry */}
            <div>
              <h3 className="text-xl font-semibold text-pink-700 mb-3">Latest Entry</h3>
              <p className="text-sm text-pink-400 mb-4">Your most recent journal entry</p>
              
              {/* Featured Memory Entry */}
              <div className="rounded-2xl overflow-hidden bg-white shadow-md border border-pink-100">
                {displayMemories.length > 0 ? (
                  <div className="relative">
                    {/* Main Journal Entry Image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      {displayMemories[0].mediaType === "image" ? (
                        <img 
                          src={displayMemories[0].mediaUrl} 
                          alt={displayMemories[0].caption} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <video 
                          src={displayMemories[0].mediaUrl} 
                          controls 
                          className="w-full h-full object-cover"
                        ></video>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 to-transparent opacity-40"></div>
                    </div>
                    
                    {/* Featured Journal Content */}
                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-pink-400">
                        <span>{format(new Date(displayMemories[0].date), "MMMM d, yyyy")}</span>
                        {displayMemories[0].location && (
                          <span className="before:content-['•'] before:mx-2 text-pink-400">
                            {displayMemories[0].location}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-3xl font-bold text-pink-800">{displayMemories[0].caption}</h2>
                      
                      {displayMemories[0].story && (
                        <p className="text-pink-700/80 text-lg leading-relaxed">
                          {displayMemories[0].story}
                        </p>
                      )}
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {displayMemories[0].tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-medium border border-pink-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-gradient-to-r from-pink-50 to-red-50">
                    <p className="text-lg text-pink-500 mb-6">No journal entries yet. Start writing your story together!</p>
                    <Button 
                      onClick={handleFirstEntryRedirect} 
                      className="bg-pink-500 hover:bg-pink-600 px-6 py-3 text-lg shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Write First Entry
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add New Entry Button - Fixed at bottom */}
            <div className="fixed bottom-8 right-8 z-10">
              <Button 
                onClick={handleFirstEntryRedirect}
                className="rounded-full h-14 w-14 p-0 shadow-lg bg-pink-500 hover:bg-pink-600 flex items-center justify-center"
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
          
          {/* Right Sidebar - Memory Archive */}
          <div className="lg:col-span-4">
            <div className="sticky top-20">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 mb-8 border border-pink-100/80 shadow-sm">
                <h3 className="text-lg font-medium text-pink-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Recent Entries
                </h3>
                
                <div className="space-y-3">
                  {displayMemories.slice(1, 5).map((memory) => (
                    <div 
                      key={memory.id} 
                      className="flex gap-3 p-2 hover:bg-white rounded-lg transition-colors duration-200 cursor-pointer group border border-transparent hover:border-pink-100"
                      onClick={() => setSelectedMemory(memory)}
                    >
                      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden shadow-sm">
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-pink-700 text-sm truncate group-hover:text-pink-600">{memory.caption}</h4>
                        <p className="text-xs text-pink-400">{format(new Date(memory.date), "MMM d, yyyy")}</p>
                        <p className="text-xs text-pink-500 line-clamp-1 mt-1">{memory.story}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {displayMemories.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 text-sm border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                  >
                    View All Entries
                  </Button>
                )}
              </div>
              
              {/* Browse by Tags */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-pink-100/80 shadow-sm">
                <h3 className="text-lg font-medium text-pink-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Browse by Tags
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      onClick={() => filterMemories(tag)}
                      variant={activeFilter === tag ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full text-xs",
                        activeFilter === tag 
                          ? "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200" 
                          : "bg-white hover:bg-pink-50 text-pink-600 border-pink-200"
                      )}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Memory Detail Dialog */}
        <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
          {selectedMemory && (
            <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-white to-pink-50 border border-pink-100">
              <DialogHeader>
                <DialogTitle className="text-pink-800">{selectedMemory.caption}</DialogTitle>
                <DialogDescription className="text-pink-500">
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
                  <h3 className="font-medium text-lg mb-2 text-pink-700">Our Story</h3>
                  <p className="text-pink-600 mb-4">
                    {selectedMemory.story || "No story added for this memory."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMemory.tags && selectedMemory.tags.map((tag) => (
                      <span key={tag} className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full border border-pink-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </PageLayout>
  );
} 