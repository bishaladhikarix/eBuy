import React, { useState, type ReactNode } from 'react';
import { SearchContext, type SearchContextType } from './SearchContext';

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
  };

  const value: SearchContextType = {
    searchText,
    selectedCategory,
    setSearchText,
    setSelectedCategory,
    clearFilters,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
