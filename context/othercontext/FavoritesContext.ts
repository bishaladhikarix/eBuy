import { createContext, useContext } from 'react';

// Define the shape of a favorite item
export interface FavoriteItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller_id: number;
  created_at: string;
}

// Define the context type
export interface FavoritesContextType {
  favoriteItems: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (itemId: number) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (itemId: number) => boolean;
  clearFavorites: () => void;
}

// Create the context
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Custom hook to use the favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
