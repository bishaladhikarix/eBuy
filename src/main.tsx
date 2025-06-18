import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Sell from '../components/sell/Sell.tsx';
import UserAccountPage from '../components/account/UserAccountPage.tsx';
import HelpAndContact from '../components/other/HelpAndContact.tsx';
import Admin from '../components/admin/Admin.tsx';

import App from './App.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';

const router = createBrowserRouter ([
  {
    path:'/',
    element:<App/>,
    children:[
      {path:'sell',element:<Sell/>},
      {path:'account',element:<UserAccountPage/>},
      {path:'help',element:<HelpAndContact/>},
    ],

  },
  {
    path:'/admin',
    element:<Admin/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
