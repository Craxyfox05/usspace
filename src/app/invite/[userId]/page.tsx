"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { toast } from "sonner";

export default function InvitePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { isAuthenticated, user, setPartner } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inviterName, setInviterName] = useState("");
  
  // In a real app, we would fetch the inviter's info from the database
  // using the userId from params
  useEffect(() => {
    // Simulate fetching inviter data
    const fetchInviter = async () => {
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demo
      setInviterName("Jamie");
    };
    
    fetchInviter();
  }, [params.userId]);
  
  const handleAcceptInvite = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would connect the users in the database
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If the user is logged in, connect them as partners
      if (isAuthenticated && user) {
        // Create a fake partner for demo purposes
        setPartner({
          id: params.userId,
          name: inviterName,
          avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Jamie",
          mood: "happy",
          moodNote: "Can't wait to share memories with you!",
          moodLastUpdated: new Date(),
        });
        
        toast.success("You've successfully connected with your partner!");
        router.push("/couples");
      } else {
        // If not logged in, redirect to signup
        router.push("/signup?invite=" + params.userId);
      }
    } catch (error) {
      toast.error("Failed to accept invitation. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Partner Invitation</CardTitle>
          <CardDescription>
            {inviterName ? `${inviterName} has invited you to connect` : 'You have been invited to connect'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="my-6">
            <p className="text-lg">
              Join UsSpace to create a special space for your relationship and share moments together.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            onClick={handleAcceptInvite} 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Accept Invitation"}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            <Link href="/" className="hover:underline">
              No thanks, take me to the homepage
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 