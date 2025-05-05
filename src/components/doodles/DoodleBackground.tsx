import type React from "react";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useState } from "react";

// Use local doodle images 
const classicDoodles = [
  {
    src: "/doodles/classic1.svg",
    className: "doodle top-0 left-4 w-28 md:w-32 floating"
  },
  {
    src: "/doodles/classic2.svg",
    className: "doodle top-10 right-6 w-20 md:w-24 floating floating-delay-2"
  },
  {
    src: "/doodles/classic3.svg",
    className: "doodle bottom-4 left-10 w-24 md:w-28 floating floating-delay-3"
  },
  {
    src: "/doodles/classic4.svg",
    className: "doodle bottom-8 right-6 w-20 md:w-24 floating floating-delay-1"
  }
];

const minimalDoodles = [
  {
    src: "/doodles/minimal1.svg",
    className: "doodle top-0 left-1/3 w-20 md:w-24 floating"
  },
  {
    src: "/doodles/minimal2.svg",
    className: "doodle top-1/2 right-10 w-16 md:w-20 floating floating-delay-2"
  },
  {
    src: "/doodles/minimal3.svg",
    className: "doodle bottom-10 left-1/4 w-16 md:w-20 floating floating-delay-3"
  }
];

const playfulDoodles = [
  {
    src: "/doodles/playful1.svg",
    className: "doodle top-0 left-10 w-20 md:w-24 floating"
  },
  {
    src: "/doodles/playful2.svg",
    className: "doodle top-1/3 right-10 w-16 md:w-20 floating floating-delay-2"
  },
  {
    src: "/doodles/playful3.svg",
    className: "doodle bottom-10 right-1/4 w-20 md:w-24 floating floating-delay-3"
  }
];

// Fallback doodles if images don't load
const fallbackDoodles = {
  classic: [
    { emoji: "❤️", className: "doodle top-0 left-4 w-12 md:w-16 floating" },
    { emoji: "💌", className: "doodle top-10 right-6 w-10 md:w-12 floating floating-delay-2" },
    { emoji: "🧸", className: "doodle bottom-4 left-10 w-12 md:w-14 floating floating-delay-3" },
    { emoji: "💝", className: "doodle bottom-8 right-6 w-10 md:w-12 floating floating-delay-1" }
  ],
  minimal: [
    { emoji: "🤍", className: "doodle top-0 left-1/3 w-10 md:w-12 floating" },
    { emoji: "📎", className: "doodle top-1/2 right-10 w-8 md:w-10 floating floating-delay-2" },
    { emoji: "📱", className: "doodle bottom-10 left-1/4 w-8 md:w-10 floating floating-delay-3" }
  ],
  playful: [
    { emoji: "🎮", className: "doodle top-0 left-10 w-10 md:w-12 floating" },
    { emoji: "🎯", className: "doodle top-1/3 right-10 w-8 md:w-10 floating floating-delay-2" },
    { emoji: "🎪", className: "doodle bottom-10 right-1/4 w-10 md:w-12 floating floating-delay-3" }
  ]
};

const doodleMap: Record<string, typeof classicDoodles> = {
  classic: classicDoodles,
  minimal: minimalDoodles,
  playful: playfulDoodles,
};

const DoodleBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { currentTheme, themes } = useStore();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const theme = themes.find((t) => t.id === currentTheme) || themes[0];
  const doodleStyle = theme.doodleStyle || "classic";
  const doodles = doodleMap[doodleStyle] || classicDoodles;
  
  // Get the appropriate CSS class for the current doodle style
  const doodleThemeClass = `doodle-${doodleStyle}`;

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {doodles.map((d, i) => (
        <div key={i} className={`${d.className} ${doodleThemeClass}`}>
          {imageErrors[i] ? (
            // Show fallback emoji if image fails to load
            <div className="flex items-center justify-center w-full h-full text-4xl">
              {fallbackDoodles[doodleStyle as keyof typeof fallbackDoodles][i]?.emoji || "✨"}
            </div>
          ) : (
            <Image 
              src={d.src} 
              alt={`${doodleStyle} doodle`}
              width={100} 
              height={100} 
              className="w-full h-full object-contain"
              onError={() => handleImageError(i)}
              priority={i < 2} // Priority load first two doodles
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DoodleBackground;
