"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { differenceInDays, add, format, isBefore, isAfter } from "date-fns";
import { Cake, Gift, Calendar, Heart, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface EnhancedBirthdayCountdownProps {
  type: "user" | "partner";
  compact?: boolean;
}

const EnhancedBirthdayCountdown = ({ type, compact = false }: EnhancedBirthdayCountdownProps) => {
  const { user, partner } = useStore();
  const [daysUntilBirthday, setDaysUntilBirthday] = useState<number | null>(null);
  const [nextBirthdayDate, setNextBirthdayDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const profileData = type === "user" ? user : partner;
  const name = type === "user" ? "Your" : partner?.name ? `${partner.name}'s` : "Partner's";
  const birthdate = profileData?.birthdate ? new Date(profileData.birthdate) : null;
  
  const isToday = daysUntilBirthday === 0;
  
  useEffect(() => {
    if (!birthdate) return;
    
    const calculateNextBirthday = () => {
      const today = new Date();
      
      // Get birthday for this year
      const birthdayThisYear = new Date(
        today.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate()
      );
      
      // Get birthday for next year
      const birthdayNextYear = new Date(
        today.getFullYear() + 1,
        birthdate.getMonth(),
        birthdate.getDate()
      );
      
      // Determine if this year's birthday has passed
      const nextBirthday = isAfter(birthdayThisYear, today) ? birthdayThisYear : birthdayNextYear;
      
      // Calculate days remaining
      const daysRemaining = differenceInDays(nextBirthday, today);
      
      setDaysUntilBirthday(daysRemaining);
      setNextBirthdayDate(nextBirthday);
    };
    
    calculateNextBirthday();
    
    // Update the countdown every day
    const interval = setInterval(calculateNextBirthday, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, [birthdate]);
  
  // If no birthdate is set or calculation isn't done yet
  if (!birthdate || daysUntilBirthday === null || nextBirthdayDate === null) {
    return (
      <Card className={compact ? "h-full" : ""}>
        <CardHeader className="bg-pink-50 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cake className="mr-2 h-5 w-5" />
            {name} Birthday
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center p-4">
            <p className="mb-4 text-gray-600">
              {type === "user" ? 
                "Set your birthday to see a countdown here!" : 
                `${name} birthday is not set yet.`}
            </p>
            {type === "user" ? (
              <Button variant="outline" asChild>
                <Link href="/settings">Update Profile</Link>
              </Button>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Only your partner can update their birthday in their profile settings.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Function to generate gift ideas based on interests
  const generateGiftIdeas = () => {
    const ideas: string[] = [];
    
    // Add from hobbies
    if (profileData?.hobbies?.length) {
      profileData.hobbies.forEach(hobby => {
        if (hobby === "Reading") ideas.push("Books", "E-reader", "Reading lamp");
        if (hobby === "Gaming") ideas.push("Video games", "Gaming accessories", "Gaming subscription");
        if (hobby === "Cooking") ideas.push("Cooking utensils", "Recipe books", "Cooking classes");
        if (hobby === "Sports") ideas.push("Sports equipment", "Team merchandise", "Fitness tracker");
        if (hobby === "Hiking") ideas.push("Hiking boots", "Backpack", "Outdoor gear");
        if (hobby === "Photography") ideas.push("Camera accessories", "Photo album", "Camera bag");
        if (hobby === "Art") ideas.push("Art supplies", "Art classes", "Museum tickets");
        if (hobby === "Music") ideas.push("Concert tickets", "Music subscription", "Headphones");
        // Add more based on other hobbies
      });
    }
    
    // Add from food preferences
    if (profileData?.foodPreferences?.length) {
      profileData.foodPreferences.forEach(food => {
        ideas.push(`${food} restaurant gift card`, `${food} cookbook`);
      });
    }
    
    // Add from favorite colors if available
    if (profileData?.favoriteColors?.length) {
      const colors = profileData.favoriteColors;
      colors.forEach(color => {
        ideas.push(`${color} clothing`, `${color} accessories`);
      });
    }
    
    // Add wishlist items directly
    if (profileData?.wishlist?.length) {
      profileData.wishlist.forEach(item => {
        ideas.push(item);
      });
    }
    
    // Generic ideas as fallback
    if (ideas.length < 5) {
      const genericIdeas = [
        "Gift card", "Custom photo frame", "Personalized calendar",
        "Subscription box", "Smart home device", "Wellness products",
        "Tech accessories", "Experience gift", "Gourmet food basket"
      ];
      
      genericIdeas.forEach(idea => {
        if (!ideas.includes(idea) && ideas.length < 10) {
          ideas.push(idea);
        }
      });
    }
    
    return ideas.slice(0, 10); // Return top 10 ideas
  };
  
  return (
    <>
      <Card 
        className={`${compact ? "h-full" : ""} ${isToday ? "border-2 border-yellow-400" : ""} hover:shadow-md transition-shadow cursor-pointer`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className={`${daysUntilBirthday <= 30 ? 'bg-pink-100' : 'bg-pink-50'} pb-2 relative`}>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cake className="mr-2 h-5 w-5" />
            {name} Birthday
          </CardTitle>
          {daysUntilBirthday <= 30 && (
            <Badge variant="outline" className="absolute top-2 right-4 bg-pink-200 text-pink-800 border-none">
              Coming soon!
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-4 relative">
          <div className="flex flex-col items-center text-center p-2">
            {isToday ? (
              <div className="mb-2 relative">
                <div className="text-2xl font-bold mb-1">🎂 Today! 🎉</div>
                <p className="text-gray-600">Happy Birthday!</p>
                
                {/* Moon image for birthday */}
                <div className="absolute -top-8 -right-8 w-16 h-16 animate-pulse">
                  <Image 
                    src="/images/moon.svg" 
                    alt="Birthday Moon" 
                    width={64} 
                    height={64}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-pink-500 mb-1">{daysUntilBirthday}</div>
                  <p className="text-gray-600 text-sm">days until birthday</p>
                </div>
                <p className="text-gray-600 mb-2">
                  {format(nextBirthdayDate, "MMMM d, yyyy")}
                </p>
              </>
            )}
            
            {daysUntilBirthday <= 30 && type === "partner" && (
              <div className="mt-2 flex items-center">
                <Gift className="h-4 w-4 mr-1 text-pink-500" />
                <span className="text-sm text-pink-600 font-medium">Time to plan a gift!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed birthday information dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="flex items-center gap-2">
                <Cake className="h-5 w-5 text-pink-500" />
                <span>{name} Birthday Profile</span>
              </div>
            </DialogTitle>
            <DialogDescription>
              {isToday 
                ? "Today is the special day! 🎉"
                : `${daysUntilBirthday} days until ${name.toLowerCase()} birthday on ${format(nextBirthdayDate, "MMMM d, yyyy")}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            {/* Birthday countdown and profile */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">Age</h3>
                <p className="text-sm text-gray-500">
                  {birthdate ? `Turning ${nextBirthdayDate.getFullYear() - birthdate.getFullYear()}` : "Not specified"}
                </p>
              </div>
              
              {isToday && (
                <div className="w-16 h-16">
                  <Image 
                    src="/images/moon.svg" 
                    alt="Birthday Moon" 
                    width={64} 
                    height={64}
                  />
                </div>
              )}
            </div>
            
            {/* Interests */}
            <div>
              <h3 className="font-medium flex items-center mb-2">
                <Heart className="h-4 w-4 mr-1 text-red-500" />
                <span>Interests & Likes</span>
              </h3>
              <div className="flex flex-wrap gap-1">
                {profileData?.hobbies?.length ? (
                  profileData.hobbies.map((hobby, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
                      {hobby}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No interests specified</p>
                )}
              </div>
            </div>
            
            {/* Food Preferences */}
            <div>
              <h3 className="font-medium mb-2">Food Preferences</h3>
              <div className="flex flex-wrap gap-1">
                {profileData?.foodPreferences?.length ? (
                  profileData.foodPreferences.map((food, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                      {food}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No food preferences specified</p>
                )}
              </div>
            </div>
            
            {/* Wishlist */}
            <div>
              <h3 className="font-medium flex items-center mb-2">
                <ShoppingBag className="h-4 w-4 mr-1 text-blue-500" />
                <span>Wishlist</span>
              </h3>
              {profileData?.wishlist?.length ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {profileData.wishlist.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No wishlist items specified</p>
              )}
            </div>
            
            {/* Gift Suggestions */}
            <div>
              <h3 className="font-medium flex items-center mb-2">
                <Gift className="h-4 w-4 mr-1 text-purple-500" />
                <span>Gift Suggestions</span>
              </h3>
              <div className="max-h-40 overflow-y-auto pr-2">
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {generateGiftIdeas().map((idea, index) => (
                    <li key={index}>{idea}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            {type === "user" ? (
              <Button asChild>
                <Link href="/settings">Update Profile</Link>
              </Button>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Only your partner can update their birthday in their profile settings.
              </p>
            )}
          </DialogFooter>
          
          <div className="flex justify-between mt-4">
            <Button variant="ghost" size="sm">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedBirthdayCountdown; 