"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😍", label: "In Love" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
];

export default function MoodBar() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [moodNote, setMoodNote] = useState<string>("");
  const { user, updateUserMood } = useStore();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleMoodSubmit = () => {
    if (selectedMood) {
      updateUserMood({
        mood: selectedMood,
        moodNote,
        moodLastUpdated: new Date().toISOString(),
      });
      setMoodNote("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 text-4xl">
        {MOODS.map(({ emoji, label }) => (
          <button
            key={emoji}
            className={`hover:scale-110 transition-transform ${
              selectedMood === emoji ? "ring-2 ring-red-500 rounded-full" : ""
            }`}
            onClick={() => handleMoodSelect(emoji)}
            title={label}
          >
            {emoji}
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded-lg"
        placeholder="Add a note about your mood..."
        rows={3}
        value={moodNote}
        onChange={(e) => setMoodNote(e.target.value)}
      />
      <Button onClick={handleMoodSubmit}>Share Mood</Button>
    </div>
  );
} 