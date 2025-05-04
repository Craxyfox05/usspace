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

const floatingIcons = ["📅", "❤️", "🔔", "🎁", "💌", "🌸"];

const reminderTypes = [
  { value: "date", label: "Date Idea", icon: "📅" },
  { value: "gift", label: "Gift Suggestion", icon: "🎁" },
  { value: "affirmation", label: "Affirmation", icon: "💌" },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState([
    { id: 1, type: "date", message: "Plan a sunset picnic!", time: "2024-07-01T18:00", active: true },
    { id: 2, type: "gift", message: "Order her favorite flowers", time: "2024-07-10T09:00", active: false },
    { id: 3, type: "affirmation", message: "You are loved, always!", time: "2024-06-20T08:00", active: true },
  ]);
  const [form, setForm] = useState({ type: "date", message: "", time: "", active: true });
  const [editId, setEditId] = useState<number | null>(null);

  // Floating icons animation
  // (for demo, just random positions)

  // Add or update reminder
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message || !form.time) return;
    if (editId) {
      setReminders(reminders.map(r => r.id === editId ? { ...form, id: editId } : r));
      setEditId(null);
    } else {
      setReminders([...reminders, { ...form, id: Date.now() }]);
    }
    setForm({ type: "date", message: "", time: "", active: true });
  };
  // Edit
  const handleEdit = (id: number) => {
    const r = reminders.find(r => r.id === id);
    if (r) {
      setForm({ type: r.type, message: r.message, time: r.time, active: r.active });
      setEditId(id);
    }
  };
  // Delete
  const handleDelete = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };
  // Toggle
  const handleToggle = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center py-10 px-2 overflow-hidden">
      {/* Doodle Backgrounds */}
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}
      {/* Floating Icons */}
      <div className="pointer-events-none select-none">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="fixed animate-bounce-slow text-2xl opacity-20 z-0"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {floatingIcons[Math.floor(Math.random() * floatingIcons.length)]}
          </span>
        ))}
      </div>
      <div className="max-w-2xl w-full bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center relative z-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Custom Reminders <span className="text-pink-400">🔔</span></h1>
        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-4 mb-8 items-end">
          <select
            className="border rounded px-3 py-2 flex-1"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          >
            {reminderTypes.map(t => (
              <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
            ))}
          </select>
          <input
            type="text"
            className="border rounded px-3 py-2 flex-1"
            placeholder="Message..."
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            required
          />
          <input
            type="datetime-local"
            className="border rounded px-3 py-2 flex-1"
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
            />
            Active
          </label>
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded px-4 py-2 font-semibold">
            {editId ? "Update" : "Add"}
          </button>
        </form>
        {/* Reminder Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {reminders.map(r => (
            <div key={r.id} className={`bg-white border-2 rounded-xl p-4 shadow flex flex-col gap-2 relative ${r.active ? "border-pink-400" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">
                  {reminderTypes.find(t => t.value === r.type)?.icon}
                </span>
                <span className="font-semibold text-black capitalize">{reminderTypes.find(t => t.value === r.type)?.label}</span>
                <span className="ml-auto">
                  <button onClick={() => handleEdit(r.id)} className="text-yellow-500 hover:text-yellow-600 mr-2">✏️</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600">🗑️</button>
                </span>
              </div>
              <div className="text-gray-700 mb-1">{r.message}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>⏰ {new Date(r.time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                <label className="flex items-center gap-1 ml-auto">
                  <input type="checkbox" checked={r.active} onChange={() => handleToggle(r.id)} />
                  <span className="text-xs">Active</span>
                </label>
              </div>
              {/* Notification Preview */}
              {r.active && (
                <div className="mt-2 bg-pink-50 border border-pink-200 rounded px-3 py-2 text-pink-600 flex items-center gap-2 text-sm">
                  <span>🔔</span>
                  <span>Reminder: {r.message}</span>
                </div>
              )}
            </div>
          ))}
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