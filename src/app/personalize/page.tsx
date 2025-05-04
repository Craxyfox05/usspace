"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const themes = [
  {
    key: "space-love",
    name: "Space Love",
    primary: "bg-gradient-to-br from-purple-700 via-pink-400 to-indigo-400",
    accent: "text-purple-400",
    doodle: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    icon: "🌌",
  },
  {
    key: "notebook",
    name: "Notebook Vibes",
    primary: "bg-gradient-to-br from-blue-200 via-white to-yellow-100",
    accent: "text-blue-700",
    doodle: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    icon: "📒",
  },
  {
    key: "minimal",
    name: "Minimal White",
    primary: "bg-white",
    accent: "text-gray-700",
    doodle: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    icon: "🤍",
  },
];

const musics = [
  { key: "none", name: "No Music", url: "" },
  { key: "lofi", name: "Lofi Chill", url: "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b7.mp3" },
  { key: "romantic", name: "Romantic Piano", url: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b7b7.mp3" },
  { key: "space", name: "Space Ambience", url: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b7b7.mp3" },
];

const floatingIcons = ["🌸", "💖", "💕", "🌹", "💐", "❤️", "✨", "🪐", "⭐"];

export default function PersonalizePage() {
  const [selectedTheme, setSelectedTheme] = useState("space-love");
  const [selectedMusic, setSelectedMusic] = useState("none");
  const [floating, setFloating] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const t = localStorage.getItem("theme");
    const m = localStorage.getItem("music");
    const f = localStorage.getItem("floating");
    if (t) setSelectedTheme(t);
    if (m) setSelectedMusic(m);
    if (f) setFloating(f === "true");
  }, []);
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("theme", selectedTheme);
    localStorage.setItem("music", selectedMusic);
    localStorage.setItem("floating", floating ? "true" : "false");
  }, [selectedTheme, selectedMusic, floating]);
  // Music preview
  useEffect(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    const url = musics.find(m => m.key === selectedMusic)?.url;
    if (url) {
      const a = new Audio(url);
      a.loop = true;
      a.volume = 0.3;
      a.play();
      setAudio(a);
    }
    // eslint-disable-next-line
  }, [selectedMusic]);

  const themeObj = themes.find(t => t.key === selectedTheme)!;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-2 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-black">Personalize Your Space <span className="animate-bounce inline-block">🎨</span></h1>
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {themes.map(t => (
          <div
            key={t.key}
            className={`rounded-2xl shadow-md p-6 flex flex-col items-center cursor-pointer border-2 transition-all duration-200 ${selectedTheme === t.key ? "border-pink-500 scale-105" : "border-gray-200 hover:scale-105"}`}
            onClick={() => setSelectedTheme(t.key)}
          >
            <span className="text-4xl mb-2">{t.icon}</span>
            <div className="font-bold text-lg mb-1">{t.name}</div>
            <div className={`w-16 h-3 rounded-full ${t.primary} mb-2`}></div>
            <Image src={t.doodle} alt={t.name} width={60} height={60} className="rounded-lg opacity-60" />
            {selectedTheme === t.key && <div className="mt-2 text-pink-500 font-semibold">Selected</div>}
          </div>
        ))}
      </div>
      <div className="max-w-2xl w-full bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center mb-10">
        <div className="w-full flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="flex-1">
            <label className="font-semibold mb-1 block">Background Music</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedMusic}
              onChange={e => setSelectedMusic(e.target.value)}
            >
              {musics.map(m => (
                <option key={m.key} value={m.key}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex items-center gap-3 mt-4 md:mt-0">
            <label className="font-semibold">Floating Elements</label>
            <input type="checkbox" checked={floating} onChange={e => setFloating(e.target.checked)} />
            <span className="text-2xl">{floating ? "🌸" : "❌"}</span>
          </div>
        </div>
        {/* Live Preview */}
        <div className={`w-full h-64 rounded-xl flex items-center justify-center relative overflow-hidden ${themeObj.primary} shadow-inner`}>
          <span className={`absolute top-4 left-4 text-3xl ${themeObj.accent}`}>{themeObj.icon}</span>
          <span className="text-2xl font-bold text-white drop-shadow-lg">{themeObj.name} Preview</span>
          <Image src={themeObj.doodle} alt="doodle" width={80} height={80} className="absolute bottom-4 right-4 opacity-40" />
          {floating && (
            <div className="pointer-events-none select-none absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="fixed animate-bounce-slow text-3xl opacity-20 z-0"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${Math.random() * 80}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  {floatingIcons[Math.floor(Math.random() * floatingIcons.length)]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Soft animation keyframes */}
      <style>{`
        .animate-bounce-slow { animation: bounce-slow 4s infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
    </div>
  );
} 