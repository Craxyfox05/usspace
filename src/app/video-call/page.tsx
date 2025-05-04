"use client";

import { useRef, useState } from "react";
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

const fallingPetals = ["🌸", "💖", "💕", "🌹", "💐", "❤️"];

export default function VideoCallPage() {
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutube, setShowYoutube] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Camera/mic enable (mock: just show local video)
  const handleCamera = async () => {
    if (!cameraOn && localVideoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
      localVideoRef.current.srcObject = stream;
      setCameraOn(true);
    } else if (cameraOn && localVideoRef.current) {
      const tracks = (localVideoRef.current.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((t) => t.stop());
      localVideoRef.current.srcObject = null;
      setCameraOn(false);
    }
  };
  const handleMic = async () => {
    setMicOn((v) => !v);
    if (cameraOn && localVideoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !micOn });
      localVideoRef.current.srcObject = stream;
    }
  };
  // Screen share (mock: just show a placeholder)
  const handleScreen = () => {
    setScreenOn((v) => !v);
  };
  // YouTube sync (mock: just show iframe)
  const handleYoutube = () => {
    setShowYoutube(true);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center py-8 px-2 overflow-hidden">
      {/* Doodle Backgrounds */}
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}
      {/* Falling Petals */}
      <div className="pointer-events-none select-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="fixed animate-bounce-slow text-3xl opacity-20 z-0"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {fallingPetals[Math.floor(Math.random() * fallingPetals.length)]}
          </span>
        ))}
      </div>
      <div className="max-w-4xl w-full bg-white/90 rounded-2xl shadow-lg p-4 flex flex-col items-center relative z-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Video Call</h1>
        {/* Split View */}
        <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
          {/* Local Video */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {cameraOn ? (
                <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">Camera Off</span>
              )}
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">You</div>
          </div>
          {/* Partner Video (mock) */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-5xl">🥰</span>
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">Partner</div>
          </div>
        </div>
        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button onClick={handleCamera} className={`rounded-full px-4 py-2 font-semibold ${cameraOn ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"}`}>{cameraOn ? "Camera On" : "Enable Camera"}</button>
          <button onClick={handleMic} className={`rounded-full px-4 py-2 font-semibold ${micOn ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"}`}>{micOn ? "Mic On" : "Enable Mic"}</button>
          <button onClick={handleScreen} className={`rounded-full px-4 py-2 font-semibold ${screenOn ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"}`}>{screenOn ? "Screen Sharing" : "Share Screen"}</button>
        </div>
        {/* YouTube Watch Together */}
        <div className="w-full bg-pink-50 rounded-lg p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">Watch YouTube Together</div>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Paste YouTube URL..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
            />
            <button onClick={handleYoutube} className="bg-pink-500 hover:bg-pink-600 text-white rounded px-4 py-2">Watch</button>
          </div>
          {showYoutube && youtubeUrl && (
            <div className="w-full aspect-video mt-4 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeUrl.split("v=")[1] || "dQw4w9WgXcQ"}?autoplay=1`}
                title="YouTube video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS:
// @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
// .animate-bounce-slow { animation: bounce-slow 4s infinite; } 