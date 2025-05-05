"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SessionHandlerProps {
  onSessionDetected: (sessionId: string) => void;
}

export default function SessionHandler({ onSessionDetected }: SessionHandlerProps) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const sessionId = searchParams?.get("session");
    if (sessionId) {
      onSessionDetected(sessionId);
    }
  }, [searchParams, onSessionDetected]);
  
  return null;
} 