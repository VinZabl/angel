import React from 'react';
import { ShoppingCart, Coins } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Member } from '../types';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onMemberClick?: () => void;
  currentMember?: Member | null;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick, onMemberClick, currentMember }) => {
  const { siteSettings } = useSiteSettings();

  return (
    <header className="w-full" style={{
      background: 'rgba(250, 249, 246, 0.85)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 md:py-2">
        <div className="flex items-center justify-between min-h-10 md:min-h-12">
          <button 
            onClick={onMenuClick}
            className="text-cafe-text hover:text-cafe-primary transition-colors duration-200 flex items-center gap-3"
          >
            <img 
              src="/logo.png" 
              alt="Angel Game Credits Logo"
              className="h-10 sm:h-12 md:h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-base sm:text-lg md:text-lg font-bold text-cafe-text whitespace-nowrap">
              Angel Game Credits
            </span>
          </button>

          <div className="flex items-center space-x-2">
            {currentMember && (
              <div className="hidden md:flex items-center gap-2 mr-2">
                <p className="text-sm text-cafe-text">
                  <span className="text-cafe-textMuted">Welcome back,</span> <span className="font-semibold ml-2">{currentMember.username}</span>
                </p>
              </div>
            )}
            {onMemberClick && (
              <button 
                onClick={onMemberClick}
                className="p-2 text-cafe-text hover:text-cafe-primary hover:bg-cafe-primary/15 rounded-full transition-all duration-200"
              >
                {currentMember?.user_type === 'reseller' ? (
                  <Coins className="h-6 w-6 text-amber-500" />
                ) : (
                  <Coins className="h-6 w-6" />
                )}
              </button>
            )}
            <button 
              onClick={onCartClick}
              className="relative p-2 text-cafe-text hover:text-cafe-primary hover:bg-cafe-primary/10 rounded-full transition-all duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cafe-primary to-cafe-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle glow-blue">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;