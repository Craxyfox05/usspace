"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore, type Memory } from "@/lib/store";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import InvitePartnerDialog from "@/components/couples/InvitePartnerDialog";
import EnhancedBirthdayCountdown from "@/components/dashboard/EnhancedBirthdayCountdown";
import GiftSuggestions from "@/components/dashboard/GiftSuggestions";
import { UserCog } from "lucide-react";
import RelationshipStreaks from "@/components/relationship/RelationshipStreaks";

export default function DashboardPage() {
  const router = useRouter();
  const { user, partner, isAuthenticated, events } = useStore();
  const [showInvitePartner, setShowInvitePartner] = useState(false);
  const [randomMemory, setRandomMemory] = useState<Memory | null>(null);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [daysToNextEvent, setDaysToNextEvent] = useState<number | null>(null);

  // Handle auth status
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Get random memory
  useEffect(() => {
    const getRandomMemory = () => {
      const memories = useStore.getState().memories;
      if (memories && memories.length > 0) {
        const randomIndex = Math.floor(Math.random() * memories.length);
        setRandomMemory(memories[randomIndex]);
      }
    };

    getRandomMemory();
    
    // Set up interval to rotate memories every 2 hours
    const interval = setInterval(getRandomMemory, 7200000);
    
    return () => clearInterval(interval);
  }, []);

  // Get next event
  useEffect(() => {
    const calculateNextEvent = () => {
      if (!events || events.length === 0) {
        setNextEvent(null);
        setDaysToNextEvent(null);
        return;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get upcoming or today's events
      const upcomingEvents = events
        .filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      if (upcomingEvents.length > 0) {
        const next = upcomingEvents[0];
        setNextEvent(next);
        
        // Calculate days
        const eventDate = new Date(next.date);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysToNextEvent(diffDays);
      } else {
        setNextEvent(null);
        setDaysToNextEvent(null);
      }
    };
    
    calculateNextEvent();
  }, [events]);

  if (!user) return null;

  return (
    <PageLayout>
      
      <div className="container max-w-7xl py-8 px-4">
        {/* Welcome and Partner Link */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold cursive">Hello, {user?.name || "Friend"}!</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening in your relationship</p>
          </div>
          
          {!partner && (
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => setShowInvitePartner(true)}>
                Connect with Partner
              </Button>
            </div>
          )}
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Relationship Profile Completion Card */}
          {!user.profileCompleted && (
            <Card className="md:col-span-2 lg:col-span-3 bg-red-50 border-red-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Complete Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className="mb-4 sm:mb-0 text-gray-600">
                    Take a moment to complete your profile to get personalized features.
                  </p>
                  <Button asChild className="whitespace-nowrap">
                    <Link href="/dashboard/survey">
                      <UserCog className="mr-2 h-4 w-4" />
                      Complete Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Relationship Status Card */}
          <Card className="md:col-span-2 overflow-hidden">
            <CardHeader className="bg-red-50 pb-0">
              <CardTitle className="text-xl font-semibold">Relationship Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                {partner ? (
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Connected with {partner.name}</h3>
                      <p className="text-gray-600">
                        You are in a relationship with {partner.name}. 
                        Share memories, plan events, and keep track of special moments together.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <RelationshipStreaks size="lg" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">No Partner Connected</h3>
                      <p className="text-gray-600">
                        Invite your partner to join UsSpace. Share memories, plan events, and track special moments together.
                      </p>
                    </div>
                    <Button onClick={() => setShowInvitePartner(true)}>
                      Connect with Partner
                    </Button>
                  </>
                )}
              </div>
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

          {/* Partner Birthday Countdown */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-red-50 pb-0">
              <CardTitle className="text-xl font-semibold">Birthday Countdown</CardTitle>
              <CardDescription>
                Only you can update your own birthday. Your partner updates theirs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-0">
              <EnhancedBirthdayCountdown type="partner" />
            </CardContent>
          </Card>

          {/* Gift Suggestions */}
          <Card className="overflow-hidden md:col-span-2">
            <CardContent className="p-0">
              <GiftSuggestions 
                forPartner={partner !== null}
                preferences={partner || undefined}
                partnerName={partner?.name || "partner"}
              />
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
                      <h3 className="font-semibold text-lg">{nextEvent.title}</h3>
                    </div>
                    <p className="text-gray-600">{format(new Date(nextEvent.date), "MMMM d, yyyy")}</p>
                    {daysToNextEvent !== null && (
                      <div className="mt-2 bg-red-50 text-red-800 py-1 px-3 rounded-full text-sm font-medium">
                        {daysToNextEvent === 0 ? "Today!" : 
                         daysToNextEvent === 1 ? "Tomorrow!" : 
                         `${daysToNextEvent} days away`}
                      </div>
                    )}
                  </div>
                  <Button asChild>
                    <Link href="/events">View All Events</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">No upcoming events.</p>
                  <Button asChild>
                    <Link href="/events">Add Event</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Invite Partner Dialog */}
        <InvitePartnerDialog 
          open={showInvitePartner} 
          onOpenChange={setShowInvitePartner}
        />
      </div>
    </PageLayout>
  );
}
