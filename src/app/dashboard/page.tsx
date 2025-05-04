"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useStore, type Memory } from "@/lib/store";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const { user, partner, isAuthenticated, memories, events } = useStore();
  const [randomMemory, setRandomMemory] = useState<Memory | null>(null);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get today's date
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  // Get random memory (or the first one)
  useEffect(() => {
    if (memories && memories.length > 0) {
      setRandomMemory(memories[Math.floor(Math.random() * memories.length)]);
    }
  }, [memories]);

  // Get upcoming events
  const upcomingEvents = events
    ? events
        .filter(event => new Date(event.date) > today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  // Calculate days to next event
  const daysToNextEvent = nextEvent
    ? Math.ceil((new Date(nextEvent.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Render mood emoji
  const renderMoodEmoji = (mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'tired' | 'loved' | null | undefined) => {
    switch (mood) {
      case "happy": return "😊";
      case "neutral": return "😐";
      case "sad": return "😔";
      case "excited": return "🤩";
      case "tired": return "😴";
      case "loved": return "🥰";
      default: return "❓";
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 cursive">Welcome, {user.name}!</h1>

        {/* Today's Date */}
        <div className="mb-8 text-lg text-gray-600">
          <span className="font-semibold">Today is:</span> {formattedDate}
        </div>

        {/* Couples Space Card */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 pb-0">
            <CardTitle className="text-xl font-semibold">Explore Our Couple Space 💕</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div>
                <p className="mb-4">Discover all our special features in one place - memories, games, journal, and more!</p>
                <Button asChild>
                  <Link href="/couples">Go to Couple Space</Link>
                </Button>
              </div>
              <div className="hidden sm:block">
                <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                    🎁
                  </div>
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
                    💕
                  </div>
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                    🎮
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner's Mood */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-red-50 pb-0">
              <CardTitle className="text-xl font-semibold">Partner's Mood</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {partner ? (
                <div className="flex flex-col items-center text-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={partner.avatar || ""} alt={partner.name || ""} />
                    <AvatarFallback>{partner.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-4xl mb-2">{renderMoodEmoji(partner.mood)}</div>
                    <h3 className="font-semibold mb-1">{partner.name} is feeling {partner.mood || "unknown"}</h3>
                    {partner.moodNote && (
                      <p className="text-gray-600 italic">"{partner.moodNote}"</p>
                    )}
                    {partner.moodLastUpdated && (
                      <p className="text-xs text-gray-500 mt-2">
                        Updated {format(new Date(partner.moodLastUpdated), "h:mm a")}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" asChild className="mt-2">
                    <Link href="/mood">Update Your Mood</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">You haven't connected with your partner yet.</p>
                  <Button variant="outline">Invite Partner</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Memory of the Day */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-red-50 pb-0">
              <CardTitle className="text-xl font-semibold">Memory of the Day</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {randomMemory ? (
                <div className="w-full rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={randomMemory.mediaUrl}
                    alt={randomMemory.caption}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="text-center text-gray-700 text-base mt-2">{randomMemory.caption}</div>
                </div>
              ) : (
                <div className="text-gray-400">No memories yet</div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Event */}
          <Card className="md:col-span-2 overflow-hidden">
            <CardHeader className="bg-red-50 pb-0">
              <CardTitle className="text-xl font-semibold">Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {nextEvent ? (
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {nextEvent.type === "birthday" ? "🎂" :
                         nextEvent.type === "anniversary" ? "💍" : "🎉"}
                      </span>
                      <h3 className="text-xl font-semibold">{nextEvent.title}</h3>
                    </div>
                    <p className="text-gray-600">
                      {format(new Date(nextEvent.date), "MMMM d, yyyy")}
                    </p>
                    {nextEvent.description && (
                      <p className="text-gray-600 mt-2 italic">"{nextEvent.description}"</p>
                    )}
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-3xl font-bold text-red-500">{daysToNextEvent}</div>
                    <p className="text-gray-600">days to go</p>
                    <Button variant="outline" asChild className="mt-4">
                      <Link href="/events">View Calendar</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">No upcoming events. Add your first special date!</p>
                  <Button variant="outline" asChild>
                    <Link href="/events">Add Event</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
