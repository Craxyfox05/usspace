"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

// List of starter words to begin the game
const starterWords = [
  "Love", "Journey", "Memory", "Dream", "Adventure",
  "Paradise", "Sunset", "Ocean", "Laughter", "Music",
  "Passion", "Whisper", "Embrace", "Secret", "Morning"
];

// Categories for the game
const categories = [
  "Romance", "Travel", "Food", "Movies", "Music",
  "Nature", "Activities", "Dreams", "Memories", "Future"
];

export default function WordAssociationGame() {
  const router = useRouter();
  const { user, partner, addGameResult } = useStore();
  const [gameId, setGameId] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [inputWord, setInputWord] = useState<string>("");
  const [turn, setTurn] = useState<"user" | "partner">("user");
  const [userScore, setUserScore] = useState<number>(0);
  const [partnerScore, setPartnerScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [gameState, setGameState] = useState<"waiting" | "playing" | "ended">("waiting");
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [rounds, setRounds] = useState<number>(0);
  const [maxRounds, setMaxRounds] = useState<number>(10);

  // Create a new game
  const createGame = () => {
    // In a real app, this would connect to a multiplayer backend
    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameId(newGameId);
    
    // Set random category and starter word
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStarter = starterWords[Math.floor(Math.random() * starterWords.length)];
    setCategory(randomCategory);
    setCurrentWord(randomStarter);
    
    // Add game info to log
    setGameLog([
      `Game started: Category - ${randomCategory}`,
      `Starting word: ${randomStarter}`
    ]);
    
    // Determine who goes first (random)
    const firstPlayer = Math.random() > 0.5 ? "user" : "partner";
    setTurn(firstPlayer);
    
    // Set game state to playing
    setGameState("playing");
    
    toast.success(`Game created! ID: ${newGameId}`);
    
    // In a real app, this would send the game info to your backend
    // so your partner could join with the same game ID
  };

  // Join an existing game
  const joinGame = () => {
    if (!gameId) {
      toast.error("Please enter a game ID");
      return;
    }
    
    // In a real app, this would verify the game ID with your backend
    // and get the current game state
    
    // For demo purposes, let's simulate joining an existing game
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStarter = starterWords[Math.floor(Math.random() * starterWords.length)];
    setCategory(randomCategory);
    setCurrentWord(randomStarter);
    
    setGameLog([
      `Joined game ${gameId}`,
      `Category: ${randomCategory}`,
      `Current word: ${randomStarter}`
    ]);
    
    // In a real app, the turn would be set based on existing game state
    setTurn("partner");
    setGameState("playing");
    
    toast.success(`Joined game ${gameId}`);
  };

  // Submit a word
  const submitWord = () => {
    if (!inputWord.trim()) {
      toast.error("Please enter a word");
      return;
    }
    
    // In a real app, this would send the word to your backend
    // and validate that it's related to the previous word
    
    // For demo purposes, let's simulate word validation
    // and automatic partner response
    const newWord = inputWord.trim();
    setGameLog([...gameLog, `${user?.name || "You"}: ${newWord}`]);
    
    // Add score for the user
    setUserScore(userScore + newWord.length);
    
    // Set the new current word
    setCurrentWord(newWord);
    
    // Switch turn
    setTurn("partner");
    
    // Reset input and timer
    setInputWord("");
    setTimeLeft(15);
    
    // Increment round counter
    setRounds(rounds + 1);
    
    // Simulate partner's turn after a delay
    if (rounds < maxRounds - 1) {
      setTimeout(() => {
        simulatePartnerTurn(newWord);
      }, 2000);
    } else {
      // End game after max rounds
      setTimeout(() => {
        endGame();
      }, 1500);
    }
  };

  // Simulate partner's turn (in a real app, this would be the actual partner playing)
  const simulatePartnerTurn = (previousWord: string) => {
    // Generate words that could be related to the previous word
    const relatedWords = [
      previousWord + "s", // Pluralize
      previousWord.substring(0, previousWord.length - 1), // Remove last letter
      previousWord + "ing", // Add ing
      getRandomRelatedWord(previousWord), // Get a random "related" word
    ];
    
    const partnerWord = relatedWords[Math.floor(Math.random() * relatedWords.length)];
    
    setGameLog([...gameLog, `${partner?.name || "Partner"}: ${partnerWord}`]);
    setCurrentWord(partnerWord);
    setPartnerScore(partnerScore + partnerWord.length);
    setTurn("user");
    setTimeLeft(15);
    setRounds(rounds + 1);
    
    // End game after max rounds
    if (rounds >= maxRounds - 1) {
      setTimeout(() => {
        endGame();
      }, 1500);
    }
  };

  // Generate a "related" word by changing a few characters
  const getRandomRelatedWord = (word: string) => {
    const wordBank = [
      "love", "heart", "romance", "passion", "kiss",
      "date", "couple", "together", "memory", "future",
      "dream", "hope", "happy", "smile", "laugh",
      "dance", "song", "music", "movie", "dinner",
      "travel", "adventure", "journey", "explore", "discover"
    ];
    
    // Either return a random word from the word bank or modify the input word
    if (Math.random() > 0.5) {
      return wordBank[Math.floor(Math.random() * wordBank.length)];
    } else {
      // Modify the input word slightly
      const letters = "abcdefghijklmnopqrstuvwxyz";
      const wordArray = word.split("");
      
      // Change 1-2 letters
      const positions = Math.min(word.length, 2);
      for (let i = 0; i < positions; i++) {
        const pos = Math.floor(Math.random() * word.length);
        wordArray[pos] = letters[Math.floor(Math.random() * letters.length)];
      }
      
      return wordArray.join("");
    }
  };

  // End the game
  const endGame = () => {
    setGameState("ended");
    
    // Determine winner
    let winner: 'user' | 'partner' | 'tie' = 'tie';
    if (userScore > partnerScore) {
      winner = 'user';
      toast.success("You won! 🏆");
    } else if (partnerScore > userScore) {
      winner = 'partner';
      toast.info(`${partner?.name || 'Partner'} won! 🏆`);
    } else {
      toast.info("It's a tie! 🤝");
    }
    
    // Record game result
    addGameResult('word-association', winner, { user: userScore, partner: partnerScore });
  };

  // Reset the game
  const resetGame = () => {
    setGameId("");
    setCurrentWord("");
    setInputWord("");
    setTurn("user");
    setUserScore(0);
    setPartnerScore(0);
    setTimeLeft(15);
    setGameState("waiting");
    setGameLog([]);
    setCategory("");
    setRounds(0);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameState === "playing" && turn === "user") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - simulate a skip
            clearInterval(timer as NodeJS.Timeout);
            setGameLog([...gameLog, `${user?.name || "You"} ran out of time!`]);
            setTurn("partner");
            simulatePartnerTurn(currentWord);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, turn, gameLog, currentWord, user?.name]);

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Word Association</h1>
          <p className="text-gray-600">Connect words together in this fast-paced multiplayer game!</p>
        </div>

        {gameState === "waiting" ? (
          <Card>
            <CardHeader>
              <CardTitle>Word Association Game</CardTitle>
              <CardDescription>
                Take turns creating words that relate to the previous word. Score points based on word length!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Create a New Game</h3>
                <p className="text-sm text-gray-500">
                  Start a new game and share the game ID with your partner to play together.
                </p>
                <Button onClick={createGame}>Create Game</Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Join Existing Game</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="uppercase"
                  />
                  <Button onClick={joinGame}>Join</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : gameState === "playing" ? (
          <Card>
            <CardHeader>
              <CardTitle>Word Association: {category}</CardTitle>
              <CardDescription>
                Game ID: {gameId} • Round {rounds + 1}/{maxRounds}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scores */}
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-sm text-gray-500">{user?.name || "You"}</div>
                  <div className="text-2xl font-bold text-red-500">{userScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">{partner?.name || "Partner"}</div>
                  <div className="text-2xl font-bold text-blue-500">{partnerScore}</div>
                </div>
              </div>
              
              {/* Current word */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Current Word</div>
                <div className="text-3xl font-bold mb-4">{currentWord}</div>
                
                {turn === "user" ? (
                  <div className="space-y-3">
                    <div className="text-sm">Your turn! Enter a related word ({timeLeft}s)</div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a related word"
                        value={inputWord}
                        onChange={(e) => setInputWord(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitWord()}
                        disabled={turn !== "user"}
                      />
                      <Button onClick={submitWord} disabled={turn !== "user"}>Submit</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm bg-blue-50 p-3 rounded-md">
                    {partner?.name || "Partner"}'s turn... waiting for response...
                  </div>
                )}
              </div>
              
              {/* Game log */}
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                <div className="text-sm font-medium mb-2">Game Log</div>
                <div className="space-y-1">
                  {gameLog.map((log, index) => (
                    <div key={index} className="text-sm">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>Quit Game</Button>
              <div className="text-sm text-gray-500">
                Hint: Words must be related to the previous word
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Game Results</CardTitle>
              <CardDescription>
                Word Association: {category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final scores */}
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="font-medium">{user?.name || "You"}</div>
                  <div className="text-4xl font-bold text-red-500">{userScore}</div>
                </div>
                <div className="text-2xl font-bold text-gray-400">VS</div>
                <div className="text-center">
                  <div className="font-medium">{partner?.name || "Partner"}</div>
                  <div className="text-4xl font-bold text-blue-500">{partnerScore}</div>
                </div>
              </div>
              
              {/* Winner announcement */}
              <div className="text-center bg-gray-50 p-4 rounded-lg">
                <div className="text-xl font-bold mb-2">
                  {userScore > partnerScore
                    ? `${user?.name || "You"} win!`
                    : partnerScore > userScore
                    ? `${partner?.name || "Partner"} wins!`
                    : "It's a tie!"}
                </div>
                <div className="text-sm text-gray-500">
                  You played {rounds} rounds with {gameLog.length - 2} words.
                </div>
              </div>
              
              {/* Game log */}
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                <div className="text-sm font-medium mb-2">Game History</div>
                <div className="space-y-1">
                  {gameLog.map((log, index) => (
                    <div key={index} className="text-sm">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={resetGame}>
                Play Again
              </Button>
              <Button asChild>
                <Link href="/games">Back to Games</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 