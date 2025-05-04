"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const TRUTHS = [
  "What's your favorite memory of us?",
  "What's something you've never told me before?",
  "What's your favorite thing about our relationship?",
  "What's your biggest fear about our future?",
  "What's something you wish we did more often?",
];

const DARES = [
  "Send me a voice note saying 'I love you' in a funny voice",
  "Share your most embarrassing photo with me",
  "Tell me your favorite thing about me in 3 different languages",
  "Send me a video of you dancing to our song",
  "Write me a short poem about us",
];

export default function TruthOrDare() {
  const [currentChallenge, setCurrentChallenge] = useState<string>("");
  const [challengeType, setChallengeType] = useState<"truth" | "dare" | null>(null);

  const getRandomChallenge = (type: "truth" | "dare") => {
    const challenges = type === "truth" ? TRUTHS : DARES;
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  };

  const handleTruth = () => {
    setChallengeType("truth");
    setCurrentChallenge(getRandomChallenge("truth"));
  };

  const handleDare = () => {
    setChallengeType("dare");
    setCurrentChallenge(getRandomChallenge("dare"));
  };

  const handleNewChallenge = () => {
    if (challengeType) {
      setCurrentChallenge(getRandomChallenge(challengeType));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button className="flex-1" onClick={handleTruth}>
          Truth
        </Button>
        <Button className="flex-1" onClick={handleDare}>
          Dare
        </Button>
      </div>
      
      {currentChallenge && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {challengeType === "truth" ? "🤔" : "😈"}
            </span>
            <h3 className="font-medium">
              {challengeType === "truth" ? "Truth" : "Dare"}
            </h3>
          </div>
          <p className="text-gray-700 mb-4">{currentChallenge}</p>
          <Button variant="outline" onClick={handleNewChallenge}>
            New Challenge
          </Button>
        </div>
      )}
    </div>
  );
} 