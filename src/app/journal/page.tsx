"use client";

import { useState } from "react";
import Image from "next/image";

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

const emojis = ["😊", "😍", "🥰", "😂", "😭", "😢", "😎", "😘", "😇", "😜", "💖", "💋", "💌", "💞", "💍", "🌹", "🌸", "💐", "❤️", "💕", "💗", "💓", "💝", "💘", "💟", "🥺", "😳"];
const loveQuotes = [
  "You are my today and all of my tomorrows.",
  "Every love story is beautiful, but ours is my favorite.",
  "I love you to the moon and back.",
  "Together is my favorite place to be.",
  "You are my sunshine on a cloudy day.",
];

export default function JournalPage() {
  const [entries, setEntries] = useState([
    { id: 1, date: new Date().toISOString(), emoji: "💖", quote: loveQuotes[0], text: "You make every day special!", isPublic: false },
    { id: 2, date: new Date().toISOString(), emoji: "🌹", quote: loveQuotes[2], text: "I love you to the moon and back.", isPublic: true },
  ]);
  const [form, setForm] = useState({ emoji: "💖", quote: loveQuotes[0], text: "", isPublic: false });
  const [showEmoji, setShowEmoji] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Add or update entry
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text) return;
    if (editId) {
      setEntries(entries.map(e => e.id === editId ? { ...form, id: editId, date: new Date().toISOString() } : e));
      setEditId(null);
    } else {
      setEntries([{ ...form, id: Date.now(), date: new Date().toISOString() }, ...entries]);
    }
    setForm({ emoji: "💖", quote: loveQuotes[0], text: "", isPublic: false });
  };
  // Edit
  const handleEdit = (id: number) => {
    const e = entries.find(e => e.id === id);
    if (e) {
      setForm({ emoji: e.emoji, quote: e.quote, text: e.text, isPublic: e.isPublic });
      setEditId(id);
    }
  };
  // Delete
  const handleDelete = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };
  // Share (demo: copy to clipboard)
  const handleShare = (entry: any) => {
    navigator.clipboard.writeText(`${entry.emoji} ${entry.text}\n${entry.quote}`);
    alert("Copied to clipboard! (Demo for sharing)");
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center py-10 px-2 overflow-hidden">
      {/* Doodle Backgrounds */}
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}
      <div className="max-w-2xl w-full bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center relative z-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Shared Journal <span className="text-pink-400">📓</span></h1>
        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mb-8">
          <div className="flex gap-2 items-center">
            <button type="button" className="text-2xl" onClick={() => setShowEmoji(v => !v)}>{form.emoji}</button>
            {showEmoji && (
              <div className="absolute bg-white border rounded-lg shadow-lg p-2 flex flex-wrap gap-2 z-20 mt-12">
                {emojis.map(e => (
                  <button key={e} className="text-2xl" onClick={() => { setForm(f => ({ ...f, emoji: e })); setShowEmoji(false); }}>{e}</button>
                ))}
              </div>
            )}
            <button type="button" className="text-pink-400 underline ml-2" onClick={() => setShowQuote(v => !v)}>
              {form.quote.length > 30 ? form.quote.slice(0, 30) + "..." : form.quote}
            </button>
            {showQuote && (
              <div className="absolute bg-white border rounded-lg shadow-lg p-2 flex flex-col gap-1 z-20 mt-16 ml-24">
                {loveQuotes.map(q => (
                  <button key={q} className="text-sm text-left hover:text-pink-500" onClick={() => { setForm(f => ({ ...f, quote: q })); setShowQuote(false); }}>{q}</button>
                ))}
              </div>
            )}
            <label className="ml-auto flex items-center gap-1 text-xs">
              <input type="checkbox" checked={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))} />
              Public
            </label>
          </div>
          <textarea
            className="w-full border-0 border-b-2 border-pink-200 bg-transparent px-3 py-2 mb-2 resize-none focus:outline-none focus:ring-0 focus:border-pink-400 font-medium text-lg notebook-lines"
            rows={3}
            placeholder="Write your note or letter..."
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            required
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded px-4 py-2 font-semibold w-32 self-end">
            {editId ? "Update" : "Add"}
          </button>
        </form>
        {/* Entries List */}
        <div className="w-full flex flex-col gap-6">
          {entries.map(e => (
            <div key={e.id} className="relative bg-white border-l-4 rounded-lg shadow p-4 flex flex-col gap-2 border-pink-300 notebook-lines">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{e.emoji}</span>
                <span className="text-xs text-gray-400">{new Date(e.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${e.isPublic ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"}`}>
                  {e.isPublic ? "Public" : "Private"}
                </span>
                <button onClick={() => handleEdit(e.id)} className="text-yellow-500 hover:text-yellow-600 ml-2">✏️</button>
                <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-600 ml-1">🗑️</button>
                {e.isPublic && <button onClick={() => handleShare(e)} className="text-blue-400 hover:text-blue-600 ml-1">🔗</button>}
              </div>
              <div className="text-lg font-medium text-gray-800 whitespace-pre-line">{e.text}</div>
              <div className="italic text-pink-500 text-sm mt-1">{e.quote}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Notebook lines style */}
      <style>{`
        .notebook-lines textarea, .notebook-lines {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 23px, #fbcfe8 24px);
        }
      `}</style>
    </div>
  );
} 