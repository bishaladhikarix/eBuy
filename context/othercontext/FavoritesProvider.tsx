import React, { ReactNode, useState, useEffect } from 'react';
import { FavoritesContext, FavoriteItem, FavoritesContextType } from './FavoritesContext';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavoriteItems(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever favoriteItems changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const addToFavorites = (item: FavoriteItem) => {
    setFavoriteItems(prev => {
      // Check if item already exists
      if (prev.some(favItem => favItem.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromFavorites = (itemId: number) => {
    setFavoriteItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleFavorite = (item: FavoriteItem) => {
    const isCurrentlyFavorite = favoriteItems.some(favItem => favItem.id === item.id);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  const isFavorite = (itemId: number): boolean => {
    return favoriteItems.some(item => item.id === itemId);
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
  };

  const contextValue: FavoritesContextType = {
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
