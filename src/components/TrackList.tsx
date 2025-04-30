
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Track } from "@/services/musicApi";
import { Heart, MoreHorizontal, Play, Pause } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { userLibrary } from "@/services/musicApi";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TrackListProps {
  tracks: Track[];
  showHeader?: boolean;
  showAlbum?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, showHeader = true, showAlbum = true }) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause, addToQueue, playTrackNext } = usePlayer();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  // Load favorites
  React.useEffect(() => {
    userLibrary.getFavoriteTracks().then(ids => {
      setFavoriteIds(ids);
    });
  }, []);
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };
  
  const handleToggleFavorite = async (track: Track) => {
    const isFavorite = favoriteIds.includes(track.id);
    
    if (isFavorite) {
      await userLibrary.removeFromFavorites(track.id);
      setFavoriteIds(prevIds => prevIds.filter(id => id !== track.id));
    } else {
      await userLibrary.addToFavorites(track.id);
      setFavoriteIds(prevIds => [...prevIds, track.id]);
    }
  };
  
  return (
    <div className="w-full">
      {showHeader && (
        <div className="grid items-center px-6 py-2 border-b border-spotify-light text-spotify-text text-sm font-medium" 
          style={{ 
            gridTemplateColumns: `16px 4fr ${showAlbum ? '2fr' : ''} 1fr 1fr`
          }}
        >
          <div>#</div>
          <div>Title</div>
          {showAlbum && <div>Album</div>}
          <div className="flex justify-end pr-8">Duration</div>
          <div></div>
        </div>
      )}
      
      <div className="divide-y divide-transparent">
        {tracks.map((track, index) => {
          const isActive = currentTrack?.id === track.id;
          const isFavorite = favoriteIds.includes(track.id);
          
          return (
            <div 
              key={track.id} 
              className={cn(
                "grid items-center px-6 py-2 rounded-md group hover:bg-white hover:bg-opacity-10",
                isActive && "bg-white bg-opacity-20"
              )}
              style={{ 
                gridTemplateColumns: `16px 4fr ${showAlbum ? '2fr' : ''} 1fr 1fr`
              }}
            >
              <div className="flex items-center justify-center w-4 text-sm text-spotify-text group-hover:hidden">
                {index + 1}
              </div>
              <button 
                className="hidden group-hover:flex items-center justify-center w-4"
                onClick={() => handlePlayTrack(track)}
              >
                {isActive && isPlaying ? (
                  <Pause size={16} className="text-white" />
                ) : (
                  <Play size={16} className="text-white" fill="white" />
                )}
              </button>
              
              <div className="flex items-center overflow-hidden">
                <div className="ml-3 overflow-hidden">
                  <div className={cn("text-sm font-normal truncate", isActive ? "text-spotify" : "text-white")}>
                    {track.name}
                  </div>
                  <div className="text-xs text-spotify-text truncate">
                    {track.artistName}
                  </div>
                </div>
              </div>
              
              {showAlbum && (
                <div className="text-sm text-spotify-text truncate">
                  {track.albumName}
                </div>
              )}
              
              <div className="flex items-center justify-end text-sm text-spotify-text pr-8">
                {formatDuration(track.playbackSeconds)}
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleToggleFavorite(track)}
                  className={cn(
                    "opacity-0 group-hover:opacity-100 p-2 text-spotify-text hover:text-white",
                    isFavorite && "text-spotify opacity-100"
                  )}
                >
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-spotify-text hover:text-white">
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-spotify-light border-spotify-light text-white" align="end">
                    <DropdownMenuItem 
                      onClick={() => addToQueue(track)}
                      className="hover:bg-white hover:bg-opacity-10"
                    >
                      Add to queue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => playTrackNext(track)}
                      className="hover:bg-white hover:bg-opacity-10"
                    >
                      Play next
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      onClick={() => {
                        navigator.clipboard.writeText(`${track.name} by ${track.artistName}`);
                        toast.success("Copied to clipboard");
                      }}
                      className="hover:bg-white hover:bg-opacity-10"
                    >
                      Copy track info
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;
