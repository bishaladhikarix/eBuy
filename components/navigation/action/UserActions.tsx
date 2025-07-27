// import './UserActions.css';
// import {MessageCircleMore,ShoppingCart,Heart} from 'lucide-react';
// import { useState } from 'react';
// import UserIcon from '../../account/UserIcon';

// const UserActions = () => {
//   const [cartCount, setCartCount] = useState(3);
//   const [message,setMessage] = useState(0);
  
//   return (
//     <div className='action-container'>
      
//       <button 
//         className='icon-button'
//       >
//         <Heart size={25} />
//       </button>
      
      
//       <button 
//         className='icon-button'
//       >
//         <MessageCircleMore size={25} />
//         <span className='badge'>{message}</span>
//       </button>
      
      
//       <button 
//         className='icon-button'
//       >
//         <ShoppingCart size={25} />
//         {cartCount > 0 && (
//           <span className='cart-badge'>{cartCount}</span>
//         )}
//       </button>
      
      
//       <UserIcon/>
//     </div>
//   );
// };



// export default UserActions;


import './UserActions.css';
import {MessageCircleMore,ShoppingCart,Heart,X} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../../context/favorites/FavoritesContext';
import { useCart } from '../../../context/cart/CartContext';
import UserIcon from '../../account/UserIcon';

const UserActions = () => {
  const navigate = useNavigate();
  const [message] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);

  // Use contexts for favorites and cart
  const { favoriteItems, removeFromFavorites } = useFavorites();
  const { getTotalItems } = useCart();

  const cartCount = getTotalItems();

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const removeFavorite = (itemId: number) => {
    removeFromFavorites(itemId);
  };

  const handleItemclick = (id: number) => {
    // Navigate to product detail page
    navigate(`/viewproduct?id=${id}`);
    // Close the favorites popup
    setShowFavorites(false);
  };

  return (
    <div className='action-container'>
      {/* Favourite */}
      <button
        className='icon-button'
        onClick={toggleFavorites}
      >
        <Heart size={25} />
      </button>

      {/* Favorites Popup */}
      {showFavorites && (
        <>
          <div className="favorites-overlay" onClick={toggleFavorites}></div>
          <div className="favorites-popup">
            <div className="favorites-header">
              <h3>Favorites</h3>
            </div>
            <div className="favorites-list">
              {favoriteItems.length === 0 ? (
                <div className="empty-favorites">
                  <Heart size={48} color="#d1d5db" />
                  <p>No favorites yet</p>
                </div>
              ) : (
                favoriteItems.map((item) => (
                  <div key={item.id} className="favorite-item" onClick={(e)=>{
                    e.stopPropagation();
                    handleItemclick(item.id);
                  }}>
                    <div className="favorite-image">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="favorite-details">
                      <h4 className="favorite-title">{item.title}</h4>
                      <p className="favorite-price">Rs. {parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <button 
                      className="remove-favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(item.id);
                      }}
                      title="Remove from favorites"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Message */}
      <button
        className='icon-button'
      >
        <Link to={'/message'}><MessageCircleMore size={25} /> </Link>
        
        <span className='badge'>{message}</span>
      </button>

      {/* Shopping Cart */}
      <button
        className='icon-button'
      >
        <Link to={'/cart'}><ShoppingCart size={25} /> </Link>
        
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