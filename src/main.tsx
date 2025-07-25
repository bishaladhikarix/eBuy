import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import AuthProvider from '../context/authcontext/AuthProvider.tsx';

import Super from './Super.tsx';



createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <AuthProvider>

      <Super/>

    </AuthProvider>    

  </StrictMode>,
)
