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
import { Link } from 'react-router-dom';
import UserIcon from '../../account/UserIcon';

const UserActions = () => {
  const [cartCount, setCartCount] = useState(3);
  const [message, setMessage] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);

  // Sample favorite items data - replace with your actual data
  const [favoriteItems, setFavoriteItems] = useState([
    {
      id: 1,
      image: '/api/placeholder/80/60',
      title: 'Gaming Laptop RTX 4080',
      price: '$1,299.99'
    },
    {
      id: 2,
      image: '/api/placeholder/80/60',
      title: 'Wireless Gaming Mouse',
      price: '$79.99'
    },
    {
      id: 3,
      image: '/api/placeholder/80/60',
      title: '4K Gaming Monitor',
      price: '$399.99'
    },
    {
      id: 4,
      image: '/api/placeholder/80/60',
      title: 'Mechanical Keyboard',
      price: '$149.99'
    },
    {
      id: 5,
      image: '/api/placeholder/80/60',
      title: 'Graphics Card RTX 4090',
      price: '$1,599.99'
    }
  ]);

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const removeFavorite = (itemId:any) => {
    setFavoriteItems(favoriteItems.filter(item => item.id !== itemId));
  };

  const handleItemclick = (id:any) =>{
    console.log(id);
    
  }

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
                      <p className="favorite-price">{item.price}</p>
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