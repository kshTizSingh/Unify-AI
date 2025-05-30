
import React, { useEffect } from 'react';
import { MenuIcon, CloseIcon } from './ui/icons';
import Sidebar from './Sidebar';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 neuro-button p-3 rounded-xl text-purple-700"
      >
        {isOpen ? (
          <CloseIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="menu-overlay lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={isOpen} onClose={onToggle} />
      </div>
    </>
  );
};

export default MobileMenu;
