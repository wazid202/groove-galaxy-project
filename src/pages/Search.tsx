
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchContent, Track, Album } from "@/services/musicApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MusicCard from "@/components/MusicCard";
import TrackList from "@/components/TrackList";
import { Skeleton } from "@/components/ui/skeleton";

const Search: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [activeTab, setActiveTab] = useState("tracks");
  
  const { 
    data: tracks, 
    isLoading: tracksLoading 
  } = useQuery({
    queryKey: ['search', 'tracks', query],
    queryFn: () => query ? searchContent(query, 'tracks') : Promise.resolve([]),
    enabled: !!query,
  });
  
  const { 
    data: albums, 
    isLoading: albumsLoading 
  } = useQuery({
    queryKey: ['search', 'albums', query],
    queryFn: () => query ? searchContent(query, 'albums') : Promise.resolve([]),
    enabled: !!query,
  });
  
  const { 
    data: artists, 
    isLoading: artistsLoading 
  } = useQuery({
    queryKey: ['search', 'artists', query],
    queryFn: () => query ? searchContent(query, 'artists') : Promise.resolve([]),
    enabled: !!query,
  });
  
  // If no query, show categories
  if (!query) {
    return (
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Search</h1>
        <p className="text-spotify-text">Enter a search term to find music</p>
      </div>
    );
  }
  
  return (
    <div className="px-6 py-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Search results for "{query}"
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-spotify-light">
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="tracks" className="mt-0">
            {tracksLoading ? (
              <div className="space-y-2">
                {Array(10).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-spotify-light" />
                ))}
              </div>
            ) : tracks && tracks.length > 0 ? (
              <TrackList tracks={tracks as Track[]} />
            ) : (
              <p className="text-spotify-text">No tracks found</p>
            )}
          </TabsContent>
          
          <TabsContent value="albums" className="mt-0">
            {albumsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="w-full aspect-square rounded-md bg-spotify-light" />
                    <Skeleton className="h-4 w-3/4 bg-spotify-light" />
                    <Skeleton className="h-3 w-1/2 bg-spotify-light" />
                  </div>
                ))}
              </div>
            ) : albums && albums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {albums.map((album: Album) => (
                  <MusicCard
                    key={album.id}
                    item={album}
                    type="album"
                  />
                ))}
              </div>
            ) : (
              <p className="text-spotify-text">No albums found</p>
            )}
          </TabsContent>
          
          <TabsContent value="artists" className="mt-0">
            {artistsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="w-full aspect-square rounded-full bg-spotify-light" />
                    <Skeleton className="h-4 w-3/4 mx-auto bg-spotify-light" />
                  </div>
                ))}
              </div>
            ) : artists && artists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {artists.map((artist: any) => (
                  <div key={artist.id} className="flex flex-col items-center p-4 rounded-md hover:bg-spotify-light">
                    <div className="w-full aspect-square rounded-full bg-gray-800 mb-4 overflow-hidden">
                      <img 
                        src="/placeholder.svg" 
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-white font-medium text-center">{artist.name}</h3>
                    <p className="text-xs text-spotify-text">Artist</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-spotify-text">No artists found</p>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Search;
