
import React from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { Album, Playlist, Track } from "@/services/musicApi";
import { usePlayer } from "@/contexts/PlayerContext";

interface MusicCardProps {
  item: Album | Track | Playlist;
  type: "album" | "track" | "playlist" | "artist";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ 
  item, 
  type, 
  size = "md",
  onClick 
}) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  
  const isTrack = type === "track";
  const track = isTrack ? item as Track : null;
  const isCurrentTrack = currentTrack?.id === track?.id;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isTrack && track) {
      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        playTrack(track);
      }
    }
  };
  
  // Determine image based on type
  let image = "/placeholder.svg";
  let subtitle = "";
  
  if (type === "album") {
    const album = item as Album;
    image = album.image || "/placeholder.svg";
    subtitle = album.artistName;
  } else if (type === "track") {
    const track = item as Track;
    subtitle = track.artistName;
  } else if (type === "playlist") {
    const playlist = item as Playlist;
    image = playlist.image || "/placeholder.svg";
    subtitle = `${playlist.trackCount} tracks`;
  }
  
  const sizeClasses = {
    sm: "w-36",
    md: "w-44", 
    lg: "w-56"
  };
  
  return (
    <div 
      className={cn(
        "rounded-md bg-spotify-light p-4 transition-all duration-300 hover:bg-opacity-70 group cursor-pointer",
        sizeClasses[size]
      )}
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div className={cn(
          "aspect-square rounded bg-black bg-opacity-20 overflow-hidden shadow-lg",
          type === "playlist" ? "rounded-md" : "rounded-md"
        )}>
          <img 
            src={image} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        {isTrack && (
          <button
            onClick={handlePlay}
            className={cn(
              "absolute bottom-2 right-2 rounded-full p-2.5 text-white shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300",
              isCurrentTrack && isPlaying ? "bg-spotify opacity-100 translate-y-0" : "bg-spotify hover:scale-105 hover:bg-spotify-hover"
            )}
          >
            <Play fill="white" size={16} />
          </button>
        )}
      </div>
      
      <div className="truncate">
        <h3 className="font-semibold text-white truncate">{item.name}</h3>
        <p className="text-sm text-spotify-text mt-1 truncate">{subtitle}</p>
      </div>
    </div>
  );
};

export default MusicCard;
