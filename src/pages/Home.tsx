
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNewReleases, getFeaturedPlaylists, getTopTracks, Genre, getGenres } from "@/services/musicApi";
import MusicCard from "@/components/MusicCard";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  
  const { data: topTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['topTracks'],
    queryFn: getTopTracks,
  });
  
  const { data: newReleases, isLoading: releasesLoading } = useQuery({
    queryKey: ['newReleases'],
    queryFn: getNewReleases,
  });
  
  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ['featuredPlaylists'],
    queryFn: getFeaturedPlaylists,
  });
  
  useEffect(() => {
    // Get genres for categories
    getGenres().then(data => {
      setGenres(data);
    });
  }, []);
  
  return (
    <div className="px-6 py-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Good afternoon</h1>
        
        {/* Top playlists grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlistsLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full bg-spotify-light" />
            ))
          ) : (
            playlists?.slice(0, 6).map(playlist => (
              <div 
                key={playlist.id}
                className="flex bg-spotify-light bg-opacity-70 rounded-md overflow-hidden hover:bg-opacity-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <div className="h-20 w-20 bg-gray-800">
                  <img 
                    src={playlist.image} 
                    alt={playlist.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex items-center p-4 font-semibold text-white">
                  {playlist.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* New Releases Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">New releases</h2>
          <a href="#" className="text-sm font-bold text-spotify-text hover:underline">Show all</a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
          {releasesLoading ? (
            Array(7).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-square rounded-md bg-spotify-light" />
                <Skeleton className="h-4 w-3/4 bg-spotify-light" />
                <Skeleton className="h-3 w-1/2 bg-spotify-light" />
              </div>
            ))
          ) : (
            newReleases?.slice(0, 7).map(album => (
              <MusicCard 
                key={album.id} 
                item={album} 
                type="album" 
                onClick={() => navigate(`/album/${album.id}`)}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Top Tracks Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Popular tracks</h2>
          <a href="#" className="text-sm font-bold text-spotify-text hover:underline">Show all</a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
          {tracksLoading ? (
            Array(7).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-square rounded-md bg-spotify-light" />
                <Skeleton className="h-4 w-3/4 bg-spotify-light" />
                <Skeleton className="h-3 w-1/2 bg-spotify-light" />
              </div>
            ))
          ) : (
            topTracks?.slice(0, 7).map(track => (
              <MusicCard 
                key={track.id} 
                item={track} 
                type="track"
              />
            ))
          )}
        </div>
      </div>
      
      {/* Browse All Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Browse all</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
          {genres.slice(0, 14).map((genre, index) => {
            const colors = [
              'from-purple-500 to-blue-500',
              'from-red-500 to-orange-500',
              'from-green-500 to-emerald-500',
              'from-pink-500 to-rose-500',
              'from-indigo-500 to-purple-500',
              'from-yellow-500 to-amber-500',
              'from-blue-500 to-cyan-500'
            ];
            
            return (
              <div 
                key={genre.id}
                className="aspect-square relative rounded-lg overflow-hidden bg-gradient-to-br cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` 
                }}
                onClick={() => navigate(`/genre/${genre.id}`)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors[index % colors.length]}`}></div>
                <div className="absolute inset-0 p-4 flex items-start">
                  <h3 className="text-xl font-bold text-white">{genre.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
