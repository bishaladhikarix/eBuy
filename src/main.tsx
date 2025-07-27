import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import AuthProvider from '../context/authcontext/AuthProvider.tsx';
import NoaccountProvider from '../context/loginorsignup/NoaccountProvider.tsx';
import { FavoritesProvider } from '../context/favorites/FavoritesProvider.tsx';
import { CartProvider } from '../context/cart/CartProvider.tsx';
import { SearchProvider } from '../context/searchcontext/SearchProvider.tsx';
import ChatProvider from '../context/chatcontext/ChatProvider.tsx';
import Super from './Super.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NoaccountProvider>
      <AuthProvider>
        <SearchProvider>
          <FavoritesProvider>
            <CartProvider>
              <ChatProvider>
                <Super/>
              </ChatProvider>
            </CartProvider>
          </FavoritesProvider>
        </SearchProvider>
      </AuthProvider>    
    </NoaccountProvider>
  </StrictMode>,
)
