


import Sell from '../components/sell/Sell.tsx';
import UserAccountPage from '../components/account/UserAccountPage.tsx';
import HelpAndContact from '../components/other/HelpAndContact.tsx';
import Admin from '../components/admin/Admin.tsx';
import Default from '../components/home/Defualt.tsx'
import App from './App.tsx';
import AuthProvider from '../context/authcontext/AuthProvider.tsx';
import NotContextProvider from '../context/ls/NotContextProvider.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';

const Super = () =>{
    const router = createBrowserRouter ([
    {
        path:'/',
        element:<App/>,
        children:[
        {index:true,element:<Default/>},
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


    return(
        <NotContextProvider>
            <AuthProvider>

                <RouterProvider router={router}/>

            </AuthProvider> 
        </NotContextProvider>  
    )
} 
export default Super;


