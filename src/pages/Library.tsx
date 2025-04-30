
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userLibrary, getTopTracks, Track } from "@/services/musicApi";
import TrackList from "@/components/TrackList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Library: React.FC = () => {
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  
  const { data: topTracks, isLoading: topTracksLoading } = useQuery({
    queryKey: ['topTracks'],
    queryFn: getTopTracks,
  });
  
  useEffect(() => {
    // Get user's liked tracks
    userLibrary.getFavoriteTracks().then(trackIds => {
      setLikedTrackIds(trackIds);
    });
  }, []);
  
  useEffect(() => {
    if (topTracks && likedTrackIds.length > 0) {
      const filteredTracks = topTracks.filter(track => likedTrackIds.includes(track.id));
      setLikedTracks(filteredTracks);
    }
  }, [topTracks, likedTrackIds]);
  
  return (
    <div className="px-6 py-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Your Library</h1>
      
      <Tabs defaultValue="liked-songs">
        <TabsList className="bg-spotify-light mb-6">
          <TabsTrigger value="liked-songs">Liked Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>
        
        <TabsContent value="liked-songs">
          <div className="bg-gradient-to-b from-purple-700 to-spotify-dark p-8 rounded-t-lg">
            <div className="flex items-end gap-6">
              <div className="bg-gradient-to-br from-purple-400 to-purple-800 shadow-lg w-48 h-48 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-24 h-24 opacity-70">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </div>
              <div>
                <p className="uppercase text-sm font-bold mb-2">Playlist</p>
                <h1 className="text-8xl font-bold mb-6 text-white">Liked Songs</h1>
                <p className="text-white opacity-80">{likedTracks.length} songs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-from-transparent-to-spotify-dark p-6">
            {topTracksLoading ? (
              <div className="space-y-2 mt-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-spotify-light" />
                ))}
              </div>
            ) : likedTracks.length > 0 ? (
              <TrackList tracks={likedTracks} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-bold text-white mb-2">Songs you like will appear here</h2>
                <p className="text-spotify-text">Save songs by tapping the heart icon.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="playlists">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Create your first playlist</h2>
            <p className="text-spotify-text">It's easy, we'll help you.</p>
            <button className="mt-4 bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
              Create playlist
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="artists">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Follow your first artist</h2>
            <p className="text-spotify-text">Follow artists you like by tapping the follow button.</p>
            <button className="mt-4 bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
              Browse artists
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="albums">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Save your first album</h2>
            <p className="text-spotify-text">Save albums by tapping the heart icon.</p>
            <button className="mt-4 bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
              Browse albums
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
