"use client";

import { useStore } from "@/lib/store";
import Image from "next/image";

interface AvatarProps {
  type: "user" | "partner";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeToPixelsMap = {
  xs: { width: 24, height: 24 },
  sm: { width: 60, height: 60 },
  md: { width: 100, height: 100 },
  lg: { width: 200, height: 200 }
};

const Avatar = ({ type, size = "md", className = "" }: AvatarProps) => {
  const { user, partner } = useStore();
  const dimensions = sizeToPixelsMap[size];
  
  const avatarSubject = type === "user" ? user : partner;
  
  // Default avatar placeholder if no image is provided
  if (!avatarSubject?.avatar) {
    return (
      <div 
        className={`bg-gray-200 rounded-full flex items-center justify-center text-gray-500 ${className}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {avatarSubject?.name ? avatarSubject.name.charAt(0).toUpperCase() : "?"}
      </div>
    );
  }
  
  // Display the user-uploaded avatar
  return (
    <div 
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Image
        src={avatarSubject.avatar}
        alt={`${type === "user" ? "Your" : "Partner's"} avatar`}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// Function to get fallback SVG avatar path based on ID
function getFallbackAvatarPath(avatarId?: string): string | null {
  if (!avatarId) return null;
  
  if (avatarId.startsWith('female')) {
    const number = avatarId.replace('female', '');
    return `/avatars/individual/female/avatar${number}.svg`;
  }
  
  if (avatarId.startsWith('male')) {
    const number = avatarId.replace('male', '');
    return `/avatars/individual/male/avatar${number}.svg`;
  }
  
  return null;
}

export default Avatar; 