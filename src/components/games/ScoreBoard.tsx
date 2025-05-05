"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

export default function ScoreBoard() {
  const { user, partner, gameScores, resetGameScores } = useStore();
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Calculate win percentage
  const totalGames = gameScores.history.filter(game => game.winner !== 'tie').length;
  const userWinPercentage = totalGames > 0 
    ? Math.round((gameScores.user / totalGames) * 100) 
    : 0;
  const partnerWinPercentage = totalGames > 0 
    ? Math.round((gameScores.partner / totalGames) * 100) 
    : 0;

  // Sort games by date (most recent first)
  const sortedGameHistory = [...gameScores.history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get last 5 games
  const recentGames = sortedGameHistory.slice(0, 5);

  // Format game type for display
  const formatGameType = (gameType: string) => {
    return gameType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Trophy className="w-5 h-5 mr-2" /> Couple's Scoreboard
        </CardTitle>
        <CardDescription>
          Track who's winning the most games!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="w-full rounded-none grid grid-cols-2">
            <TabsTrigger value="scores">Scores</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              {/* User Score */}
              <div className="flex-1 flex flex-col items-center text-center p-4 rounded-lg bg-red-50">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <div className="font-medium text-lg mb-1">{user?.name || "You"}</div>
                <div className="text-4xl font-bold text-red-500 mb-1">{gameScores.user}</div>
                <div className="text-sm text-gray-500">
                  {userWinPercentage}% Win Rate
                </div>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-400 my-2">VS</div>
                <div className="text-sm text-gray-500">
                  {totalGames} games played
                </div>
              </div>

              {/* Partner Score */}
              <div className="flex-1 flex flex-col items-center text-center p-4 rounded-lg bg-blue-50">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={partner?.avatar || ""} alt={partner?.name || ""} />
                  <AvatarFallback>{partner?.name?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <div className="font-medium text-lg mb-1">{partner?.name || "Partner"}</div>
                <div className="text-4xl font-bold text-blue-500 mb-1">{gameScores.partner}</div>
                <div className="text-sm text-gray-500">
                  {partnerWinPercentage}% Win Rate
                </div>
              </div>
            </div>

            {/* Current Winner Badge */}
            {totalGames > 0 && (
              <div className="mt-6 text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">Current Champion</div>
                {gameScores.user > gameScores.partner ? (
                  <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 mr-1" /> {user?.name || "You"}
                  </div>
                ) : gameScores.partner > gameScores.user ? (
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 mr-1" /> {partner?.name || "Partner"}
                  </div>
                ) : totalGames > 0 ? (
                  <div className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    It's a tie!
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-0 px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGames.length > 0 ? (
                  recentGames.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{formatGameType(game.gameType)}</TableCell>
                      <TableCell>
                        {game.winner === 'user' ? (
                          <span className="text-red-600">{user?.name || "You"}</span>
                        ) : game.winner === 'partner' ? (
                          <span className="text-blue-600">{partner?.name || "Partner"}</span>
                        ) : (
                          <span className="text-purple-600">Tie</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {format(new Date(game.date), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                      No games played yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {recentGames.length > 0 && gameScores.history.length > 5 && (
                <TableCaption>
                  Showing {recentGames.length} of {gameScores.history.length} games
                </TableCaption>
              )}
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-gray-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowResetDialog(true)}
          className="text-sm"
        >
          Reset Scores
        </Button>
        <div className="text-sm text-gray-500">
          Last updated: {gameScores.history.length > 0 
            ? format(new Date(gameScores.history[0].date), "MMM d, h:mm a") 
            : "Never"}
        </div>
      </CardFooter>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Scores?</DialogTitle>
            <DialogDescription>
              This will clear all game history and reset both players' scores to zero. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                resetGameScores();
                setShowResetDialog(false);
              }}
            >
              Reset Scores
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 