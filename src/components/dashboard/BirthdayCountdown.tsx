"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { differenceInDays, add, format, isBefore, isAfter } from "date-fns";
import { Cake, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BirthdayCountdownProps {
  birthdate?: Date | null;
  name: string;
}

const BirthdayCountdown: React.FC<BirthdayCountdownProps> = ({ birthdate, name }) => {
  const [daysUntilBirthday, setDaysUntilBirthday] = useState<number | null>(null);
  const [nextBirthdayDate, setNextBirthdayDate] = useState<Date | null>(null);
  
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
      <Card>
        <CardHeader className="bg-pink-50 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cake className="mr-2 h-5 w-5" />
            Birthday Countdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center p-4">
            <p className="mb-4 text-gray-600">
              {name === "You" ? 
                "Set your birthday to see a countdown here!" : 
                `${name}'s birthday is not set yet.`}
            </p>
            {name === "You" ? (
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
  
  return (
    <Card>
      <CardHeader className={`${daysUntilBirthday <= 30 ? 'bg-pink-100' : 'bg-pink-50'} pb-2`}>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Cake className="mr-2 h-5 w-5" />
          {name === "You" ? "Your Birthday" : `${name}'s Birthday`}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center text-center p-2">
          {daysUntilBirthday === 0 ? (
            <div className="mb-2">
              <div className="text-2xl font-bold mb-1">🎂 Today! 🎉</div>
              <p className="text-gray-600">Happy Birthday!</p>
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
          
          {daysUntilBirthday <= 30 && name !== "You" && (
            <div className="mt-2 flex items-center">
              <Gift className="h-4 w-4 mr-1 text-pink-500" />
              <span className="text-sm text-pink-600 font-medium">Time to plan a gift!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthdayCountdown; 