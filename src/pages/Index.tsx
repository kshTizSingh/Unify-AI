import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileMenu from '../components/MobileMenu';
import ProfileButton from '../components/ProfileButton';
import Chat from './Chat';
import Comparison from './Comparison';
import ImageGeneration from './ImageGeneration';
import VideoGeneration from './VideoGeneration';
import Research from './Research';

const Index: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex w-full relative overflow-hidden">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />

      {/* Main Content - Takes remaining space and has its own scroll */}
      <div className="flex-1 lg:ml-0 h-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/image-generation" element={<ImageGeneration />} />
          <Route path="/video-generation" element={<VideoGeneration />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </div>

      {/* Profile Button - only show when user is signed in */}
      <ProfileButton />
    </div>
  );
};

export default Index;
