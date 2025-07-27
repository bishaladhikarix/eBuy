import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import useAuth from '../hooks/useAuth';
import ProfileImageUpload from './ProfileImageUpload';

interface Product {
  id: string;
  title: string;
  category_name: string;
  price: number | string;
  images: string[];
}

const Profile: React.FC = () => {
  const { user, logout, updateName, Token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Fetch user's products on component mount
  useEffect(() => {
    if (Token) {
      fetchUserProducts();
    }
  }, [Token]);

  const fetchUserProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/my/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const productsData = await response.json();
      setProducts(productsData.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Keep empty array if fetch fails
      setProducts([]);
    }
  };

  // BACKEND INTEGRATION COMMENTS:
  // 
  // 1. FETCHING USER PROFILE:
  // Replace the useState with actual API call to fetch user profile
  // 
  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await fetch('/api/user/profile', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${userToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user profile');
  //     }
  //     
  //     const profileData = await response.json();
  //     setProfile(profileData);
  //   } catch (error) {
  //     console.error('Error fetching profile:', error);
  //   }
  // };
  //
  // 2. UPDATING USER PROFILE:
  // When user edits profile information
  // 
  // const updateUserProfile = async (updatedProfile: UserProfile) => {
  //   try {
  //     const response = await fetch('/api/user/profile', {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${userToken}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(updatedProfile)
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('Failed to update profile');
  //     }
  //     
  //     const result = await response.json();
  //     setProfile(result.profile);
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   }
  // };
  //
  // 3. FETCHING USER'S PRODUCTS:
  // Replace the products useState with API call
  // 
  // const fetchUserProducts = async () => {
  //   try {
  //     const response = await fetch('/api/user/products', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${userToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch products');
  //     }
  //     
  //     const productsData = await response.json();
  //     setProducts(productsData.products || []);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };
  //
  // 4. PAGINATION FOR LARGE PRODUCT LISTS:
  // For better performance with many products
  // 
  // const [currentPage, setCurrentPage] = useState(1);
  // const [hasMoreProducts, setHasMoreProducts] = useState(true);
  // 
  // const fetchMoreProducts = async (page: number) => {
  //   try {
  //     const response = await fetch(`/api/user/products?page=${page}&limit=20`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${userToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     
  //     const data = await response.json();
  //     
  //     if (page === 1) {
  //       setProducts(data.products);
  //     } else {
  //       setProducts(prev => [...prev, ...data.products]);
  //     }
  //     
  //     setHasMoreProducts(data.hasMore);
  //     setCurrentPage(page);
  //   } catch (error) {
  //     console.error('Error fetching more products:', error);
  //   }
  // };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete this product?');
      if (!confirmed) return;

      // Make API call to delete product
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Optimistic update - remove product from UI after successful deletion
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      
      console.log(`Product ${productId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileSave = async () => {
    try {
      // Add more detailed logging
      console.log('Starting profile update...');
      console.log('Current user data:', user);
      console.log('Edited data to save:', editingUser);
      
      // Use the simpler updateName function for just name fields
      console.log('Updating just name fields with:', {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName
      });
      
      // Get token availability from the already destructured user object
      console.log('Token available:', user !== null);
      
      const success = await updateName(
        editingUser.firstName,
        editingUser.lastName
      );

      console.log('Update name result:', success);

      if (success) {
        setIsEditingProfile(false);
        console.log('Name update successful');
      } else {
        console.error('Failed to update name');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Local state for editing user profile
  const [editingUser, setEditingUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Update local editing state when user data changes
  useEffect(() => {
    if (user) {
      setEditingUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="profile-products-container">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-picture-container">
          {isEditingProfile ? (
            <ProfileImageUpload />
          ) : (
            <>
              <div className="profile-picture">
                <img src={user?.profileImage || "https://via.placeholder.com/100"} alt="Profile" />
              </div>
              <div className="profile-picture-text">
                Profile Picture
              </div>
            </>
          )}
        </div>

        <div className="profile-info">
          {isEditingProfile ? (
            <div className="profile-edit-form">
              <input
                type="text"
                value={editingUser.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                className="profile-input"
                placeholder="First Name"
              />
              <input
                type="text"
                value={editingUser.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                className="profile-input"
                placeholder="Last Name"
              />
              <input
                type="tel"
                value={editingUser.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="profile-input"
                placeholder="Phone"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="profile-input"
                placeholder="Email"
              />
              <div className="profile-edit-buttons">
                <button onClick={handleProfileSave} className="btn btn-primary save-btn">Save</button>
                <button onClick={() => setIsEditingProfile(false)} className="btn btn-secondary cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <div className="profile-field">
                <strong>Name:</strong> {user?.firstName} {user?.lastName}
              </div>
              <div className="profile-field">
                <strong>Phone:</strong> {user?.phone || 'Not provided'}
              </div>
              <div className="profile-field">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="edit-hint">(edit here)</div>
              <button onClick={handleProfileEdit} className="btn btn-secondary edit-profile-btn">Edit Profile</button>
              <button onClick={logout} className="btn btn-danger logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h3>My Products</h3>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="product-cards"
                onClick={() => navigate(`/edit-product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/200x150?text=No+Image'} 
                    alt={product.title} 
                  />
                </div>
                <div className="product-info">
                  <div className="product-title">{product.title}</div>
                  <div className="product-category">{product.category_name}</div>
                  <div className="product-price">Rs. {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when deleting
                      handleDeleteProduct(product.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>You haven't listed any products yet.</p>
              <button 
                onClick={() => navigate('/sell')}
                className="add-product-btn"
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;