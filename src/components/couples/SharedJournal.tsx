"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  author: string;
  content: string;
  date: string;
  isPublic: boolean;
}

export default function SharedJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { user, partner } = useStore();

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        author: user?.id || "",
        content: newEntry,
        date: new Date().toISOString(),
        isPublic,
      };
      setEntries([entry, ...entries]);
      setNewEntry("");
      setIsPublic(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button className="flex-1" onClick={() => setNewEntry("")}>
          Write a Letter
        </Button>
        <Button className="flex-1" onClick={() => setNewEntry("")}>
          Add a Note
        </Button>
      </div>

      {newEntry && (
        <div className="space-y-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Write your thoughts..."
            rows={4}
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label htmlFor="isPublic">Make this entry public</label>
          </div>
          <Button onClick={handleAddEntry}>Post Entry</Button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium">Recent Entries</h3>
        {entries.map((entry) => (
          <div key={entry.id} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Avatar>
                <AvatarImage src={entry.author === user?.id ? user.avatar : partner?.avatar} />
                <AvatarFallback>
                  {entry.author === user?.id ? user?.name[0] : partner?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {entry.author === user?.id ? user?.name : partner?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </p>
              </div>
              {entry.isPublic && (
                <span className="ml-auto text-xs text-gray-500">🌎 Public</span>
              )}
            </div>
            <p className="text-gray-700">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 