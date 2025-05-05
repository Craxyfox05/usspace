"use client";

import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const moodOptions = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "sad", emoji: "😔", label: "Sad" },
  { value: "excited", emoji: "🤩", label: "Excited" },
  { value: "tired", emoji: "😴", label: "Tired" },
  { value: "loved", emoji: "🥰", label: "Loved" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "anxious", emoji: "😰", label: "Anxious" },
  { value: "relaxed", emoji: "😌", label: "Relaxed" }
];

export default function GuessTheMood() {
  const { user, partner, addGameResult } = useStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [actualMood, setActualMood] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  // In a real app, this would come from your backend or real-time database
  const partnerCurrentMood = partner?.mood || "happy"; // Default to happy if no mood set

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    
    // Show the actual mood after a short delay
    setTimeout(() => {
      setActualMood(partnerCurrentMood);
      
      const isCorrect = mood === partnerCurrentMood;
      
      if (isCorrect) {
        toast.success("You guessed correctly! You really know your partner! 🎯");
        addGameResult('guess-the-mood', 'user'); // User wins when they guess correctly
      } else {
        toast.info("Not quite right. Pay more attention to your partner's moods! 💭");
        addGameResult('guess-the-mood', 'partner'); // Partner wins when user guesses wrong
      }
      
      setGameComplete(true);
    }, 1500);
  };

  const resetGame = () => {
    setSelectedMood(null);
    setActualMood(null);
    setGameComplete(false);
  };

  const getMoodEmoji = (moodValue: string) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.emoji : "❓";
  };

  const getMoodLabel = (moodValue: string) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.label : "Unknown";
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Guess the Mood</h1>
          <p className="text-gray-600">How well do you know your partner's current emotional state?</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">What is {partner?.name || "your partner"}'s current mood?</CardTitle>
            <CardDescription className="text-center">
              Choose the mood you think your partner is feeling right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!gameComplete ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant="outline"
                    className={`h-auto py-4 px-2 flex flex-col items-center text-center ${selectedMood === mood.value ? 'bg-red-50 border-red-200' : ''}`}
                    onClick={() => handleMoodSelect(mood.value)}
                    disabled={selectedMood !== null}
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="font-medium">{mood.label}</div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Results</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500 mb-2">Your Guess</div>
                      <div className="text-5xl mb-2">{getMoodEmoji(selectedMood || "")}</div>
                      <div className="font-medium">{getMoodLabel(selectedMood || "")}</div>
                    </div>
                    
                    <div className="text-4xl my-4 sm:my-0">vs</div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500 mb-2">Actual Mood</div>
                      <div className="text-5xl mb-2">{getMoodEmoji(actualMood || "")}</div>
                      <div className="font-medium">{getMoodLabel(actualMood || "")}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  {selectedMood === actualMood ? (
                    <div className="text-green-600 font-medium text-lg mb-4">
                      Great job! You really understand {partner?.name || "your partner"}'s feelings!
                    </div>
                  ) : (
                    <div className="text-amber-600 font-medium text-lg mb-4">
                      Not quite! Take some time to check in with {partner?.name || "your partner"} today.
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {gameComplete ? (
              <div className="flex gap-4">
                <Button variant="outline" onClick={resetGame}>
                  Try Again
                </Button>
                <Button asChild>
                  <Link href="/games">
                    Back to Games
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {selectedMood 
                  ? "Checking with your partner..." 
                  : "Select a mood above to make your guess"}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}