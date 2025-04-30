
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { Track } from "@/services/musicApi";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekToPosition: (position: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  playTrackNext: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener("durationchange", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("ended", () => {
      nextTrack();
    });
    
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", () => {});
      audio.removeEventListener("durationchange", () => {});
      audio.removeEventListener("ended", () => {});
    };
  }, []);
  
  // Set volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Update audio source when track changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    
    audioRef.current.src = currentTrack.previewURL;
    audioRef.current.load();
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Playback error:", error);
        setIsPlaying(false);
      });
    }
  }, [currentTrack]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Playback error:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);
  
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const nextTrack = () => {
    if (queue.length === 0) {
      setIsPlaying(false);
      return;
    }
    
    // Play next track from queue and remove it
    const nextTrack = queue[0];
    setQueue(prevQueue => prevQueue.slice(1));
    playTrack(nextTrack);
  };
  
  const previousTrack = () => {
    // For now, just restart current track
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  const seekToPosition = (position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
    }
  };
  
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };
  
  const addToQueue = (track: Track) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };
  
  const playTrackNext = (track: Track) => {
    setQueue(prevQueue => [track, ...prevQueue]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  const value = {
    currentTrack,
    isPlaying,
    queue,
    volume,
    currentTime,
    duration,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekToPosition,
    setVolume,
    addToQueue,
    clearQueue,
    playTrackNext,
  };
  
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  
  return context;
};
