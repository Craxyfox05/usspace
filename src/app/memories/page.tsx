"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore, type Memory, type MediaType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Demo memory images and videos
const demoMemories = [
  {
    id: "mem1",
    mediaUrl: "https://images.unsplash.com/photo-1535961652354-923cb08225a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y291cGxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Our first date at the beach",
    date: new Date("2023-06-15"),
    location: "Malibu Beach",
    tags: ["First Date", "Beach"],
  },
  {
    id: "mem2",
    mediaUrl: "https://images.unsplash.com/photo-1525361767652-55d954f0536b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvdXBsZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Weekend getaway in the mountains",
    date: new Date("2023-08-22"),
    location: "Blue Ridge Mountains",
    tags: ["Vacation", "Mountains"],
  },
  {
    id: "mem3",
    mediaUrl: "https://images.unsplash.com/photo-1516589091380-5d8e87df8a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGNvdXBsZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    mediaType: "image" as const,
    caption: "Our anniversary dinner",
    date: new Date("2024-01-30"),
    location: "Italian Restaurant",
    tags: ["Anniversary", "Dinner"],
  },
  {
    id: "mem4",
    mediaUrl: "https://mazwai.com/videvo_files/video/free/2014-06/small_watermarked/james_brunt--british_columbia_preview.webm",
    mediaType: "video" as const,
    caption: "Our hiking adventure video",
    date: new Date("2024-03-15"),
    location: "National Park",
    tags: ["Adventure", "Hiking", "Video"],
  },
];

const doodles = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    className: "absolute top-0 left-0 w-24 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    className: "absolute top-10 right-0 w-20 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    className: "absolute bottom-0 left-10 w-24 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80",
    className: "absolute bottom-5 right-5 w-20 opacity-10 -z-10 rounded-full"
  }
];

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function MemoriesPage() {
  const router = useRouter();
  const { isAuthenticated, memories, addMemory } = useStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({
    mediaUrl: "",
    mediaType: "image" as MediaType,
    caption: "",
    date: format(new Date(), "yyyy-MM-dd"),
    location: "",
    tags: "",
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayMemories, setDisplayMemories] = useState<Memory[]>(demoMemories);
  const [file, setFile] = useState<File | null>(null);
  const [throwback, setThrowback] = useState<Memory | null>(null);

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
      setThrowback(memories[Math.floor(new Date().getDate() % memories.length)]);
    }
  }, [memories]);

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMemory({
      ...newMemory,
      [name]: value,
    });
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tagsArray = newMemory.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // Add memory to store
      addMemory({
        mediaUrl: newMemory.mediaUrl || "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGNvdXBsZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        mediaType: newMemory.mediaType,
        caption: newMemory.caption,
        date: new Date(newMemory.date),
        location: newMemory.location,
        tags: tagsArray,
      });

      // Reset form
      setNewMemory({
        mediaUrl: "",
        mediaType: "image" as MediaType,
        caption: "",
        date: format(new Date(), "yyyy-MM-dd"),
        location: "",
        tags: "",
      });

      // Close dialog
      setAddDialogOpen(false);

      // Show success message
      toast.success("Memory added successfully!");
    } catch (error) {
      console.error("Error adding memory:", error);
      toast.error("Failed to add memory. Please try again.");
    }
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

  // Handle file upload (simulate, as real upload needs backend)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // For demo, use a local URL
      setNewMemory({
        ...newMemory,
        mediaUrl: URL.createObjectURL(e.target.files[0]),
        mediaType: e.target.files[0].type.startsWith("video") ? "video" : "image",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Doodle Backgrounds */}
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}

      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Journey</h1>

        {/* Throwback of the Day */}
        {throwback && (
          <div className="mb-10 p-6 rounded-xl border border-gray-200 bg-white/80 shadow flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Throwback of the Day</div>
            {throwback.mediaType === "image" ? (
              <Image src={throwback.mediaUrl} alt={throwback.caption} width={400} height={300} className="rounded-lg object-cover w-full max-h-64" />
            ) : (
              <video src={throwback.mediaUrl} controls className="rounded-lg w-full max-h-64" />
            )}
            <div className="mt-2 text-center">
              <div className="font-medium">{throwback.caption}</div>
              <div className="text-sm text-gray-500">{format(new Date(throwback.date), "MMMM d, yyyy")} {throwback.location && `• ${throwback.location}`}</div>
            </div>
          </div>
        )}

        {/* Upload New Memory */}
        <form onSubmit={handleAddMemory} className="mb-12 p-6 rounded-xl border border-gray-200 bg-white/80 shadow flex flex-col gap-4">
          <div className="font-semibold mb-2">Add a New Memory</div>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="mb-2" />
          <input type="text" name="caption" placeholder="Caption" value={newMemory.caption} onChange={handleInputChange} className="border rounded px-3 py-2" required />
          <input type="date" name="date" value={newMemory.date} onChange={handleInputChange} className="border rounded px-3 py-2" required />
          <input type="text" name="location" placeholder="Location" value={newMemory.location} onChange={handleInputChange} className="border rounded px-3 py-2" />
          <button type="submit" className="bg-black text-white rounded px-4 py-2 font-semibold hover:bg-gray-800 transition">Save Memory</button>
        </form>

        {/* Timeline Memories */}
        <div className="relative border-l-2 border-gray-200 pl-6">
          {memories && memories.length > 0 ? (
            memories.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((memory, idx) => (
              <div key={memory.id} className="mb-10 flex items-start group">
                <div className="w-4 h-4 bg-red-200 rounded-full border-2 border-white shadow absolute -left-2 mt-2" />
                <div className="ml-6 flex-1 bg-white/90 rounded-lg shadow p-4 border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    {memory.mediaType === "image" ? (
                      <Image src={memory.mediaUrl} alt={memory.caption} width={180} height={120} className="rounded-lg object-cover w-44 h-28" />
                    ) : (
                      <video src={memory.mediaUrl} controls className="rounded-lg w-44 h-28 object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{memory.caption}</div>
                      <div className="text-sm text-gray-500 mb-1">{format(new Date(memory.date), "MMMM d, yyyy")} {memory.location && `• ${memory.location}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">No memories yet. Start adding your moments!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
