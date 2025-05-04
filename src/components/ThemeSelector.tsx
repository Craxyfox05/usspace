import React, { useState } from "react";

const DOODLE_STYLES = [
  { id: "classic", label: "Classic", icons: ["❤️", "🧸", "💌"] },
  { id: "minimal", label: "Minimal", icons: ["🤍", "📎", "📱"] },
  { id: "playful", label: "Playful", icons: ["🎮", "🎯", "🎪"] },
];

const ACCENT_COLORS = [
  { id: "red", color: "bg-red-500" },
  { id: "pink", color: "bg-pink-500" },
  { id: "purple", color: "bg-purple-500" },
  { id: "blue", color: "bg-blue-500" },
  { id: "green", color: "bg-green-500" },
];

export default function ThemeSelector() {
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [selectedColor, setSelectedColor] = useState("red");

  const handleSave = () => {
    console.log("Selected Doodle Style:", selectedStyle);
    console.log("Selected Accent Color:", selectedColor);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6">Doodle Theme</h2>
      <div className="mb-8">
        <div className="mb-2 font-semibold">Doodle Style</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOODLE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedStyle(style.id)}
              className={`border rounded-lg p-4 flex flex-col items-center transition-all
                ${selectedStyle === style.id
                  ? "ring-2 ring-red-500 bg-red-50 border-red-400"
                  : "bg-white border-gray-200 hover:bg-gray-50"}
              `}
            >
              <div className="font-semibold mb-2">{style.label}</div>
              <div className="flex space-x-2 text-2xl">
                {style.icons.map((icon) => (
                  <span key={icon}>{icon}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="mb-2 font-semibold">Accent Color</div>
        <div className="flex space-x-4">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedColor(c.id)}
              className={`w-10 h-10 rounded-full border-2 transition-all
                ${selectedColor === c.id
                  ? "ring-2 ring-red-500 border-red-500"
                  : "border-gray-200"}
                ${c.color}
              `}
            />
          ))}
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        Save Theme
      </button>
    </div>
  );
} 