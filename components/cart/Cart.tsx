import React, { useState, useEffect } from 'react';
import './Cart.css';

interface CartItem {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Dummy data - Replace with actual API call
  const dummyCartItems: CartItem[] = [
    {
      id: '1',
      title: 'Gaming Laptop RTX 4080',
      description: 'High-performance gaming laptop with RTX 4080 graphics card',
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300',
      price: 1299.99
      
    },
    {
      id: '2',
      title: 'Wireless Gaming Mouse',
      description: 'Ergonomic wireless gaming mouse with RGB lighting',
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 79.99
     
    },
    {
      id: '3',
      title: '4K Gaming Monitor',
      description: '27-inch 4K gaming monitor with 144Hz refresh rate',
      image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 399.99
      
    },
    {
      id: '4',
      title: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches',
      image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 129.99
      
    },
    {
      id: '5',
      title: 'Gaming Headset',
      description: 'Surround sound gaming headset with noise cancellation',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 89.99
      
    }
  ];

  // BACKEND INTEGRATION COMMENTS:
  // 
  // 1. FETCHING CART DATA FROM BACKEND:
  // Replace the useEffect below with actual API call to fetch user's cart items
  // 
  // Example API integration:
  // const fetchCartItems = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('/api/cart', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${userToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch cart items');
  //     }
  //     
  //     const data = await response.json();
  //     setCartItems(data.items || []);
  //   } catch (error) {
  //     console.error('Error fetching cart:', error);
  //     // Handle error - show toast notification or error message
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //
  // 2. REAL-TIME CART UPDATES:
  // Consider using WebSocket or Server-Sent Events for real-time cart updates
  // if multiple devices/tabs can modify the same cart
  //
  // 3. CART PERSISTENCE:
  // For logged-in users: Store cart in database linked to user ID
  // For guest users: Store cart in localStorage or session storage
  // 
  // 4. CART SYNCHRONIZATION:
  // When user logs in, merge localStorage cart with server cart
  // Handle conflicts (same item in both carts) appropriately

  useEffect(() => {
    // Simulate API call with dummy data
    setLoading(true);
    setTimeout(() => {
      setCartItems(dummyCartItems);
      setLoading(false);
    }, 1000);

    // REPLACE WITH ACTUAL API CALL:
    // fetchCartItems();
  }, []);

  // DELETE ITEM FROM CART
  const handleDeleteItem = async (itemId: string) => {
    try {
      // Optimistic update - remove item immediately from UI
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

      // BACKEND INTEGRATION:
      // Make API call to remove item from cart
      // const response = await fetch(`/api/cart/items/${itemId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // 
      // if (!response.ok) {
      //   // Revert optimistic update if API call fails
      //   setCartItems(prevItems => [...prevItems, deletedItem]);
      //   throw new Error('Failed to remove item from cart');
      // }
      
      console.log(`Item ${itemId} deleted from cart`);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Show error message to user
      // Consider reverting the optimistic update
    }
  };

  // CHECKOUT PROCESS
  const handleCheckout = async () => {
    try {
      setLoading(true);

      // BACKEND INTEGRATION FOR CHECKOUT:
      // 1. Validate cart items (check availability, prices)
      // 2. Calculate total with taxes, shipping, discounts
      // 3. Create order in database
      // 4. Process payment
      // 5. Clear cart after successful payment
      // 
      // const checkoutData = {
      //   items: cartItems,
      //   shippingAddress: userShippingAddress,
      //   paymentMethod: selectedPaymentMethod,
      //   couponCode: appliedCoupon
      // };
      // 
      // const response = await fetch('/api/checkout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(checkoutData)
      // });
      // 
      // const result = await response.json();
      // 
      // if (response.ok) {
      //   // Redirect to payment gateway or success page
      //   window.location.href = result.paymentUrl || '/order-success';
      // } else {
      //   throw new Error(result.message || 'Checkout failed');
      // }

      // Simulate checkout process
      setTimeout(() => {
        alert('Checkout successful! (This is a demo)');
        setCartItems([]); // Clear cart after successful checkout
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
      // Show error message to user
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.price), 0);

  if (loading && cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Cart</h2>
        </div>
        <div className="cart-loading">Loading cart items...</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <strong>Total: ${totalPrice.toFixed(2)}</strong>
            </div>
            <button 
              className="checkout-button"
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;