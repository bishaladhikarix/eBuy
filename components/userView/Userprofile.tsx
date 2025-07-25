
// import { useNavigate } from 'react-router-dom';
import './Userprofile.css';

const Userprofile = () => {
 
  
  // Dummy data - would normally come from backend
  const userData = {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phoneNo: "+1 (555) 123-4567",
    profilePicture: "https://thumbs.dreamstime.com/b/innovative-medical-device-featuring-eye-image-illustrating-advanced-tracking-technology-generated-ai-358374352.jpg"
  };

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
    }
  ];

  const handleChatClick = () => {
    alert('Chat functionality would be implemented here');
  };

  const handleProductClick = (product:any) => {
    // Navigate to product detail page with product data
    // You can pass the entire product object or just the ID
    // navigate(`/product/${product.id}`, { 
    //   state: { product } 
    // });
    console.log(product.id);
    
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-picturep-container">
          <img 
            src={userData.profilePicture} 
            alt="Profile" 
            className="profile-picturep"
          />
        </div>
        
        <div className="profile-info">
          <div className="info-text">
            <p><strong>Full name:</strong> {userData.fullName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone no:</strong> {userData.phoneNo}</p>
          </div>
          <button className="chat-button" onClick={handleChatClick}>
            Chat
          </button>
        </div>
      </div>

      <div className="products-section">
        <h2 className="products-title">Products</h2>
        <div className="products-grid">
          {productsData.map(product => (
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
                  src={product.image} 
                  alt={product.title}
                  className="product-imagep"
                />
              </div>
              <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Userprofile;