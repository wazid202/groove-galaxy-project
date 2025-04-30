
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/contexts/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, ListMusic, Heart, 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { userLibrary } from "@/services/musicApi";
import { toast } from "sonner";

const NowPlaying: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    nextTrack, 
    previousTrack,
    currentTime,
    duration,
    seekToPosition,
    volume,
    setVolume
  } = usePlayer();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setIsFavorite(userLibrary.isFavorite(currentTrack.id));
    }
  }, [currentTrack]);

  const handleToggleFavorite = async () => {
    if (!currentTrack) return;
    
    if (isFavorite) {
      await userLibrary.removeFromFavorites(currentTrack.id);
      setIsFavorite(false);
    } else {
      await userLibrary.addToFavorites(currentTrack.id);
      setIsFavorite(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  
  // If no track is selected, show a minimal player
  if (!currentTrack) {
    return (
      <div className="h-20 bg-spotify-light border-t border-gray-800 flex items-center justify-center text-spotify-text">
        No track selected
      </div>
    );
  }
  
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  return (
    <div className="h-20 bg-spotify-light border-t border-gray-800 px-4 flex items-center justify-between">
      {/* Track info */}
      <div className="flex items-center w-1/4">
        <div className="w-14 h-14 bg-gray-700 rounded">
          {/* Album cover would go here */}
          <div className="w-full h-full flex items-center justify-center text-white text-xs bg-spotify-accent rounded">
            Music
          </div>
        </div>
        <div className="ml-3 overflow-hidden">
          <div className="text-sm font-semibold text-white truncate">
            {currentTrack.name}
          </div>
          <div className="text-xs text-spotify-text truncate">
            {currentTrack.artistName}
          </div>
        </div>
        <button 
          onClick={handleToggleFavorite}
          className={cn(
            "ml-4 p-2 rounded-full hover:bg-black hover:bg-opacity-20",
            isFavorite ? "text-spotify" : "text-spotify-text"
          )}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      {/* Player controls */}
      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={previousTrack}
            className="text-spotify-text hover:text-white p-1"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="bg-white text-black rounded-full p-1.5 hover:scale-105"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-spotify-text hover:text-white p-1"
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="flex items-center w-full gap-2">
          <span className="text-xs text-spotify-text min-w-[40px] text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={0.01}
            className="w-full"
            onValueChange={(value) => seekToPosition(value[0])}
          />
          <span className="text-xs text-spotify-text min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      {/* Volume and queue controls */}
      <div className="flex items-center justify-end w-1/4 gap-3">
        <button 
          onClick={() => setShowQueue(!showQueue)}
          className={cn(
            "p-2 rounded-full hover:bg-black hover:bg-opacity-20",
            showQueue ? "text-spotify" : "text-spotify-text"
          )}
        >
          <ListMusic size={16} />
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="text-spotify-text hover:text-white"
          >
            <VolumeIcon size={16} />
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            className="w-24"
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
