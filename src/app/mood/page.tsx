"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";
import Image from "next/image";

const moods = [
  { value: "happy", emoji: "😊", color: "bg-yellow-200" },
  { value: "excited", emoji: "🤩", color: "bg-pink-200" },
  { value: "loved", emoji: "🥰", color: "bg-red-200" },
  { value: "neutral", emoji: "😐", color: "bg-gray-200" },
  { value: "sad", emoji: "😔", color: "bg-blue-200" },
  { value: "sad", emoji: "😭", color: "bg-blue-300" },
  { value: "tired", emoji: "😴", color: "bg-purple-200" },
];

const doodles = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    className: "absolute top-0 left-0 w-24 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    className: "absolute top-10 right-0 w-20 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    className: "absolute bottom-0 left-10 w-24 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80",
    className: "absolute bottom-5 right-5 w-20 opacity-10 -z-10 rounded-full"
  }
];

export default function MoodBarPage() {
  const { user, partner, updateUserMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood>(user?.mood || "happy");
  const [note, setNote] = useState(user?.moodNote || "");
  const [showNotif, setShowNotif] = useState(false);

  // Floating emojis animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Just to trigger re-render for floating emojis
      setShowNotif((v) => v);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Notify partner on mood update (UI only)
  const handleUpdateMood = () => {
    updateUserMood(selectedMood, note);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      {/* Doodle Backgrounds */}
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}

      {/* Floating Emojis */}
      <div className="pointer-events-none select-none">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className={`fixed animate-bounce-slow text-4xl opacity-20 z-0`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {moods[Math.floor(Math.random() * moods.length)].emoji}
          </span>
        ))}
      </div>

      <div className="max-w-md w-full bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center relative z-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Mood Bar</h1>
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`text-3xl p-2 rounded-full border-2 transition-all ${selectedMood === m.value ? "border-pink-400 bg-pink-50 scale-110" : "border-transparent hover:bg-gray-100"}`}
              onClick={() => setSelectedMood(m.value as Mood)}
              aria-label={m.value}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-200"
          rows={2}
          placeholder="Add a note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button
          onClick={handleUpdateMood}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg py-2 transition mb-2"
        >
          Update Mood
        </button>
        {showNotif && (
          <div className="mt-2 text-pink-600 bg-pink-50 border border-pink-200 rounded-lg px-4 py-2 text-center animate-fade-in">
            {partner?.name ? `${partner.name} will see your mood update!` : "Your partner will be notified!"}
          </div>
        )}
      </div>
    </div>
  );
}

// Custom animation for floating emojis
// Add this to your global CSS:
// @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
// .animate-bounce-slow { animation: bounce-slow 4s infinite; }
// .animate-fade-in { animation: fadeIn 0.5s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
