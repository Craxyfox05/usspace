import { Music, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlaylistCardProps = {
  title: string;
  description: string;
  coverImage?: string;
  trackCount: number;
  isFeatured?: boolean;
  onClick?: () => void;
};

const PlaylistCard = ({
  title,
  description,
  coverImage,
  trackCount,
  isFeatured = false,
  onClick
}: PlaylistCardProps) => {
  return (
    <div 
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl",
        isFeatured ? "col-span-2 row-span-2 md:row-span-1" : ""
      )}
      onClick={onClick}
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 z-10"></div>
      
      {/* Background image or gradient */}
      {coverImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${coverImage})` }}
        ></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-amber-700"></div>
      )}
      
      {/* Content */}
      <div className="relative z-20 p-4 h-full flex flex-col justify-end text-white">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
            <p className="text-sm text-amber-100 line-clamp-2">{description}</p>
          </div>
          
          <div className="flex-shrink-0">
            {!coverImage && (
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-2">
                <Music className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-amber-200">{trackCount} tracks</span>
          
          <Button 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white text-rose-700 hover:bg-amber-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play size={14} className="ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard; 