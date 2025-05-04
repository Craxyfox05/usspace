"use client";

import { useState, useRef } from "react";
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

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "partner", text: "Hey love! 💕", time: "09:00" },
    { sender: "me", text: "Good morning! ☀️", time: "09:01" },
  ]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [gifUrl, setGifUrl] = useState("");
  const [scheduledMsg, setScheduledMsg] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Floating hearts/petals
  const floatingEmojis = ["💖", "🌸", "💕", "❤️", "🌹", "💐"];

  // Send message
  const sendMessage = (text: string, type: "text" | "gif" | "voice" = "text") => {
    setMessages((msgs) => [
      ...msgs,
      {
        sender: "me",
        text: type === "gif" ? `<img src='${text}' class='w-32 rounded-lg'/>` : type === "voice" ? `<audio controls src='${text}' class='w-40'></audio>` : text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
    setGifUrl("");
    setVoiceUrl(null);
    setShowGif(false);
    setShowEmoji(false);
  };

  // Handle emoji select
  const handleEmoji = (emoji: string) => {
    setInput((i) => i + emoji);
    setShowEmoji(false);
  };

  // Handle GIF search (demo: static GIF)
  const handleGif = () => {
    setGifUrl("https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif");
    setShowGif(false);
    sendMessage("https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif", "gif");
  };

  // Handle voice note
  const startRecording = async () => {
    setRecording(true);
    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setVoiceUrl(url);
      sendMessage(url, "voice");
      setRecording(false);
    };
    mediaRecorder.start();
    setTimeout(() => {
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    }, 10000); // Max 10s
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Handle scheduled message
  const handleSchedule = () => {
    if (scheduledMsg && scheduleTime) {
      setShowNotif(true);
      setTimeout(() => {
        sendMessage(scheduledMsg);
        setShowNotif(false);
        setScheduledMsg("");
        setScheduleTime("");
      }, 2000); // Demo: send after 2s
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center py-8 px-2 overflow-hidden">
      {/* Doodle Backgrounds */}
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}
      {/* Floating Hearts/Petals */}
      <div className="pointer-events-none select-none">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="fixed animate-bounce-slow text-3xl opacity-20 z-0"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)]}
          </span>
        ))}
      </div>
      <div className="max-w-lg w-full bg-white/90 rounded-2xl shadow-lg p-4 flex flex-col relative z-10">
        <h1 className="text-2xl font-bold mb-2 text-center">Private Chat</h1>
        <div className="flex-1 overflow-y-auto mb-4 h-96 bg-white rounded-lg border border-gray-100 p-3 flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow text-base whitespace-pre-line ${msg.sender === "me" ? "bg-pink-100 text-right" : "bg-gray-100 text-left"}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
              <span className="text-xs text-gray-400 ml-2 self-end">{msg.time}</span>
            </div>
          ))}
        </div>
        {/* Message Input */}
        <div className="flex gap-2 items-center mb-2">
          <button onClick={() => setShowEmoji((v) => !v)} className="text-2xl">😊</button>
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && input.trim()) sendMessage(input); }}
          />
          <button onClick={() => setShowGif(true)} className="text-2xl">🎬</button>
          <button onClick={startRecording} disabled={recording} className="text-2xl">🎤</button>
          <button onClick={() => input.trim() && sendMessage(input)} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2 font-bold">Send</button>
        </div>
        {/* Emoji Picker */}
        {showEmoji && (
          <div className="absolute bottom-20 left-4 bg-white border rounded-lg shadow-lg p-2 flex flex-wrap gap-2 z-20">
            {emojis.map((e) => (
              <button key={e} className="text-2xl" onClick={() => handleEmoji(e)}>{e}</button>
            ))}
          </div>
        )}
        {/* GIF Picker (demo) */}
        {showGif && (
          <div className="absolute bottom-20 right-4 bg-white border rounded-lg shadow-lg p-4 z-20 flex flex-col items-center">
            <button onClick={handleGif} className="mb-2 bg-pink-100 px-4 py-2 rounded-lg">Send Cute GIF</button>
            {gifUrl && <img src={gifUrl} alt="gif" className="w-32 rounded-lg" />}
          </div>
        )}
        {/* Voice Note Controls */}
        {recording && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg p-4 z-20 flex flex-col items-center">
            <span className="mb-2">Recording... 🎤</span>
            <button onClick={stopRecording} className="bg-pink-500 text-white px-4 py-2 rounded-lg">Stop</button>
          </div>
        )}
        {/* Scheduled Message */}
        <div className="mt-4 bg-pink-50 rounded-lg p-3 flex flex-col gap-2">
          <div className="font-semibold">Schedule a Message</div>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Type your note..."
            value={scheduledMsg}
            onChange={e => setScheduledMsg(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={scheduleTime}
            onChange={e => setScheduleTime(e.target.value)}
          />
          <button onClick={handleSchedule} className="bg-pink-500 hover:bg-pink-600 text-white rounded px-3 py-1 mt-1">Schedule</button>
          {showNotif && <div className="text-pink-600 text-sm mt-1">Your message will be sent at the scheduled time!</div>}
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS:
// @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
// .animate-bounce-slow { animation: bounce-slow 4s infinite; }
