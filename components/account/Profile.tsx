import React, { useState } from 'react';
import './Profile.css';

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  profilePicture: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      title: 'Gaming Laptop',
      category: 'Electronics',
      price: 1299.99,
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      title: 'Wireless Mouse',
      category: 'Accessories',
      price: 79.99,
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      title: '4K Monitor',
      category: 'Electronics',
      price: 399.99,
      image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '4',
      title: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 129.99,
      image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '5',
      title: 'Gaming Headset',
      category: 'Audio',
      price: 89.99,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '6',
      title: 'Smartphone',
      category: 'Electronics',
      price: 699.99,
      image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '7',
      title: 'Tablet',
      category: 'Electronics',
      price: 449.99,
      image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '8',
      title: 'Smartwatch',
      category: 'Wearables',
      price: 299.99,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '9',
      title: 'Bluetooth Speaker',
      category: 'Audio',
      price: 149.99,
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

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

  // PROFILE PICTURE UPLOAD FUNCTIONALITY
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploadingPicture(true);

      // Create a preview URL for immediate UI update
      const previewUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, profilePicture: previewUrl }));

      // BACKEND INTEGRATION:
      // Upload the file to your server
      // const formData = new FormData();
      // formData.append('profilePicture', file);
      // 
      // const response = await fetch('/api/user/profile/picture', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: formData
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to upload profile picture');
      // }
      // 
      // const result = await response.json();
      // setProfile(prev => ({ ...prev, profilePicture: result.imageUrl }));
      // 
      // // Clean up the preview URL
      // URL.revokeObjectURL(previewUrl);

      // Simulate API call
      setTimeout(() => {
        console.log('Profile picture uploaded successfully');
        setIsUploadingPicture(false);
      }, 2000);

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setIsUploadingPicture(false);
      // Revert to original picture on error
      // setProfile(prev => ({ ...prev, profilePicture: originalPictureUrl }));
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Optimistic update - remove product immediately from UI
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));

      // BACKEND INTEGRATION:
      // Make API call to delete product
      // const response = await fetch(`/api/products/${productId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // 
      // if (!response.ok) {
      //   // Revert optimistic update if API call fails
      //   fetchUserProducts(); // Refresh the products list
      //   throw new Error('Failed to delete product');
      // }
      
      console.log(`Product ${productId} deleted`);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Show error message to user
    }
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileSave = () => {
    // BACKEND INTEGRATION:
    // Call updateUserProfile(profile) here
    setIsEditingProfile(false);
    console.log('Profile updated:', profile);
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="profile-products-container">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-picture-container">
          <div className="profile-picture" onClick={() => document.getElementById('profile-picture-input')?.click()}>
            <img src={profile.profilePicture} alt="Profile" />
            {isUploadingPicture && (
              <div className="upload-overlay">
                <div className="upload-spinner"></div>
              </div>
            )}
          </div>
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            style={{ display: 'none' }}
          />
          <div className="profile-picture-text">
            Profile Picture
            <br />
            <span className="edit-hint">(Click to change)</span>
          </div>
        </div>

        <div className="profile-info">
          {isEditingProfile ? (
            <div className="profile-edit-form">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="profile-input"
                placeholder="Name"
              />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="profile-input"
                placeholder="Phone"
              />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="profile-input"
                placeholder="Email"
              />
              <div className="profile-edit-buttons">
                <button onClick={handleProfileSave} className="save-btn">Save</button>
                <button onClick={() => setIsEditingProfile(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <div className="profile-field">
                <strong>Name:</strong> {profile.name}
              </div>
              <div className="profile-field">
                <strong>Phone:</strong> {profile.phone}
              </div>
              <div className="profile-field">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="edit-hint">(User should be able to edit these if they want)</div>
              <button onClick={handleProfileEdit} className="edit-profile-btn">Edit Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-info">
                <div className="product-title">{product.title}</div>
                <div className="product-category">{product.category}</div>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;