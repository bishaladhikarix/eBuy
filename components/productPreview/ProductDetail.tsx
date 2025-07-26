import { useState, useCallback, useMemo } from 'react';
import './ProductDetail.css';
// type products{
//   name:string,
//   profileImage:string,
//   photos:string[],
//   title:string,
//   description:string,
//   deviceSpecs:string[]

// }
const ProductDetail = () => {
  // Default product data if none provided
  const defaultProduct = useMemo(() => ({
    name: "John Doe",
    profileImage: "https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_960_720.jpg",
    photos: [
      "https://thumbs.dreamstime.com/b/innovative-medical-device-featuring-eye-image-illustrating-advanced-tracking-technology-generated-ai-358374352.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvF9qGJi4C7tQPhzSIoqFcu5HUzRgUSHr7Mxat8CAMmL9-96PhJj-KZ96i0XdH-b6Yh2k&usqp=CAU",
      "https://via.placeholder.com/300x200/f0f0f0/666666?text=Photo+3",
      "https://via.placeholder.com/300x200/f0f0f0/666666?text=Photo+4"
    ],
    title: "Product Title",
    description: "This is a detailed description of the product. It provides comprehensive information about the features, benefits, and specifications that customers need to know before making a purchase decision.",
    price: "$299.99",
    deviceSpecs: [
      "Brand 1: dell",
      "something 2: someotherthing", 
      "ehlo 3: echo",
      "dfsd 4: Value"
    ]
  }), []);

  const productData = defaultProduct;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => 
      prev === productData.photos.length - 1 ? 0 : prev + 1
    );
  }, [productData.photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? productData.photos.length - 1 : prev - 1
    );
  }, [productData.photos.length]);

  const goToPhoto = useCallback((index:any) => {
    setCurrentPhotoIndex(index);
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  const addToCart = useCallback(() => {
    // In a real app, this would dispatch to a cart context or call an API
    console.log('Adding to cart:', productData);
    alert('Added to cart!');
  }, [productData]);

  const openChat = useCallback(() => {
    // In a real app, this would open a chat modal or navigate to chat
    console.log('Opening chat for:', productData.name);
    alert('Opening chat...');
  }, [productData.name]);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback((event:any) => {
    if (event.key === 'ArrowLeft') {
      prevPhoto();
    } else if (event.key === 'ArrowRight') {
      nextPhoto();
    }
  }, [nextPhoto, prevPhoto]);

  return (
    <div className="product-detail-container" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-picture">
          <img src={productData.profileImage} alt={`${productData.name}'s profile`} />
        </div>
        <div className="name-field">
          <input 
            type="text" 
            value={productData.name} 
            readOnly 
            aria-label="Seller name"
          />
        </div>
      </div>

      {/* Left Column */}
      <div className="left-column">
        {/* Photo Slide */}
        <div className="photo-slide">
          <div className="photo-container">
            <button 
              className="nav-button prev" 
              onClick={prevPhoto}
              aria-label="Previous photo"
              type="button"
            >
              ‹
            </button>
            <img 
              src={productData.photos[currentPhotoIndex]} 
              alt={`${productData.title} - Image ${currentPhotoIndex + 1} of ${productData.photos.length}`}
              className="product-photo"
            />
            <button 
              className="nav-button next" 
              onClick={nextPhoto}
              aria-label="Next photo"
              type="button"
            >
              ›
            </button>
          </div>
          <div className="photo-indicators" role="tablist" aria-label="Photo navigation">
            {productData.photos.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                onClick={() => goToPhoto(index)}
                aria-label={`Go to photo ${index + 1}`}
                role="tab"
                aria-selected={index === currentPhotoIndex}
                type="button"
              />
            ))}
          </div>
        </div>

        {/* Device Specs */}
        <div className="device-specs">
          <h3>Device Specs</h3>
          <div className="specs-list">
            {productData.deviceSpecs.map((spec, index) => (
              <div key={index} className="spec-item">
                {spec}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-column">
        {/* Title */}
        <div className="title-section">
          <h1>{productData.title}</h1>
        </div>

        {/* Description */}
        <div className="description-section">
          <h3>Description</h3>
          <p>{productData.description}</p>
        </div>

        {/* Price */}
        <div className="price-section">
          <span className="price" aria-label={`Price: ${productData.price}`}>
            {productData.price}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className={`fav-button ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            type="button"
          >
            <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span> Fav
          </button>
          <button 
            className="add-to-cart-button" 
            onClick={addToCart}
            aria-label={`Add ${productData.title} to cart`}
            type="button"
          >
            Add to cart
          </button>
          <button 
            className="chat-button" 
            onClick={openChat}
            aria-label={`Start chat with ${productData.name}`}
            type="button"
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;