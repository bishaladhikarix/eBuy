import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/favorites/FavoritesContext';
import { useCart } from '../../context/cart/CartContext';
import './ProductDetail.css';

interface Product {
  id: number;
  title: string;
  category_name: string; // Backend returns category_name
  price: string; // Backend returns price as string
  images: string[]; // Backend returns array of image paths
  description?: string;
  condition?: string;
  brand?: string;
  model?: string;
  seller_id?: number;
  seller_name?: string;
  first_name?: string;
  last_name?: string;
  seller_email?: string;
  created_at?: string;
}

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('id');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

    // Context hooks
  const { toggleFavorite, isFavorite } = useFavorites();
  const { cartItems, addToCart } = useCart();

  // All hooks must be called before any early returns
  const nextPhoto = useCallback(() => {
    if (product?.images) {
      setCurrentPhotoIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [product?.images]);

  const prevPhoto = useCallback(() => {
    if (product?.images) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  }, [product?.images]);

  const goToPhoto = useCallback((index: number) => {
    setCurrentPhotoIndex(index);
  }, []);

  const openLightbox = useCallback(() => {
    setShowLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
  }, []);

  const handleToggleFavorite = useCallback(() => {
    if (product) {
      const favoriteItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || '/api/placeholder/300/200?text=No+Image',
        category_name: product.category_name,
      };
      toggleFavorite(favoriteItem);
    }
  }, [product, toggleFavorite]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      // Check if item is already in cart
      const isAlreadyInCart = cartItems.some(item => item.id === product.id);
      
      if (isAlreadyInCart) {
        alert('This item is already in your cart!');
        return;
      }

      const cartItem = {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.images[0] || '/api/placeholder/300/200?text=No+Image',
        category_name: product.category_name,
      };
      addToCart(cartItem);
      alert('Added to cart!');
    }
  }, [product, addToCart, cartItems]);

  const openChat = useCallback(() => {
    // TODO: Open chat with seller
    console.log('Opening chat with:', product?.seller_name);
    alert('Opening chat...');
  }, [product?.seller_name]);

  const viewSellerProfile = useCallback(() => {
    if (product?.seller_id) {
      navigate(`/userprofile/${product.seller_id}`);
    }
  }, [product?.seller_id, navigate]);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      prevPhoto();
    } else if (event.key === 'ArrowRight') {
      nextPhoto();
    } else if (event.key === 'Escape' && showLightbox) {
      closeLightbox();
    } else if (event.key === 'Enter' && !showLightbox) {
      openLightbox();
    }
  }, [nextPhoto, prevPhoto, showLightbox, closeLightbox, openLightbox]);

  // Format price
  const formatPrice = useCallback((price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(numPrice);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const result = await response.json();
        if (!result.success || !result.data?.product) {
          throw new Error('Product not found');
        }

        setProduct(result.data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle loading and error states AFTER all hooks
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-state">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <p>Error: {error || 'Product not found'}</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  // Prepare photos array (use images from backend)
  const photos = product.images && product.images.length > 0 
    ? product.images 
    : [];

  // For profile image, use first product image as fallback
  const profileImage = photos.length > 0 ? photos[0] : '/api/placeholder/100/100?text=Seller';

  return (
    <div className="product-detail-container" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-picture" onClick={viewSellerProfile} style={{ cursor: 'pointer' }}>
          <img src={profileImage} alt={`${product.seller_name || 'Seller'}'s profile`} />
        </div>
        <div className="name-field">
          <button 
            type="button"
            className="seller-name-btn"
            onClick={viewSellerProfile}
            aria-label={`View ${product.seller_name || 'seller'}'s profile`}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '8px 12px',
              fontSize: 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              textDecoration: 'underline'
            }}
          >
            {product.seller_name || 'Unknown Seller'}
          </button>
        </div>
      </div>

      {/* Left Column */}
      <div className="left-column">
        {/* Photo Slide with Enhanced Features */}
        <div className="photo-slide">
          <div className="photo-container">
            <button 
              className="nav-button prev" 
              onClick={prevPhoto}
              aria-label="Previous photo"
              type="button"
              disabled={photos.length <= 1}
            >
              ‹
            </button>
            
            <div className="main-image-wrapper" onClick={openLightbox}>
              {imageLoading && (
                <div className="image-loading">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <img 
                src={`http://localhost:5000${photos[currentPhotoIndex]}`}
                alt={`${product.title} - Image ${currentPhotoIndex + 1} of ${photos.length}`}
                className="product-photo"
                onLoadStart={handleImageLoadStart}
                onLoad={handleImageLoad}
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/300?text=Image+Not+Found';
                  setImageLoading(false);
                }}
              />
              <div className="image-overlay">
                <span className="zoom-hint">Click to zoom</span>
              </div>
            </div>
            
            <button 
              className="nav-button next" 
              onClick={nextPhoto}
              aria-label="Next photo"
              type="button"
              disabled={photos.length <= 1}
            >
              ›
            </button>
          </div>

          {/* Thumbnail Navigation */}
          {photos.length > 1 && (
            <div className="thumbnail-container">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={() => goToPhoto(index)}
                  aria-label={`Go to photo ${index + 1}`}
                  type="button"
                >
                  <img 
                    src={`http://localhost:5000${photo}`}
                    alt={`Thumbnail ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/80/60?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Photo Counter */}
          <div className="photo-counter">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="product-info-details">
          <h3>Product Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{product.category_name}</span>
            </div>
            {product.brand && (
              <div className="info-item">
                <span className="info-label">Brand:</span>
                <span className="info-value">{product.brand}</span>
              </div>
            )}
            {product.model && (
              <div className="info-item">
                <span className="info-label">Model:</span>
                <span className="info-value">{product.model}</span>
              </div>
            )}
            {product.condition && (
              <div className="info-item">
                <span className="info-label">Condition:</span>
                <span className="info-value">{product.condition}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-column">
        {/* Title */}
        <div className="title-section">
          <h1>{product.title}</h1>
        </div>

        {/* Description */}
        <div className="description-section">
          <h3>Description</h3>
          <p>{product.description || 'No description available'}</p>
        </div>

        {/* Price */}
        <div className="price-section">
          <span className="price" aria-label={`Price: ${formatPrice(product.price)}`}>
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className={`fav-button ${product && isFavorite(product.id) ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={product && isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={product ? isFavorite(product.id) : false}
            type="button"
          >
            <span aria-hidden="true">{product && isFavorite(product.id) ? '♥' : '♡'}</span> Fav
          </button>
          <button 
            className="add-to-cart-button" 
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
            type="button"
          >
            Add to cart
          </button>
          <button 
            className="chat-button" 
            onClick={openChat}
            aria-label={`Start chat with ${product.seller_name || 'seller'}`}
            type="button"
          >
            Chat
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
              ×
            </button>
            
            <button 
              className="lightbox-nav lightbox-prev" 
              onClick={prevPhoto}
              aria-label="Previous photo"
              disabled={photos.length <= 1}
            >
              ‹
            </button>
            
            <div className="lightbox-image-container">
              <img 
                src={`http://localhost:5000${photos[currentPhotoIndex]}`}
                alt={`${product.title} - Image ${currentPhotoIndex + 1} of ${photos.length}`}
                className="lightbox-image"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/800/600?text=Image+Not+Found';
                }}
              />
            </div>
            
            <button 
              className="lightbox-nav lightbox-next" 
              onClick={nextPhoto}
              aria-label="Next photo"
              disabled={photos.length <= 1}
            >
              ›
            </button>
            
            <div className="lightbox-info">
              <span className="lightbox-counter">
                {currentPhotoIndex + 1} / {photos.length}
              </span>
              <span className="lightbox-title">{product.title}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;