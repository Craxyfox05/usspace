"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

// Sample statements for the game
const statements = [
  "Never have I ever sent a text to the wrong person",
  "Never have I ever forgotten an important date in our relationship",
  "Never have I ever pretended to like a gift I didn't actually like",
  "Never have I ever stayed up all night talking to you",
  "Never have I ever been jealous of someone you were talking to",
  "Never have I ever planned a surprise for you",
  "Never have I ever lied about what I was doing to avoid plans",
  "Never have I ever checked your phone without permission",
  "Never have I ever said 'I love you' first",
  "Never have I ever thought about our future wedding",
  "Never have I ever kept a secret from you for more than a week",
  "Never have I ever cried during a movie with you",
  "Never have I ever canceled plans with friends to spend time with you",
  "Never have I ever had a dream about our future together",
  "Never have I ever been embarrassed by something you did in public"
];

export default function NeverHaveIEverGame() {
  const router = useRouter();
  const { user, partner, addGameResult } = useStore();
  const [currentStatement, setCurrentStatement] = useState(0);
  const [userResponses, setUserResponses] = useState<boolean[]>([]);
  const [partnerResponses, setPartnerResponses] = useState<boolean[]>([]);
  const [showPartnerResponse, setShowPartnerResponse] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleResponse = (didDo: boolean) => {
    // Save user's response
    const newUserResponses = [...userResponses];
    newUserResponses[currentStatement] = didDo;
    setUserResponses(newUserResponses);

    // Simulate partner's response (random in this demo)
    setTimeout(() => {
      const partnerDidDo = Math.random() > 0.5;
      const newPartnerResponses = [...partnerResponses];
      newPartnerResponses[currentStatement] = partnerDidDo;
      setPartnerResponses(newPartnerResponses);
      setShowPartnerResponse(true);
    }, 1000);
  };

  const nextStatement = () => {
    if (currentStatement < statements.length - 1) {
      setCurrentStatement(prev => prev + 1);
      setShowPartnerResponse(false);
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    // Calculate results
    const userCount = userResponses.filter(response => response).length;
    const partnerCount = partnerResponses.filter(response => response).length;
    
    // Determine winner (person who has done fewer things)
    let winner: 'user' | 'partner' | 'tie' = 'tie';
    if (userCount < partnerCount) {
      winner = 'user';
      toast.success("You win! You've experienced fewer of these things!");
    } else if (partnerCount < userCount) {
      winner = 'partner';
      toast.info(`${partner?.name || 'Partner'} wins! They've experienced fewer of these things!`);
    } else {
      toast.info("It's a tie! You've both experienced the same number of things!");
    }

    // Record the result
    addGameResult('never-have-i-ever', winner, { 
      user: statements.length - userCount, 
      partner: statements.length - partnerCount 
    });
    
    setGameCompleted(true);
  };

  const restart = () => {
    setCurrentStatement(0);
    setUserResponses([]);
    setPartnerResponses([]);
    setShowPartnerResponse(false);
    setGameCompleted(false);
  };

  const matchCount = userResponses.reduce((count, response, index) => {
    return count + (response === partnerResponses[index] ? 1 : 0);
  }, 0);

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Never Have I Ever</h1>
          <p className="text-gray-600">A fun way to learn surprising things about each other!</p>
        </div>

        {!gameCompleted ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Statement {currentStatement + 1} of {statements.length}</CardTitle>
              <CardDescription className="text-center">
                Be honest! Tap "I have" if you've done it, or "I haven't" if you haven't.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center mb-8">
                <div className="text-xl font-medium my-6 px-4">
                  {statements[currentStatement]}
                </div>
                
                {!showPartnerResponse ? (
                  <div className="flex justify-center gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => handleResponse(true)}
                      className={userResponses[currentStatement] === true ? "bg-red-100 border-red-300" : ""}
                      disabled={userResponses[currentStatement] !== undefined}
                    >
                      I have
                    </Button>
                    <Button 
                      size="lg"
                      onClick={() => handleResponse(false)}
                      className={userResponses[currentStatement] === false ? "bg-red-600" : ""}
                      disabled={userResponses[currentStatement] !== undefined}
                    >
                      I haven't
                    </Button>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 rounded-lg bg-red-50">
                        <div className="font-medium mb-2">You</div>
                        <div className="text-lg">{userResponses[currentStatement] ? "I have" : "I haven't"}</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-blue-50">
                        <div className="font-medium mb-2">{partner?.name || "Partner"}</div>
                        <div className="text-lg">{partnerResponses[currentStatement] ? "I have" : "I haven't"}</div>
                      </div>
                    </div>
                    <Button onClick={nextStatement} className="mt-4">
                      {currentStatement < statements.length - 1 ? "Next Statement" : "See Results"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
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
                  <div className="text-4xl font-bold text-red-500">{statements.length - userResponses.filter(r => r).length}</div>
                  <div className="text-gray-500 text-sm">points</div>
                </div>
                <div className="text-2xl font-bold text-gray-300">VS</div>
                <div className="text-center">
                  <div className="text-xl font-medium mb-2">{partner?.name || "Partner"}</div>
                  <div className="text-4xl font-bold text-blue-500">{statements.length - partnerResponses.filter(r => r).length}</div>
                  <div className="text-gray-500 text-sm">points</div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-2xl font-medium mb-2">
                  {userResponses.filter(r => r).length < partnerResponses.filter(r => r).length ? (
                    "You win! 🏆"
                  ) : partnerResponses.filter(r => r).length < userResponses.filter(r => r).length ? (
                    `${partner?.name || 'Partner'} wins! 🏆`
                  ) : (
                    "It's a tie! 🤝"
                  )}
                </div>
                <div className="text-lg mb-2">
                  You matched on {matchCount} of {statements.length} statements
                </div>
                <div className="text-gray-600">
                  {matchCount === statements.length ? 
                    "Perfect match! You have lived identical lives!" : 
                    matchCount > statements.length / 2 ?
                    "Great match! You've had many similar experiences." :
                    "You've had different life experiences - that makes your relationship more interesting!"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={restart}>
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