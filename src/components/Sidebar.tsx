
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const mainNav = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Your Library", icon: Library, path: "/library" },
  ];
  
  const playlists = [
    { name: "Create Playlist", icon: Plus, path: "/create-playlist" },
    { name: "Liked Songs", icon: Heart, path: "/liked-songs" },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <aside className="bg-black w-64 flex-shrink-0 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-white">Groove Galaxy</span>
        </Link>
      </div>
      
      {/* Main navigation */}
      <nav className="px-2">
        <ul className="space-y-2">
          {mainNav.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-spotify-light text-white"
                    : "text-spotify-text hover:text-white"
                )}
              >
                <item.icon size={24} />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Playlists section */}
      <div className="mt-8 px-6">
        <ul className="space-y-2">
          {playlists.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-4 py-2 text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "text-white"
                    : "text-spotify-text hover:text-white"
                )}
              >
                <div className={cn(
                  "p-1 rounded",
                  item.name === "Liked Songs" ? "bg-gradient-to-br from-indigo-400 to-purple-700" : "bg-spotify-light"
                )}>
                  <item.icon size={16} />
                </div>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Horizontal divider */}
      <div className="mx-6 my-4 border-t border-gray-800" />
      
      {/* Sample playlists */}
      <div className="px-6 flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {["Chill Vibes", "Workout Mix", "Study Focus", "Party Playlist", "Road Trip", "90s Throwbacks"].map((playlist) => (
            <li key={playlist}>
              <Link
                to="#"
                className="block py-1 text-sm text-spotify-text hover:text-white transition-colors"
              >
                {playlist}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
