"use client";

import { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import ScoreBoard from "@/components/games/ScoreBoard";

const games = [
  {
    id: "truth-or-dare",
    title: "Truth or Dare",
    desc: "Fun & spicy questions for couples!",
    emoji: "🎲",
    btn: "Play Now",
    href: "/games/truth-or-dare",
    color: "bg-pink-50"
  },
  {
    id: "memory-quiz",
    title: "Memory Quiz",
    desc: "Test how well you remember your journey!",
    emoji: "🧠",
    btn: "Start Quiz",
    href: "/games/memory-quiz",
    color: "bg-blue-50"
  },
  {
    id: "would-you-rather",
    title: "Would You Rather",
    desc: "Make tough choices together!",
    emoji: "🤔",
    btn: "Play Now",
    href: "/games/would-you-rather",
    color: "bg-purple-50"
  },
  {
    id: "word-association",
    title: "Word Association",
    desc: "Multiplayer word game to play together online!",
    emoji: "🔤",
    btn: "Play Online",
    href: "/games/word-association",
    color: "bg-green-50",
    isNew: true,
    isMultiplayer: true
  },
  {
    id: "couples-drawing",
    title: "Couple's Drawing",
    desc: "Create art together on a shared canvas!",
    emoji: "🎨",
    btn: "Start Drawing",
    href: "/games/couples-drawing",
    color: "bg-green-50"
  },
  {
    id: "never-have-i-ever",
    title: "Never Have I Ever",
    desc: "Discover surprising facts about each other!",
    emoji: "👀",
    btn: "Play Now",
    href: "/games/never-have-i-ever",
    color: "bg-yellow-50"
  },
  {
    id: "guess-the-mood",
    title: "Guess the Mood",
    desc: "Can you guess your partner's recent mood?",
    emoji: "😜",
    btn: "Guess Now",
    href: "/games/guess-the-mood",
    color: "bg-red-50"
  },
  {
    id: "love-language",
    title: "Love Language Test",
    desc: "Discover your love languages together!",
    emoji: "❤️",
    btn: "Take Test",
    href: "/games/love-language",
    color: "bg-pink-50"
  },
  {
    id: "relationship-timeline",
    title: "Timeline Challenge",
    desc: "Arrange your special moments in order!",
    emoji: "📅",
    btn: "Start Challenge",
    href: "/games/timeline-challenge",
    color: "bg-blue-50"
  }
];

export default function GamesHome() {
  return (
    <PageLayout>
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Mini Games for Couples</h1>
        <p className="text-lg text-gray-600 mb-4">Have fun together with these interactive games designed for couples!</p>
        
        {/* Scoreboard Section */}
        <div className="mb-12">
          <ScoreBoard />
        </div>
        
        {/* Multiplayer Games Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <span className="bg-red-500 text-white rounded-full p-1 text-xs mr-2">LIVE</span>
            Multiplayer Games - Play Together Online
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games
              .filter(game => game.isMultiplayer)
              .map((game) => (
                <Link
                  key={game.id}
                  href={game.href}
                  className={`block rounded-xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md hover:translate-y-[-2px] ${game.color} h-full relative cursor-pointer`}
                >
                  {game.isNew && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded-full">
                      NEW
                    </div>
                  )}
                  <div className="p-6 flex flex-col items-center text-center h-full">
                    <div className="text-5xl mb-3">{game.emoji}</div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{game.title}</h3>
                    <div className="text-gray-600 mb-5 flex-grow h-12 line-clamp-2">{game.desc}</div>
                    <div 
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-full text-sm transition w-full text-center mt-auto"
                    >
                      {game.btn}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-4">All Games</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link 
              key={game.id} 
              href={game.href}
              className={`block rounded-xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md hover:translate-y-[-2px] ${game.color} h-full relative cursor-pointer`}
            >
              {game.isNew && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded-full">
                  NEW
                </div>
              )}
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="text-5xl mb-3">{game.emoji}</div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{game.title}</h3>
                <div className="text-gray-600 mb-5 flex-grow h-12 line-clamp-2">{game.desc}</div>
                <div 
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-full text-sm transition w-full text-center mt-auto"
                >
                  {game.btn}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">More Games Coming Soon!</h2>
          <p className="text-gray-600 mb-6">We're working on more fun activities to help you connect with your partner.</p>
          <div className="flex justify-center">
            <Link 
              href="/couples" 
              className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium px-6 py-3 rounded-full transition"
            >
              Back to Couple Space
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 