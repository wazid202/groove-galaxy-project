
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Bell, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopBarProps {
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={`h-16 flex items-center justify-between px-6 bg-spotify-dark bg-opacity-95 backdrop-blur-md ${className}`}>
      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-70 text-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button 
          onClick={() => navigate(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-70 text-white"
        >
          <ChevronRight size={18} />
        </button>
        
        {/* Search bar - visible only on search page */}
        {location.pathname.startsWith("/search") && (
          <form onSubmit={handleSearch} className="relative ml-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 py-1.5 bg-white bg-opacity-10 border-none rounded-full text-sm focus-visible:ring-offset-0 focus-visible:ring-transparent"
            />
          </form>
        )}
      </div>

      {/* User actions */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" className="bg-white text-black rounded-full px-5 hover:scale-105">
          Upgrade
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full bg-black bg-opacity-70 text-white hover:bg-spotify-light">
          <Bell size={18} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-black bg-opacity-70 hover:bg-spotify-light">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-spotify-accent text-white font-medium">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-spotify-light border-spotify-light text-white">
            <DropdownMenuItem className="hover:bg-white hover:bg-opacity-10">
              Account
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white hover:bg-opacity-10">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white hover:bg-opacity-10">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white hover:bg-opacity-10">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;
