import React from 'react';
import { Search, X, Coins } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { Member } from '../types';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasPopularItems: boolean;
  currentMember?: Member | null;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick, searchQuery, onSearchChange, hasPopularItems, currentMember }) => {
  const { categories, loading } = useCategories();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  return (
    <div className="w-full" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="flex-1 sm:flex-initial sm:w-64">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                isSearchFocused || searchQuery 
                  ? 'text-white' 
                  : 'text-cafe-textMuted'
              }`} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-10 pr-10 py-1.5 rounded-full text-sm transition-all duration-200 border flex-shrink-0 ${
                  isSearchFocused || searchQuery
                    ? 'text-white border-transparent bg-cafe-primary placeholder-white/70'
                    : 'bg-white/80 border-cafe-primary/25 text-cafe-text placeholder-cafe-textMuted hover:border-cafe-primary/40 hover:bg-white focus:border-cafe-primary focus:ring-2 focus:ring-cafe-primary/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isSearchFocused || searchQuery ? 'text-white/80 hover:text-white' : 'text-cafe-textMuted hover:text-cafe-text'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto scrollbar-hide flex-nowrap">
            {loading ? (
              <div className="flex space-x-4 flex-nowrap">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-8 w-20 glass rounded animate-pulse flex-shrink-0" />
                ))}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onCategoryClick('all')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border flex-shrink-0 whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'text-white border-transparent bg-cafe-primary'
                      : 'bg-white/80 text-cafe-text border-cafe-primary/25 hover:border-cafe-primary/50 hover:bg-cafe-primary/5'
                  }`}
                >
                  All
                </button>
                {hasPopularItems && (
                  <button
                    onClick={() => onCategoryClick('popular')}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border flex-shrink-0 whitespace-nowrap ${
                      selectedCategory === 'popular'
                        ? 'text-white border-transparent bg-cafe-primary'
                        : 'bg-white/80 text-cafe-text border-cafe-primary/25 hover:border-cafe-primary/50 hover:bg-cafe-primary/5'
                    }`}
                  >
                    Popular
                  </button>
                )}
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onCategoryClick(c.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border flex-shrink-0 whitespace-nowrap ${
                      selectedCategory === c.id
                        ? 'text-white border-transparent bg-cafe-primary'
                        : 'bg-white/80 text-cafe-text border-cafe-primary/25 hover:border-cafe-primary/50 hover:bg-cafe-primary/5'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNav;


