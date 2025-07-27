import React from 'react';
import { useCart } from '../../context/cart/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  // Use cart context
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      // TODO: Implement actual checkout logic
      const orderData = {
        items: cartItems,
        total: getTotalPrice(),
        timestamp: new Date().toISOString(),
      };

      console.log('Order placed:', orderData);
      alert('Order placed successfully! Check your email for confirmation.');
      clearCart();
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error during checkout. Please try again.');
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button 
            className="clear-cart-btn" 
            onClick={handleClearCart}
            aria-label="Clear entire cart"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart to see them here!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/placeholder-image.jpg'} 
                    alt={item.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">
                    <span className="price">Rs. {parseFloat(item.price).toFixed(2)}</span>
                  </div>
                </div>

                <div className="item-controls">
                  <button
                    className="remove-item-btn"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span className="summary-label">Items:</span>
              <span className="summary-value">
                {cartItems.length} item(s)
              </span>
            </div>
            
            <div className="summary-row total-row">
              <span className="summary-label">Total:</span>
              <span className="summary-value total-price">
                Rs. {getTotalPrice().toFixed(2)}
              </span>
            </div>

            <div className="cart-actions">
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
