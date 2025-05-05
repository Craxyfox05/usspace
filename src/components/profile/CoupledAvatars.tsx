"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import Image from "next/image";

type CoupledAvatarProps = {
  size?: "sm" | "md" | "lg";
  pose?: "default" | "hugging" | "kissing" | "cuddle";
  className?: string;
};

const poseToImageMap = {
  default: "/avatars/couples/hugging.svg", // Default to hugging
  hugging: "/avatars/couples/hugging.svg",
  kissing: "/avatars/couples/kissing.svg",
  cuddle: "/avatars/couples/cuddle.svg"
};

const sizeToPixelsMap = {
  sm: { width: 80, height: 80 },
  md: { width: 150, height: 150 },
  lg: { width: 300, height: 200 }
};

const CoupledAvatars = ({ size = "md", pose = "default", className = "" }: CoupledAvatarProps) => {
  const { user, partner } = useStore();
  const [imagePath, setImagePath] = useState<string>(poseToImageMap[pose]);
  const dimensions = sizeToPixelsMap[size];

  // Randomly change poses at intervals if pose is set to "default"
  useEffect(() => {
    if (pose === "default") {
      // Set initial pose
      const poses = Object.keys(poseToImageMap) as Array<keyof typeof poseToImageMap>;
      const randomPose = poses[Math.floor(Math.random() * poses.length)];
      setImagePath(poseToImageMap[randomPose]);
      
      // Don't set interval if we're in a specific pose
      return;
    }
    
    // If a specific pose is requested, use that
    setImagePath(poseToImageMap[pose]);
  }, [pose]);

  // If no partner, or if user or partner has no avatar, don't show coupled avatar
  if (!partner || !user?.avatarId || !partner?.avatarId) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imagePath}
        alt="Couple avatar"
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default CoupledAvatars; 