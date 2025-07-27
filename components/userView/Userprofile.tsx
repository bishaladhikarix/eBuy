
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../context/chatcontext/ChatProvider';
import useAuth from '../hooks/useAuth';
import './Userprofile.css';

interface UserProfileData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  created_at: string;
  product_count: number;
}

interface UserProduct {
  id: number;
  title: string;
  category_name: string;
  price: string;
  images: string[];
}

const Userprofile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { createOrGetRoom } = useChat();
  const { Loggedin, user } = useAuth();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch user data and products when component mounts or userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user profile data
        const userResponse = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userResult = await userResponse.json();
        if (userResult.success) {
          setUserData(userResult.data.user);
        } else {
          throw new Error(userResult.message || 'Failed to fetch user data');
        }

        // Fetch user's products
        const productsResponse = await fetch(`http://localhost:5000/api/products/seller/${userId}`);
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch user products');
        }
        const productsResult = await productsResponse.json();
        if (productsResult.success) {
          setUserProducts(productsResult.data.products || []);
        } else {
          console.warn('Failed to fetch products:', productsResult.message);
          setUserProducts([]); // Set empty array if products fetch fails
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Dummy data (commented out - now using real data from backend)
  /*
  const productsData = [
    {
      id: 1,
      title: "Vintage Leather Handbag",
      category: "Fashion",
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Ceramic Coffee Mug Set",
      category: "Home & Garden",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop"
    },
        {
      id: 2,
      title: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Ceramic Coffee Mug Set",
      category: "Home & Garden",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop"
    },
        {
      id: 2,
      title: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Ceramic Coffee Mug Set",
      category: "Home & Garden",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop"
    },
        {
      id: 2,
      title: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Ceramic Coffee Mug Set",
      category: "Home & Garden",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop"
    },
        {
      id: 2,
      title: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Ceramic Coffee Mug Set",
      category: "Home & Garden",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop"
    }
  ];
  */

  const handleChatClick = async () => {
    // Check if user is logged in
    if (!Loggedin || !user) {
      alert('Please log in to start a chat');
      navigate('/'); // Redirect to login
      return;
    }

    // Check if trying to chat with themselves
    if (userData && user.id === userData.id) {
      alert('You cannot start a chat with yourself');
      return;
    }

    if (!userData) {
      alert('User data not available');
      return;
    }

    try {
      setChatLoading(true);
      
      // Create or get existing chat room with this user
      const room = await createOrGetRoom(userData.id);
      
      if (room) {
        // Navigate to the message page with the room selected
        navigate('/message', { 
          state: { 
            selectedRoomId: room.id,
            otherUser: {
              id: userData.id,
              name: `${userData.first_name} ${userData.last_name}`,
              profileImage: userData.profile_image
            }
          } 
        });
      } else {
        alert('Failed to create chat room. Please try again.');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleProductClick = (product: UserProduct) => {
    // Navigate to product detail page
    navigate(`/viewproduct?id=${product.id}`);
  };

  return (
    <div className="user-profile-container">
      {loading && (
        <div className="loading-state">
          <p>Loading user profile...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && userData && (
        <>
          <div className="profile-header">
            <div className="profile-picturep-container">
              <img 
                src={userData.profile_image || '/api/placeholder/150/150?text=User'} 
                alt="Profile" 
                className="profile-picturep"
              />
            </div>
            
            <div className="profile-info">
              <div className="info-text">
                <p><strong>Full name:</strong> {userData.first_name} {userData.last_name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                {userData.phone && <p><strong>Phone no:</strong> {userData.phone}</p>}
                {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
                <p><strong>Products listed:</strong> {userData.product_count}</p>
              </div>
              <button 
                className="btn btn-primary chat-button" 
                onClick={handleChatClick}
                disabled={chatLoading || !Loggedin}
              >
                {chatLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Starting Chat...
                  </>
                ) : (
                  'Chat'
                )}
              </button>
            </div>
          </div>

          <div className="products-section">
            <h2 className="products-title">Products Listed by {userData.first_name}</h2>
            <div className="products-grid">
              {!Array.isArray(userProducts) || userProducts.length === 0 ? (
                <p>No products listed by this user.</p>
              ) : (
                userProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleProductClick(product);
                      }
                    }}
                  >
                    <div className="product-imagep-container">
                      <img 
                        src={product.images[0] ? `http://localhost:5000${product.images[0]}` : '/api/placeholder/200/150?text=No+Image'} 
                        alt={product.title}
                        className="product-imagep"
                      />
                    </div>
                    <div className="product-details">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-category">{product.category_name}</p>
                      <p className="product-price">Rs. {parseFloat(product.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Userprofile;