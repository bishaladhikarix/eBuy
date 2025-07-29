import { useState, useCallback, useRef } from 'react';
import GemApi from '../coolShit/GemApi.ts';
import useAuth from '../hooks/useAuth';
import type { ChangeEvent } from 'react';
import './Sell.css';

interface Photo {
  id: number;
  url: string;
  file: File;
}

const Sell: React.FC = () => {
  const { Token } = useAuth();
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
    return categoryMap[categoryName] || 1; // Default to 1 if not found
  };

  const conditions: string[] = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];

  const handlePhotoUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = maxPhotos - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPhotos(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target?.result as string,
            file: file
          }]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    event.target.value = '';
  }, [photos.length, maxPhotos]);

  const removePhoto = useCallback((photoId: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  }, []);

  const handleAddPhotoClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleConditionSelect = useCallback((selectedCondition: string) => {
    setCondition(selectedCondition);
    setIsConditionDropdownOpen(false);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
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
    if(enhancedVal){
      setDescription(enhancedVal);
    }
    
  }

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
    if (photos.length === 0) {
      alert('Please add at least one product image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append product data
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('categoryId', getCategoryId(selectedCategory).toString());
      formData.append('condition', condition);
      formData.append('brand', brand);
      formData.append('model', model);
      
      // Append images
      photos.forEach((photo) => {
        formData.append('productImages', photo.file);
      });

      console.log('=== FRONTEND PRODUCT CREATION ===');
      console.log('Submitting product with', photos.length, 'images');

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      console.log('Product created successfully:', data);

      // Reset form
      setPhotos([]);
      setTitle('');
      setDescription('');
      setPrice('');
      setCondition('New');
      setBrand('');
      setModel('');
      setSelectedCategory('');

      // Show success alert
      alert('Product created successfully!');

    } catch (error: any) {
      console.error('=== PRODUCT CREATION ERROR ===');
      console.error('Error details:', error);
      // Show error alert
      alert(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  }, [photos, title, description, price, selectedCategory, condition, brand, model, Token]);

  const canAddMorePhotos: boolean = photos.length < maxPhotos;

  return (
    <div className="add-product-container">
      {/* Left Column */}
      <div className="left-column">
        {/* Photo Upload Section */}
        <div className="photo-section">
          <h3>Select Photos</h3>
          
          {/* Add Photo Button */}
          {canAddMorePhotos && (
            <div className="add-photo-button" onClick={handleAddPhotoClick}>
              <span className="plus-icon">+</span>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />

          {/* Photo Preview Grid */}
          <div className="photo-preview-section">
            <span className="photo-preview-label">Photo preview</span>
            <div className="photo-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="photo-slot">
                  {photos[index] ? (
                    <>
                      <img 
                        src={photos[index].url} 
                        alt={`Product ${index + 1}`}
                        className="photo-thumbnail"
                      />
                      <button 
                        className="remove-photo"
                        onClick={() => removePhoto(photos[index].id)}
                        aria-label="Remove photo"
                        type="button"
                      >
                        x
                      </button>
                    </>
                  ) : (
                    <span className="empty-slot">×</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="photo-limit-note">
            <p>Max six images allowed</p>
          </div>
        </div>

        {/* Price and Condition Section */}
        <div className="product-details-section">
          <div className="price-section">
            <h3>Price</h3>
            <input
              type="number"
              placeholder="Enter price in Rs."
              value={price}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
              className="price-input"
              min="0"
              step="0.01"
            />
          </div>

          <div className="condition-section">
            <h3>Condition</h3>
            <div className="dropdown-container">
              <button 
                className="dropdown-trigger"
                onClick={toggleConditionDropdown}
                type="button"
              >
                {condition}
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isConditionDropdownOpen && (
                <div className="dropdown-menu">
                  {conditions.map((conditionOption) => (
                    <div
                      key={conditionOption}
                      className="dropdown-option"
                      onClick={() => handleConditionSelect(conditionOption)}
                    >
                      <span className="option-text">{conditionOption}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="brand-model-section">
            <div className="brand-section">
              <h3>Brand (Optional)</h3>
              <input
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)}
                className="brand-input"
              />
            </div>
            
            <div className="model-section">
              <h3>Model (Optional)</h3>
              <input
                type="text"
                placeholder="Enter model"
                value={model}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setModel(e.target.value)}
                className="model-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-column">
        {/* Title Section */}
        <div className="title-section">
          <h3>Product Title</h3>
          <input
            type="text"
            placeholder="Enter product title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        {/* Description Section */}
        <div className="description-section">
          <h3>Description</h3>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            className="description-textarea"
            rows={8}
          />
          <button 
            className="enhance-button"
            onClick={handleEnhance}
            type="button"
          >
            Recommand AI
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="category-section">
          <h3>Category</h3>
          <div className="dropdown-container">
            <button 
              className="dropdown-trigger"
              onClick={toggleDropdown}
              type="button"
            >
              {selectedCategory || 'Select category'}
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map((category, index) => (
                  <div
                    key={category}
                    className="dropdown-option"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <span className="option-number">{index + 1}.</span>
                    <span className="option-text">{category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sell;