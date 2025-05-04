import type React from "react";
import Image from "next/image";
import { useStore } from "@/lib/store";

const classicDoodles = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    className: "doodle top-0 left-4 w-28 md:w-32 floating"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    className: "doodle top-10 right-6 w-20 md:w-24 floating floating-delay-2"
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    className: "doodle bottom-4 left-10 w-24 md:w-28 floating floating-delay-3"
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80",
    className: "doodle bottom-8 right-6 w-20 md:w-24 floating floating-delay-1"
  }
];

const minimalDoodles = [
  {
    src: "https://em-content.zobj.net/source/microsoft-teams/337/white-heart_1f90d.png",
    className: "doodle top-0 left-1/3 w-20 md:w-24 floating"
  },
  {
    src: "https://em-content.zobj.net/source/microsoft-teams/337/paperclip_1f4ce.png",
    className: "doodle top-1/2 right-10 w-16 md:w-20 floating floating-delay-2"
  },
  {
    src: "https://em-content.zobj.net/source/microsoft-teams/337/mobile-phone_1f4f1.png",
    className: "doodle bottom-10 left-1/4 w-16 md:w-20 floating floating-delay-3"
  }
];

const playfulDoodles = [
  {
    src: "https://em-content.zobj.net/source/microsoft-teams/337/video-game_1f3ae.png",
    className: "doodle top-0 left-10 w-20 md:w-24 floating"
  },
  {
    src: "https://em-content.zobj.net/source/microsoft-teams/337/direct-hit_1f3af.png",
    className: "doodle top-1/3 right-10 w-16 md:w-20 floating floating-delay-2"
  },
  {
    src: "https://em-content.zobj.net/source/microsoft-teams/337/circus-tent_1f3aa.png",
    className: "doodle bottom-10 right-1/4 w-20 md:w-24 floating floating-delay-3"
  }
];

const doodleMap: Record<string, typeof classicDoodles> = {
  classic: classicDoodles,
  minimal: minimalDoodles,
  playful: playfulDoodles,
};

const DoodleBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { currentTheme, themes } = useStore();
  const theme = themes.find((t) => t.id === currentTheme) || themes[0];
  const doodleStyle = theme.doodleStyle || "classic";
  const doodles = doodleMap[doodleStyle] || classicDoodles;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {doodles.map((d, i) => (
        <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
      ))}
    </div>
  );
};

export default DoodleBackground;
