"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VideoCall() {
  const [isCallActive, setIsCallActive] = useState(false);

  const handleStartCall = () => {
    // TODO: Implement WebRTC call logic
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        {isCallActive ? (
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p>Call in progress...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p>Start a video call</p>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {isCallActive ? (
          <Button variant="destructive" onClick={handleEndCall}>
            End Call
          </Button>
        ) : (
          <Button onClick={handleStartCall}>Start Call</Button>
        )}
        <Button variant="outline">
          <span className="mr-2">🎵</span> Share Music
        </Button>
        <Button variant="outline">
          <span className="mr-2">🎬</span> Watch Together
        </Button>
      </div>
    </div>
  );
} 