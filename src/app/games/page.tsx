"use client";

import { useState } from "react";
import Link from "next/link";

const games = [
  {
    id: "truth-or-dare",
    title: "Truth or Dare",
    desc: "Fun & spicy questions for couples!",
    emoji: "🎲",
    btn: "Play Now",
    href: "/games/truth-or-dare",
  },
  {
    id: "memory-quiz",
    title: "Memory Quiz",
    desc: "Test how well you remember your journey!",
    emoji: "🧠",
    btn: "Start Quiz",
    href: "/games/memory-quiz",
  },
  {
    id: "guess-the-mood",
    title: "Guess the Mood",
    desc: "Can you guess your partner's recent mood?",
    emoji: "😜",
    btn: "Guess Now",
    href: "/games/guess-the-mood",
  },
  {
    id: "coming-soon",
    title: "More Games Coming Soon",
    desc: "Stay tuned for more couple fun!",
    emoji: "✨",
    btn: "See Ideas",
    href: "/games/coming-soon",
  },
];

export default function GamesHome() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Mini Games for Couples</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
            <div className="text-5xl mb-2">{game.emoji}</div>
            <div className="text-xl font-semibold mb-1">{game.title}</div>
            <div className="text-gray-500 mb-4 text-center">{game.desc}</div>
            <Link href={game.href} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition">
              {game.btn}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 