import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GemApi from '../coolShit/GemApi.ts';
import useAuth from '../hooks/useAuth';
import type { ChangeEvent } from 'react';
import './Sell.css';

interface Photo {
  id: number;
  url: string;
  file?: File;
  isExisting?: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: number;
  category_name: string;
  images: string[];
  brand?: string;
  model?: string;
  condition?: string;
}

const EditProduct: React.FC = () => {
  const { Token } = useAuth();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [condition, setCondition] = useState<string>('New');
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxPhotos: number = 6;

  const categories: string[] = [
    'Laptops',
    'Graphic Cards',
    'RAM',
    'CPUs',
    'Monitors',
    'Motherboards'
  ];

  // Map category names to IDs (matches database)
  const getCategoryId = (categoryName: string): number => {
    const categoryMap: { [key: string]: number } = {
      'Laptops': 1,
      'Graphic Cards': 2,
      'Monitors': 3,
      'CPUs': 4,
      'RAM': 5,
      'Motherboards': 6
    };
    return categoryMap[categoryName] || 1;
  };

  // Map category IDs to names
  const getCategoryName = (categoryId: number): string => {
    const categoryMap: { [key: number]: string } = {
      1: 'Laptops',
      2: 'Graphic Cards',
      3: 'Monitors',
      4: 'CPUs',
      5: 'RAM',
      6: 'Motherboards'
    };
    return categoryMap[categoryId] || 'Laptops';
  };

  // Fetch product data when component mounts
  useEffect(() => {
    if (!productId) {
      navigate('/account');
      return;
    }
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();
      const product: Product = data.data.product;

      // Populate form fields
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price.toString());
      setSelectedCategory(getCategoryName(product.category_id));
      setBrand(product.brand || '');
      setModel(product.model || '');
      setCondition(product.condition || 'New');

      // Convert existing images to Photo objects
      const existingPhotos: Photo[] = product.images.map((imageUrl, index) => ({
        id: index + 1,
        url: imageUrl,
        isExisting: true
      }));
      setPhotos(existingPhotos);

    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product data');
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoto = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: Photo[] = [];
    for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const id = Date.now() + i;
        const url = URL.createObjectURL(file);
        newPhotos.push({ id, url, file, isExisting: false });
      }
    }

    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [photos.length, maxPhotos]);

  const removePhoto = useCallback((id: number) => {
    setPhotos(prevPhotos => {
      const photoToRemove = prevPhotos.find(photo => photo.id === id);
      if (photoToRemove && !photoToRemove.isExisting) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prevPhotos.filter(photo => photo.id !== id);
    });
  }, []);

  const selectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  }, []);

  const selectCondition = useCallback((newCondition: string) => {
    setCondition(newCondition);
    setIsConditionDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const toggleConditionDropdown = useCallback(() => {
    setIsConditionDropdownOpen(prev => !prev);
  }, []);

  const handleEnhance = async() => {
    console.log('Enhancing description...');
    const enhancedVal = await GemApi(description);
    setDescription(enhancedVal);
  }

  const handleCancel = () => {
    navigate('/account');
  };

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!title.trim()) {
      alert('Please enter a product title');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a product description');
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      alert('Please enter a valid price');
      return;
    }
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append product data with correct field names
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('categoryId', getCategoryId(selectedCategory).toString());
      formData.append('condition', condition);
      formData.append('brand', brand);
      formData.append('model', model);

      // Append only new image files (not existing ones)
      photos.forEach((photo) => {
        if (photo.file && !photo.isExisting) {
          formData.append('productImages', photo.file);
        }
      });

      // Append existing image URLs that should be kept
      const existingImages = photos
        .filter(photo => photo.isExisting)
        .map(photo => photo.url);
      
      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      console.log('Submitting form data:', {
        title,
        description,
        price,
        categoryId: getCategoryId(selectedCategory),
        condition,
        brand,
        model,
        existingImages
      });

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok && result.success) {
        alert('Product updated successfully!');
        setTimeout(() => {
          navigate('/account');
        }, 2000);
      } else {
        alert(result.message || 'Failed to update product. Please try again.');
      }

    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, price, selectedCategory, photos, brand, model, condition, Token, productId, navigate]);

  if (isLoading) {
    return (
      <div className="add-product-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading product data...
      </div>
    );
  }

  return (
    <div className="add-product-container">
      {/* Left Column */}
      <div className="left-column">
        {/* Photo Upload Section */}
        <div className="photo-section">
          <h3>Product Photos</h3>
          <div className="photo-preview-section">
            <div className="photo-preview-label">Photos ({photos.length}/6)</div>
            <div className="photo-grid">
              {Array.from({ length: 6 }, (_, index) => {
                const photo = photos[index];
                return (
                  <div key={index} className="photo-slot">
                    {photo ? (
                      <>
                        <img src={photo.url} alt="Product" className="photo-thumbnail" />
                        <button 
                          className="remove-photo" 
                          onClick={() => removePhoto(photo.id)}
                          type="button"
                        >
                          ×
                        </button>
                        {photo.isExisting && (
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '2px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            fontSize: '8px',
                            padding: '1px 3px',
                            borderRadius: '3px'
                          }}>
                            Existing
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="empty-slot">+</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="add-photo-button" onClick={() => fileInputRef.current?.click()}>
            <span className="plus-icon">+</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={addPhoto}
            style={{ display: 'none' }}
          />
          
          <div className="photo-limit-note">
            <p>Add up to 6 photos</p>
            <p>First photo will be your cover image</p>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="specs-section">
          <h3>Product Specifications</h3>
          <div className="specs-list">
            <div className="spec-row">
              <input
                type="text"
                placeholder="Brand"
                value="Brand"
                readOnly
                className="spec-key"
              />
              <span className="spec-separator">:</span>
              <input
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="spec-value"
              />
            </div>
            <div className="spec-row">
              <input
                type="text"
                placeholder="Model"
                value="Model"
                readOnly
                className="spec-key"
              />
              <span className="spec-separator">:</span>
              <input
                type="text"
                placeholder="Enter model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="spec-value"
              />
            </div>
            <div className="spec-row">
              <input
                type="text"
                placeholder="Condition"
                value="Condition"
                readOnly
                className="spec-key"
              />
              <span className="spec-separator">:</span>
              <div className="dropdown-container">
                <button 
                  type="button"
                  className="dropdown-trigger"
                  onClick={toggleConditionDropdown}
                >
                  {condition}
                  <span className={`dropdown-arrow ${isConditionDropdownOpen ? 'open' : ''}`}>▼</span>
                </button>
                {isConditionDropdownOpen && (
                  <div className="dropdown-menu">
                    {['New', 'Like New', 'Good', 'Fair', 'Poor'].map((conditionOption) => (
                      <div
                        key={conditionOption}
                        className="dropdown-option"
                        onClick={() => selectCondition(conditionOption)}
                      >
                        <span className="option-text">{conditionOption}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-column">
        {/* Title Section */}
        <div className="title-section">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Title"
            className="title-input"
            maxLength={100}
          />
        </div>

        {/* Description Section */}
        <div className="description-section">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..."
            className="description-textarea"
            maxLength={1000}
          />
          <button 
            type="button" 
            onClick={handleEnhance}
            className="enhance-button"
          >
            Recommand AI
          </button>
        </div>

        {/* Category and Price Section */}
        <div className="category-section">
          <div className="dropdown-container">
            <button 
              type="button"
              className="dropdown-trigger"
              onClick={toggleDropdown}
            >
              {selectedCategory || 'Select a category'}
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map((category, index) => (
                  <div
                    key={category}
                    className="dropdown-option"
                    onClick={() => selectCategory(category)}
                  >
                    <span className="option-number">{index + 1}.</span>
                    <span className="option-text">{category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (Rs.)"
            min="0"
            step="0.01"
            style={{
              padding: '12px 16px',
              border: '2px solid #333',
              borderRadius: '10px',
              backgroundColor: '#fafafa',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Submit Section */}
        <div className="submit-section">
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '12px 30px',
              border: '2px solid #333',
              borderRadius: '10px',
              backgroundColor: '#fff',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '15px',
              transition: 'all 0.2s'
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="done-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
