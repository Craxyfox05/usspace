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

export default function CouplesPage() {
  const router = useRouter();
  const { user, partner, isAuthenticated, memories, events } = useStore();

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

  return (
    <PageLayout>
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 cursive">Our Couple Space 💕</h1>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="gallery">Memory Gallery</TabsTrigger>
            <TabsTrigger value="dates">Important Dates</TabsTrigger>
            <TabsTrigger value="mood">Mood & Chat</TabsTrigger>
            <TabsTrigger value="games">Mini Games</TabsTrigger>
            <TabsTrigger value="journal">Shared Journal</TabsTrigger>
          </TabsList>

          {/* Memory Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Our Journey</h2>
              <Link href="/memories">
                <Button variant="outline">View All Memories</Button>
              </Link>
            </div>

            {/* Throwback of the day */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">✨</span> Throwback of the Day
                </CardTitle>
                <CardDescription>Relive a special moment together</CardDescription>
              </CardHeader>
              <CardContent>
                {randomMemory ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={randomMemory.mediaUrl || "https://images.unsplash.com/photo-1517230878791-4d28214057c2"}
                          alt={randomMemory.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="text-xl font-medium mb-2">{randomMemory.caption}</h3>
                      <p className="text-gray-500 mb-4">
                        {format(new Date(randomMemory.date), "MMMM d, yyyy")}
                        {randomMemory.location && ` • ${randomMemory.location}`}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {randomMemory.tags && randomMemory.tags.map((tag) => (
                          <span key={tag} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No memories yet. Start creating memories together!</p>
                    <Link href="/memories">
                      <Button className="mt-4">Add Your First Memory</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Important Dates Tab */}
          <TabsContent value="dates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <Link href="/events">
                <Button variant="outline">View All Events</Button>
              </Link>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming events. Add some special dates!</p>
                <Link href="/events">
                  <Button className="mt-4">Add New Event</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Mood & Chat Tab */}
          <TabsContent value="mood" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Mood</CardTitle>
                  <CardDescription>How are you feeling today?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">
                        {user.mood ? `Feeling ${user.mood}` : "No mood set"}
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
                <CardHeader>
                  <CardTitle>Quick Chat</CardTitle>
                  <CardDescription>Send a quick message to your partner</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={partner?.avatar} alt={partner?.name || ""} />
                        <AvatarFallback>{partner?.name?.charAt(0) || "P"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{partner?.name || "Your Partner"}</h3>
                        <p className="text-sm text-gray-500">
                          {partner?.mood ? `Feeling ${partner.mood}` : "No mood set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/chat">
                    <Button>Start Chatting</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Mini Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <h2 className="text-2xl font-semibold">Fun Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Truth or Dare</CardTitle>
                  <CardDescription>Test your knowledge about each other</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Take turns asking each other questions or daring each other to do something fun!
                  </p>
                  <Link href="/games/truth-or-dare">
                    <Button>Play Now</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memory Quiz</CardTitle>
                  <CardDescription>Test your memory about special moments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Answer questions about your relationship and see how well you remember!
                  </p>
                  <Link href="/games/memory-quiz">
                    <Button>Start Quiz</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shared Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Our Journal</h2>
              <Link href="/journal">
                <Button variant="outline">View All Entries</Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Latest Entry</CardTitle>
                <CardDescription>Your most recent journal entry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No journal entries yet. Start writing your story together!</p>
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
