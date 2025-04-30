
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAlbumTracks, Track } from "@/services/musicApi";
import TrackList from "@/components/TrackList";
import { Play, Pause, Clock3 } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AlbumView: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const [albumInfo, setAlbumInfo] = useState<any>(null);
  
  const { data: tracks, isLoading } = useQuery({
    queryKey: ['albumTracks', albumId],
    queryFn: () => albumId ? getAlbumTracks(albumId) : Promise.resolve([]),
    enabled: !!albumId,
  });
  
  // Get album info from first track
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      const firstTrack = tracks[0];
      setAlbumInfo({
        name: firstTrack.albumName,
        artist: firstTrack.artistName,
        year: new Date().getFullYear(), // Would normally get this from API
        trackCount: tracks.length
      });
    }
  }, [tracks]);
  
  const handlePlayAlbum = () => {
    if (!tracks || tracks.length === 0) return;
    
    if (currentTrack && tracks.some(track => track.id === currentTrack.id) && isPlaying) {
      togglePlayPause();
    } else {
      playTrack(tracks[0]);
    }
  };
  
  const isAlbumPlaying = currentTrack && tracks && tracks.some(track => track.id === currentTrack.id) && isPlaying;
  
  return (
    <div>
      {/* Album header */}
      <div className="bg-gradient-to-b from-purple-900 to-spotify-dark p-8 flex items-end gap-6">
        {isLoading || !albumInfo ? (
          <Skeleton className="w-48 h-48 bg-spotify-light" />
        ) : (
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg w-48 h-48 flex items-center justify-center">
            <img 
              src="/placeholder.svg" 
              alt={albumInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div>
          <p className="uppercase text-sm font-bold mb-2">Album</p>
          {isLoading || !albumInfo ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-64 bg-spotify-light" />
              <Skeleton className="h-5 w-48 bg-spotify-light" />
              <Skeleton className="h-5 w-32 bg-spotify-light" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white">{albumInfo.name}</h1>
              <div className="flex items-center text-sm">
                <span className="text-white font-medium">{albumInfo.artist}</span>
                <span className="mx-1 text-spotify-text">•</span>
                <span className="text-spotify-text">{albumInfo.year}</span>
                <span className="mx-1 text-spotify-text">•</span>
                <span className="text-spotify-text">{albumInfo.trackCount} songs</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Album content */}
      <div className="p-6 bg-gradient-to-b from-transparent to-spotify-dark">
        {/* Play button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="h-14 w-14 rounded-full bg-spotify text-white hover:bg-spotify-hover hover:scale-105"
            onClick={handlePlayAlbum}
            disabled={isLoading || !tracks || tracks.length === 0}
          >
            {isAlbumPlaying ? (
              <Pause size={24} fill="white" />
            ) : (
              <Play size={24} fill="white" className="ml-1" />
            )}
          </Button>
        </div>
        
        {/* Tracks */}
        {isLoading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-spotify-light" />
            ))}
          </div>
        ) : (
          <TrackList tracks={tracks || []} showAlbum={false} />
        )}
      </div>
    </div>
  );
};

export default AlbumView;
