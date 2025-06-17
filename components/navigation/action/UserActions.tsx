import './UserActions.css';
import {Bell,ShoppingCart,Heart} from 'lucide-react';
import { useState } from 'react';
import UserAccount from '../../account/UserAccount';

const UserActions = () => {
  const [cartCount, setCartCount] = useState(3);
  
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
        <Bell size={25} />
        <span className='badge'>2</span>
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
      <UserAccount/>
    </div>
  );
};



export default UserActions;