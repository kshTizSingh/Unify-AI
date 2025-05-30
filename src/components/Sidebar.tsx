import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatIcon, ImageIcon, VideoIcon, ResearchIcon, CompareIcon, PlusIcon } from './ui/icons';
import CreditsPurchase from './CreditsPurchase';
import GoogleLoginModal from './GoogleLoginModal';
import { useUser } from '../context/UserContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const [showCreditsPurchase, setShowCreditsPurchase] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout } = useUser();
  
  const navigationItems = [
    { name: 'Chat', icon: ChatIcon, path: '/chat' },
    { name: 'Image Generation', icon: ImageIcon, path: '/image-generation', isPro: true, label: 'Coming Soon' },
    { name: 'Video Generation', icon: VideoIcon, path: '/video-generation', isPro: true, label: 'Coming Soon' },
    { name: 'Research', icon: ResearchIcon, path: '/research' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || (path === '/chat' && location.pathname === '/');
  };

  return (
    <>
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-50/90 to-white/90 
        backdrop-blur-xl border-r border-purple-200/50 z-30 transition-transform duration-300
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Header with only logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img 
                src="/unify-ai-logo.png" 
                alt="UnifyAI Logo" 
                className="h-8 w-32 object-contain"
              />
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-purple-100/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Buttons with reduced shadow */}
          <div className="space-y-3 mb-8">
            <Link 
              to="/chat"
              className="neuro-button flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-purple-700 font-semibold 
                       shadow-[0_0_10px_rgba(163,116,255,0.2)] hover:shadow-[0_0_15px_rgba(163,116,255,0.3)] 
                       transition-all duration-300"
            >
              <PlusIcon className="w-4 h-4" />
              Start New Chat
            </Link>
            
            <Link 
              to="/comparison"
              className="neuro-button flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-purple-700 font-semibold
                       shadow-[0_0_10px_rgba(163,116,255,0.2)] hover:shadow-[0_0_15px_rgba(163,116,255,0.3)] 
                       transition-all duration-300"
            >
              <CompareIcon className="w-4 h-4" />
              Comparison Mode
            </Link>
          </div>

          {/* Tools Section */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-4 tracking-tighter">Tools</h3>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 font-semibold
                    ${isActiveRoute(item.path) 
                      ? 'bg-purple-100/70 text-purple-700 shadow-sm shadow-[0_0_15px_rgba(163,116,255,0.4)]' 
                      : 'text-gray-600 hover:bg-purple-50/50 hover:text-purple-600 hover:shadow-[0_0_10px_rgba(163,116,255,0.2)]'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="opacity-80">{item.name}</span>
                  {item.isPro && (
                    <span className="text-xs font-bold text-purple-500 ml-auto">{item.label || 'PRO'}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Credits Display */}
          <div className="glass-card p-4 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Credits</span>
              <span className="text-lg font-semibold text-purple-600">{user.credits}</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" 
                style={{width: `${Math.min((user.credits / 100) * 100, 100)}%`}}
              ></div>
            </div>
            <button 
              onClick={() => setShowCreditsPurchase(true)}
              className="neuro-button w-full py-2 px-4 rounded-lg text-sm font-semibold text-purple-700"
            >
              Upgrade Plan
            </button>
          </div>

          {/* Login Button or User Profile */}
          <div className="mt-auto">
            {user.isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-purple-700">{user.name}</span>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="neuro-button w-full py-2 px-4 rounded-xl text-purple-700 font-semibold text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="neuro-button w-full py-3 px-4 rounded-xl text-purple-700 font-semibold"
              >
                Login/Signup
              </button>
            )}
          </div>
        </div>
      </div>

      <CreditsPurchase 
        isOpen={showCreditsPurchase} 
        onClose={() => setShowCreditsPurchase(false)} 
      />
      
      <GoogleLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Sidebar;