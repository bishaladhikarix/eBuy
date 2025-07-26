


import Sell from '../components/sell/Sell.tsx';
import UserAccountPage from '../components/account/UserAccountPage.tsx';
import HelpAndContact from '../components/other/HelpAndContact.tsx';
import Admin from '../components/admin/Admin.tsx';
import Default from '../components/home/Defualt.tsx'
import App from './App.tsx';
import UserProfile from '../components/userView/Userprofile.tsx';
import ChatUI from '../components/message/ChatUI.tsx';
import ProductDetail from '../components/productPreview/ProductDetail.tsx';
import Cart from '../components/cart/Cart.tsx';
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
        {path:'message',element:<ChatUI/>},
        {path:'userprofile',element:<UserProfile/>},
        {path:'cart',element:<Cart/>},
        {path:'viewproduct',element:<ProductDetail/>},
        
        ],

    },
    {
        path:'/admin',
        element:<Admin/>
    }
])


    return(


        <RouterProvider router={router}/>

    )
} 
export default Super;


