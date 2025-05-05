"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useStore, type Memory, type MediaType } from "@/lib/store";
import { format } from "date-fns";
import { toast } from "sonner";
import { Heart, Calendar, MapPin, Tag, BookOpen, Camera, ArrowLeft } from "lucide-react";

export default function NewMemoryPage() {
  const router = useRouter();
  const { isAuthenticated, addMemory } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [memory, setMemory] = useState({
    mediaUrl: "",
    mediaType: "image" as MediaType,
    caption: "",
    date: format(new Date(), "yyyy-MM-dd"),
    location: "",
    tags: "",
    story: "",
  });

  // Auth check and initialize from stored data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if we have saved data in localStorage
    const savedData = localStorage.getItem('newJournalEntry');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setMemory(parsedData);
      } catch (error) {
        console.error("Error parsing saved memory data:", error);
      }
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMemory({
      ...memory,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Update memory state
      setMemory({
        ...memory,
        mediaUrl: url,
        mediaType: selectedFile.type.startsWith("video") ? "video" : "image",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Process tags from comma-separated string to array
      const tagsArray = memory.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // In a real app, you'd upload the file to storage and get a URL
      // For demo, we're just using the local URL or a placeholder
      
      const finalUrl = memory.mediaUrl || "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGNvdXBsZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
      
      // Extract story separately since our type doesn't include it
      const { story, ...memoryData } = {
        ...memory,
        mediaUrl: finalUrl,
        date: new Date(memory.date),
        tags: tagsArray,
      };

      // Add to store
      addMemory(memoryData);
      
      // Clean up
      localStorage.removeItem('newJournalEntry');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      toast.success("Memory added successfully!");
      
      // Navigate back to memories
      router.push("/memories");
    } catch (error) {
      console.error("Error adding memory:", error);
      toast.error("Failed to add memory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2 text-amber-700" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-amber-800">Create New Memory</h1>
          </div>
          
          <Card className="border-amber-100 shadow-md bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-800 text-xl">Capture Your Special Moment</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Media Upload */}
                <div className="space-y-2">
                  <Label htmlFor="media" className="text-amber-700 font-medium">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Add Photo or Video
                  </Label>
                  
                  <div className="flex flex-col space-y-3">
                    <Input
                      id="media"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="border-amber-200 text-amber-700"
                    />
                    
                    {previewUrl && (
                      <div className="mt-4 rounded-lg overflow-hidden border-4 border-white shadow-md max-w-md mx-auto">
                        {memory.mediaType === "image" ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-auto max-h-64 object-cover"
                          />
                        ) : (
                          <video
                            src={previewUrl}
                            controls
                            className="w-full h-auto max-h-64 object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Caption */}
                <div className="space-y-2">
                  <Label htmlFor="caption" className="text-amber-700 font-medium">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Caption
                  </Label>
                  <Input
                    id="caption"
                    name="caption"
                    value={memory.caption}
                    onChange={handleInputChange}
                    placeholder="Give your memory a title..."
                    required
                    className="border-amber-200 text-amber-700"
                  />
                </div>
                
                {/* Date & Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-amber-700 font-medium">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={memory.date}
                      onChange={handleInputChange}
                      required
                      className="border-amber-200 text-amber-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-amber-700 font-medium">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={memory.location}
                      onChange={handleInputChange}
                      placeholder="Where did this happen?"
                      className="border-amber-200 text-amber-700"
                    />
                  </div>
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-amber-700 font-medium">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={memory.tags}
                    onChange={handleInputChange}
                    placeholder="Separate tags with commas (e.g. Anniversary, Beach, Sunset)"
                    className="border-amber-200 text-amber-700"
                  />
                  <p className="text-xs text-amber-500 italic">
                    Separate multiple tags with commas
                  </p>
                </div>
                
                {/* Story */}
                <div className="space-y-2">
                  <Label htmlFor="story" className="text-amber-700 font-medium">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Your Story
                  </Label>
                  <Textarea
                    id="story"
                    name="story"
                    value={memory.story}
                    onChange={handleInputChange}
                    placeholder="Tell the story behind this memory..."
                    rows={5}
                    className="border-amber-200 text-amber-700 min-h-[120px]"
                  />
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    {isLoading ? "Saving..." : "Save Memory"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
} 