"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarHeart, Camera, MessageCircleHeart, Gamepad2, BookHeart } from "lucide-react";

export default function CouplesPage() {
  const router = useRouter();
  const { user, partner, isAuthenticated, memories, events } = useStore();
  const [activeTab, setActiveTab] = useState("gallery");

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "games") {
      // Navigate to games page directly
      router.push("/games");
    } else {
      setActiveTab(value);
    }
  };

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get random memory for "Throwback of the day"
  const randomMemory = memories && memories.length > 0
    ? memories[Math.floor(Math.random() * memories.length)]
    : null;

  // Get upcoming events
  const today = new Date();
  const upcomingEvents = events
    ? events
        .filter(event => new Date(event.date) > today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3) // Get top 3 upcoming events
    : [];
    
  // Calculate days together if there's a relationship anniversary event
  const anniversaryEvent = events?.find(e => e.type === 'first-date' || e.type === 'anniversary');
  const daysTogether = anniversaryEvent 
    ? Math.floor((today.getTime() - new Date(anniversaryEvent.date).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <PageLayout>
      <div className="container max-w-6xl py-8 px-4">
        <div className="bg-slate-100 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold">Welcome to Your Couple Space, {user.name}!</h1>
          <p className="text-gray-600">
            {daysTogether ? `You and ${partner?.name || 'your partner'} have been together for ${daysTogether} days` : 'Your personalized space to nurture your relationship'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="gallery" className="flex items-center gap-2"><Camera className="h-4 w-4" /> Memories</TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center gap-2"><CalendarHeart className="h-4 w-4" /> Important Dates</TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2"><MessageCircleHeart className="h-4 w-4" /> Connect</TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2"><Gamepad2 className="h-4 w-4" /> Mini Games</TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2"><BookHeart className="h-4 w-4" /> Journal</TabsTrigger>
          </TabsList>

          {/* Memory Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Our Journey Together</h2>
              <Link href="/memories">
                <Button variant="outline">View All Memories</Button>
              </Link>
            </div>

            {/* Throwback of the day */}
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle>
                  <span className="mr-2">✨</span> Moment to Cherish
                </CardTitle>
                <CardDescription>A special memory from your journey together</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {randomMemory ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={randomMemory.mediaUrl || "https://images.unsplash.com/photo-1517230878791-4d28214057c2"}
                          alt={randomMemory.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="text-xl font-medium mb-2">{randomMemory.caption}</h3>
                      <p className="text-gray-600 mb-4">
                        {format(new Date(randomMemory.date), "MMMM d, yyyy")}
                        {randomMemory.location && ` • ${randomMemory.location}`}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {randomMemory.tags && randomMemory.tags.map((tag) => (
                          <span key={tag} className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No memories yet. Start creating your story together!</p>
                    <Link href="/memories">
                      <Button className="mt-4">Create First Memory</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Important Dates Tab */}
          <TabsContent value="dates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Special Moments Ahead</h2>
              <Link href="/events">
                <Button variant="outline">View Calendar</Button>
              </Link>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="bg-slate-50 border-b">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming events. Add special dates to celebrate together!</p>
                <Link href="/events">
                  <Button className="mt-4">Add Special Date</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Mood & Chat Tab */}
          <TabsContent value="mood" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Section */}
              <Card>
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle>How Are You Feeling?</CardTitle>
                  <CardDescription>Share your mood with your partner</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-slate-100">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">
                        {user.mood ? `Feeling ${user.mood}` : "No mood set yet"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/mood">
                    <Button>Update Mood</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Chat Section */}
              <Card>
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle>Send Love Notes</CardTitle>
                  <CardDescription>Message your partner anytime, anywhere</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2">
                        <AvatarImage src={partner?.avatar} alt={partner?.name || ""} />
                        <AvatarFallback className="bg-slate-100">{partner?.name?.charAt(0) || "P"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{partner?.name || "Your Partner"}</h3>
                        <p className="text-sm text-gray-600">
                          {partner?.mood ? `Feeling ${partner.mood}` : "No mood set yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/chat">
                    <Button variant="default">Start Chatting</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* We don't need TabsContent for "games" anymore as it redirects to the games page */}

          {/* Shared Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Our Story Together</h2>
              <Link href="/journal">
                <Button variant="outline">All Journal Entries</Button>
              </Link>
            </div>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle>Today's Chapter</CardTitle>
                <CardDescription>Write about your feelings, thoughts, and dreams</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">Your story is waiting to be written. Start your shared journey in words!</p>
                  <Link href="/journal">
                    <Button className="mt-4">Write First Entry</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
