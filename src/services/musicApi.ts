
import { toast } from "sonner";

// Using Napster API - they provide a public API key for development
const API_KEY = "ZTVhYTU3MWEtZjRhNy00MmRmLWJiZDAtNjQwNTAwN2E0ODhi";
const BASE_URL = "https://api.napster.com/v2.2";

export interface Artist {
  id: string;
  name: string;
  albumCount: number;
  trackCount: number;
  bios?: Array<{ bio: string }>;
  blurbs?: string[];
  images?: Array<{ url: string, type: string }>;
}

export interface Album {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  released: string;
  trackCount: number;
  links: {
    images: {
      href: string;
    };
  };
  image?: string; // We'll add this in our transform
}

export interface Track {
  id: string;
  name: string;
  albumId: string;
  albumName: string;
  artistId: string;
  artistName: string;
  playbackSeconds: number;
  previewURL: string;
  isExplicit: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  image?: string;
  tracks?: Track[];
  favorites?: boolean;
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

// Helper function for fetching data
async function fetchData<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  try {
    const queryParams = new URLSearchParams({ apikey: API_KEY, ...params }).toString();
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Failed to fetch music data");
    throw error;
  }
}

// Fetch album image URLs
async function getAlbumImages(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  
  try {
    const response = await fetchData<{images: {id: string, url: string}[]}>(`/albums/${ids.join(",")}/images`);
    const imageMap: Record<string, string> = {};
    
    response.images.forEach(image => {
      if (!imageMap[image.id]) {
        imageMap[image.id] = image.url;
      }
    });
    
    return imageMap;
  } catch (error) {
    console.error("Failed to fetch album images:", error);
    return {};
  }
}

// Get Featured Playlists
export async function getFeaturedPlaylists(): Promise<Playlist[]> {
  const data = await fetchData<{playlists: any[]}>('/playlists/featured', { limit: '10' });
  const playlists = data.playlists.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description || "",
    trackCount: playlist.trackCount,
    image: playlist.links?.images?.href || "",
  }));
  
  return playlists;
}

// Get Top Tracks
export async function getTopTracks(): Promise<Track[]> {
  const data = await fetchData<{tracks: Track[]}>('/tracks/top', { limit: '20' });
  return data.tracks;
}

// Get New Releases
export async function getNewReleases(): Promise<Album[]> {
  const data = await fetchData<{albums: Album[]}>('/albums/new', { limit: '20' });
  
  // Fetch album images
  const albumIds = data.albums.map(album => album.id);
  const imageMap = await getAlbumImages(albumIds);
  
  return data.albums.map(album => ({
    ...album,
    image: imageMap[album.id] || '/placeholder.svg'
  }));
}

// Get Album Tracks
export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const data = await fetchData<{tracks: Track[]}>(`/albums/${albumId}/tracks`);
  return data.tracks;
}

// Search for content
export async function searchContent(query: string, type: 'artists' | 'albums' | 'tracks' = 'tracks'): Promise<any[]> {
  const data = await fetchData<{search: {data: {[key: string]: any[]}}}>('/search', { 
    query,
    type,
    limit: '20'
  });
  
  return data.search.data[type] || [];
}

// Get Genres
export async function getGenres(): Promise<Genre[]> {
  const data = await fetchData<{genres: Genre[]}>('/genres', { limit: '20' });
  return data.genres;
}

// Get tracks by Genre
export async function getTracksByGenre(genreId: string): Promise<Track[]> {
  const data = await fetchData<{tracks: Track[]}>(`/genres/${genreId}/tracks/top`, { limit: '20' });
  return data.tracks;
}

// Mock user library (would normally be stored in a database)
const favoriteTracksStore = localStorage.getItem('favoriteTrackIds') 
  ? JSON.parse(localStorage.getItem('favoriteTrackIds') || '[]') 
  : [];

export const userLibrary = {
  getFavoriteTracks: async (): Promise<string[]> => {
    return favoriteTracksStore;
  },
  
  addToFavorites: async (trackId: string): Promise<void> => {
    if (!favoriteTracksStore.includes(trackId)) {
      favoriteTracksStore.push(trackId);
      localStorage.setItem('favoriteTrackIds', JSON.stringify(favoriteTracksStore));
      toast.success("Added to your library");
    }
  },
  
  removeFromFavorites: async (trackId: string): Promise<void> => {
    const index = favoriteTracksStore.indexOf(trackId);
    if (index !== -1) {
      favoriteTracksStore.splice(index, 1);
      localStorage.setItem('favoriteTrackIds', JSON.stringify(favoriteTracksStore));
      toast.success("Removed from your library");
    }
  },
  
  isFavorite: (trackId: string): boolean => {
    return favoriteTracksStore.includes(trackId);
  }
};
