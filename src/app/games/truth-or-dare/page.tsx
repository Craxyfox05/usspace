import { useState } from "react";
import Link from "next/link";

const truths = [
  "What was your first impression of your partner?",
  "What's a secret you've never told anyone?",
  "What do you love most about your partner?",
  "What's your most romantic memory together?",
  "What's something silly you love about your partner?",
];
const dares = [
  "Send a cute selfie to your partner!",
  "Write a love note and read it aloud.",
  "Give your partner a compliment right now!",
  "Do your best impression of your partner!",
  "Share a song that reminds you of your partner.",
];

export default function TruthOrDareGame() {
  const [mode, setMode] = useState<"truth" | "dare">("truth");
  const [idx, setIdx] = useState(Math.floor(Math.random() * truths.length));

  const handleNext = () => {
    setIdx(Math.floor(Math.random() * (mode === "truth" ? truths.length : dares.length)));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center border border-gray-100">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full font-semibold border transition-all ${mode === "truth" ? "bg-red-100 border-red-400 text-red-600" : "bg-gray-100 border-gray-300 text-gray-600"}`}
            onClick={() => setMode("truth")}
          >Truth</button>
          <button
            className={`px-4 py-2 rounded-full font-semibold border transition-all ${mode === "dare" ? "bg-yellow-100 border-yellow-400 text-yellow-600" : "bg-gray-100 border-gray-300 text-gray-600"}`}
            onClick={() => setMode("dare")}
          >Dare</button>
        </div>
        <div className="text-lg font-semibold text-center mb-6 min-h-[60px]">
          {mode === "truth" ? truths[idx] : dares[idx]}
        </div>
        <button
          className="mb-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          onClick={handleNext}
        >Next</button>
        <Link href="/games" className="text-sm text-red-400 hover:underline">← Back to Games</Link>
      </div>
    </div>
  );
} 