import './UserActions.css';
import {MessageCircleMore,ShoppingCart,Heart} from 'lucide-react';
import { useState } from 'react';
import UserIcon from '../../account/UserIcon';

const UserActions = () => {
  const [cartCount, setCartCount] = useState(3);
  const [message,setMessage] = useState(0);
  
  return (
    <div className='action-container'>
      {/* Favourite */}
      <button 
        className='icon-button'
      >
        <Heart size={25} />
      </button>
      
      {/* Notifications */}
      <button 
        className='icon-button'
      >
        <MessageCircleMore size={25} />
        <span className='badge'>{message}</span>
      </button>
      
      {/* Shopping Cart */}
      <button 
        className='icon-button'
      >
        <ShoppingCart size={25} />
        {cartCount > 0 && (
          <span className='cart-badge'>{cartCount}</span>
        )}
      </button>
      
      {/* User Profile */}
      <UserIcon/>
    </div>
  );
};



export default UserActions;