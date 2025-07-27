import { createContext, useContext } from 'react';

// Define the shape of a cart item
export interface CartItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller_id: number;
  created_at: string;
  quantity: number;
}

// Define the context type
export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// Create the context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
