import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FavoritesContext, type FavoriteItem } from './FavoritesContext';
import AuthContext from '../authcontext/AuthContext';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const authContext = useContext(AuthContext);

  // Get user-specific localStorage key
  const getFavoritesKey = (): string => {
    if (authContext?.user?.id) {
      return `favorites_user_${authContext.user.id}`;
    }
    return 'favorites_guest'; // For non-logged in users
  };

  // Load favorites from localStorage when user changes
  useEffect(() => {
    const favoritesKey = getFavoritesKey();
    const savedFavorites = localStorage.getItem(favoritesKey);
    if (savedFavorites) {
      try {
        setFavoriteItems(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
        localStorage.removeItem(favoritesKey);
        setFavoriteItems([]);
      }
    } else {
      setFavoriteItems([]);
    }
  }, [authContext?.user?.id]); // Re-run when user changes

  // Save favorites to localStorage whenever favoriteItems changes
  useEffect(() => {
    const favoritesKey = getFavoritesKey();
    localStorage.setItem(favoritesKey, JSON.stringify(favoriteItems));
  }, [favoriteItems, authContext?.user?.id]);

  const addToFavorites = useCallback((item: FavoriteItem) => {
    setFavoriteItems(prev => {
      // Check if item already exists
      if (prev.some(favItem => favItem.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromFavorites = useCallback((itemId: number) => {
    setFavoriteItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const isFavorite = useCallback((itemId: number) => {
    return favoriteItems.some(item => item.id === itemId);
  }, [favoriteItems]);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const clearFavorites = useCallback(() => {
    setFavoriteItems([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteItems,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
