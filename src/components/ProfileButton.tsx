import React, { useState } from 'react';
import GoogleLoginModal from './GoogleLoginModal';

const ProfileButton: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGoogleLogin = () => {
    // This would integrate with Google OAuth
    // For now, we'll simulate a login
    setIsSignedIn(true);
    setUserName('John Doe');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    setUserName('');
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <GoogleLoginModal isOpen={showLoginModal} onClose={closeLoginModal} />

      {/* Profile Display */}
      {isSignedIn && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="glass-card rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{userName}</span>
              <button 
                onClick={handleLogout}
                className="text-xs text-purple-600 hover:text-purple-700 transition-colors text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileButton;