import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import AuthProvider from '../context/authcontext/AuthProvider.tsx';
import NotContextProvider from '../context/ls/NotContextProvider.tsx';
import Super from './Super.tsx';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotContextProvider>
      <AuthProvider>

        <Super/>

      </AuthProvider>    
    </NotContextProvider>

  </StrictMode>,
)
