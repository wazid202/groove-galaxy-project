
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import NowPlaying from "./NowPlaying";

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-spotify-dark">
      <Sidebar />
      
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <TopBar className="flex-shrink-0" />
        
        <div className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </div>
        
        <div className="fixed bottom-0 left-0 right-0">
          <NowPlaying />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
