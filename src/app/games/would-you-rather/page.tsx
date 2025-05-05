"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

// Sample questions for the game
const questions = [
  {
    id: 1,
    option1: "Travel to 5 different countries over the next year",
    option2: "Build your dream house and stay there for the next year"
  },
  {
    id: 2,
    option1: "Be able to teleport anywhere",
    option2: "Be able to read minds"
  },
  {
    id: 3,
    option1: "Have your perfect date at the beach",
    option2: "Have your perfect date in the mountains"
  },
  {
    id: 4,
    option1: "Cook dinner together every night",
    option2: "Go out to a restaurant together twice a week"
  },
  {
    id: 5,
    option1: "Be a morning person who wakes up at 5am daily",
    option2: "Be a night owl who stays up until 3am daily"
  },
  {
    id: 6,
    option1: "Have a romantic candlelit dinner at home",
    option2: "Go on an adventure date outdoors"
  },
  {
    id: 7,
    option1: "Live in a bustling city center",
    option2: "Live in a quiet countryside"
  },
  {
    id: 8,
    option1: "Have the ability to fly",
    option2: "Have the ability to breathe underwater"
  },
  {
    id: 9,
    option1: "Only be able to whisper for the rest of your life",
    option2: "Only be able to shout for the rest of your life"
  },
  {
    id: 10,
    option1: "Go on a spontaneous road trip",
    option2: "Plan a detailed vacation months in advance"
  }
];

export default function WouldYouRatherGame() {
  const router = useRouter();
  const { user, partner, addGameResult } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [partnerChoice, setPartnerChoice] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [matches, setMatches] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [partnerScore, setPartnerScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    
    // Simulate partner's choice (in a real app, this would be the partner's actual choice)
    // For the demo, we'll randomly generate a choice
    setTimeout(() => {
      const partnerSelected = Math.random() > 0.5 ? 'option1' : 'option2';
      setPartnerChoice(partnerSelected);
      
      if (option === partnerSelected) {
        setMatches(prev => prev + 1);
        // Both players get a point for matching
        setUserScore(prev => prev + 1);
        setPartnerScore(prev => prev + 1);
      } else {
        // When there's no match, randomly award a point to one player
        // This simulates one person "winning" the round
        if (Math.random() > 0.5) {
          setUserScore(prev => prev + 1);
        } else {
          setPartnerScore(prev => prev + 1);
        }
      }
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelected(null);
      setPartnerChoice(null);
    } else {
      setFinished(true);
    }
  };

  const startOver = () => {
    setCurrentQuestion(0);
    setSelected(null);
    setPartnerChoice(null);
    setFinished(false);
    setMatches(0);
    setUserScore(0);
    setPartnerScore(0);
    setGameCompleted(false);
  };

  // Record the game result when finished
  useEffect(() => {
    if (finished && !gameCompleted) {
      // Determine the winner
      let winner: 'user' | 'partner' | 'tie' = 'tie';
      if (userScore > partnerScore) {
        winner = 'user';
        toast.success("You won this game! 🏆");
      } else if (partnerScore > userScore) {
        winner = 'partner';
        toast.info(`${partner?.name || 'Partner'} won this game!`);
      } else {
        toast.info("It's a tie!");
      }

      // Record the result
      addGameResult('would-you-rather', winner, { user: userScore, partner: partnerScore });
      setGameCompleted(true);
    }
  }, [finished, userScore, partnerScore, gameCompleted, addGameResult, partner]);

  const question = questions[currentQuestion];

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Would You Rather</h1>
          <p className="text-gray-600">Choose between two options and see if you and your partner think alike!</p>
        </div>

        {!finished ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Question {currentQuestion + 1} of {questions.length}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center mb-8">
                <div className="text-xl font-medium mb-6">Would you rather...</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    className={`h-auto py-8 px-4 text-base ${selected === 'option1' ? 'bg-red-600' : 'bg-red-500'} overflow-hidden`}
                    onClick={() => !selected && handleSelect('option1')}
                    disabled={!!selected}
                  >
                    <div className="w-full break-words hyphens-auto">{question.option1}</div>
                    {selected === 'option1' && partnerChoice === 'option1' && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 text-xs">
                        Match! ✓
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    className={`h-auto py-8 px-4 text-base ${selected === 'option2' ? 'bg-red-600' : 'bg-red-500'} overflow-hidden`}
                    onClick={() => !selected && handleSelect('option2')}
                    disabled={!!selected}
                  >
                    <div className="w-full break-words hyphens-auto">{question.option2}</div>
                    {selected === 'option2' && partnerChoice === 'option2' && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 text-xs">
                        Match! ✓
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              
              {partnerChoice && (
                <div className="text-center mt-4">
                  <div className="text-lg font-medium mb-2">Your partner chose:</div>
                  <div className="font-medium text-red-600">
                    {partnerChoice === 'option1' ? question.option1 : question.option2}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {partnerChoice && (
                <Button onClick={nextQuestion} className="mt-4">
                  {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Game Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center gap-10 mb-8">
                <div className="text-center">
                  <div className="text-xl font-medium mb-2">{user?.name || "You"}</div>
                  <div className="text-4xl font-bold text-red-500">{userScore}</div>
                  <div className="text-gray-500 text-sm">points</div>
                </div>
                <div className="text-2xl font-bold text-gray-300">VS</div>
                <div className="text-center">
                  <div className="text-xl font-medium mb-2">{partner?.name || "Partner"}</div>
                  <div className="text-4xl font-bold text-blue-500">{partnerScore}</div>
                  <div className="text-gray-500 text-sm">points</div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-2xl font-medium mb-2">
                  {userScore > partnerScore ? (
                    "You win! 🏆"
                  ) : partnerScore > userScore ? (
                    `${partner?.name || 'Partner'} wins! 🏆`
                  ) : (
                    "It's a tie! 🤝"
                  )}
                </div>
                <div className="text-lg mb-2">
                  You matched on {matches} of {questions.length} questions
                </div>
                <div className="text-gray-600">
                  {matches === questions.length ? 
                    "Perfect match! You two think exactly alike!" : 
                    matches > questions.length / 2 ?
                    "Great match! You're on the same wavelength most of the time." :
                    "You have some different perspectives - that's what makes your relationship interesting!"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={startOver}>
                Play Again
              </Button>
              <Button asChild>
                <Link href="/games">
                  Back to Games
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 