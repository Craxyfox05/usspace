import { useState } from "react";
import Link from "next/link";

const moods = [
  { value: "happy", emoji: "😊" },
  { value: "excited", emoji: "🤩" },
  { value: "loved", emoji: "🥰" },
  { value: "neutral", emoji: "😐" },
  { value: "sad", emoji: "😔" },
  { value: "tired", emoji: "😴" },
];

// For demo, randomly pick a mood as partner's recent mood
const partnerMood = moods[Math.floor(Math.random() * moods.length)];

export default function GuessTheMood() {
  const [guess, setGuess] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleGuess = (mood: string) => {
    setGuess(mood);
    setShowResult(true);
  };
  const handleRestart = () => {
    setGuess(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center border border-gray-100">
        <div className="text-2xl font-bold mb-4">Guess the Mood 😜</div>
        {showResult ? (
          <>
            <div className="text-lg font-semibold mb-4">
              {guess === partnerMood.value ? (
                <span className="text-green-600">Correct! {partnerMood.emoji} Your partner was feeling {partnerMood.value}!</span>
              ) : (
                <span className="text-red-500">Oops! The correct answer was {partnerMood.emoji} ({partnerMood.value})</span>
              )}
            </div>
            <button onClick={handleRestart} className="mb-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition">Play Again</button>
            <Link href="/games" className="text-sm text-red-400 hover:underline">← Back to Games</Link>
          </>
        ) : (
          <>
            <div className="text-lg font-semibold mb-4 text-center">Guess your partner's recent mood:</div>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => handleGuess(m.value)}
                  className="text-4xl p-4 rounded-full border-2 border-gray-200 hover:border-pink-400 transition-all bg-pink-50 hover:bg-pink-100"
                  aria-label={m.value}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            <Link href="/games" className="text-sm text-red-400 hover:underline">← Back to Games</Link>
          </>
        )}
      </div>
    </div>
  );
} 