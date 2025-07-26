import { useState, useCallback, useRef } from 'react';
import GemApi from '../coolShit/GemApi.ts';
import type { ChangeEvent } from 'react';
import './Sell.css';

interface Photo {
  id: number;
  url: string;
  file: File;
}

interface Spec {
  key: string;
  value: string;
}

interface ProductData {
  photos: File[];
  title: string;
  description: string;
  specs: Spec[];
  category: string;
}

interface AppProps {
  onSubmit?: (productData: ProductData) => void;
}

const Sell: React.FC<AppProps> = ({ onSubmit }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [specs, setSpecs] = useState<Spec[]>([
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxPhotos: number = 6;

  const categories: string[] = [
    'Laptop',
    'Graphic Card',
    'Ram',
    'Cpu',
    'Monitor',
    'Mother Board'
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

  const handleSpecChange = useCallback((index: number, field: keyof Spec, value: string) => {
    setSpecs(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleEnhance = async() => {
    // AI enhancement functionality placeholder
    console.log('Enhancing description...');
    const enhancedVal = await GemApi(description);
    setDescription(enhancedVal);
  }

  const handleSubmit = useCallback(() => {
    const productData: ProductData = {
      photos: photos.map(photo => photo.file),
      title,
      description,
      specs: specs.filter(spec => spec.key && spec.value),
      category: selectedCategory
    };

    if (onSubmit) {
      onSubmit(productData);
    } else {
      console.log('Product data:', productData);
      alert('Product created successfully!');
    }
  }, [photos, title, description, specs, selectedCategory, onSubmit]);

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

        {/* Specifications Section */}
        <div className="specs-section">
          <h3>Specs</h3>
          <div className="specs-list">
            {specs.map((spec, index) => (
              <div key={index} className="spec-row">
                <input
                  type="text"
                  placeholder="key"
                  value={spec.key}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    handleSpecChange(index, 'key', e.target.value)
                  }
                  className="spec-key"
                />
                <span className="spec-separator">:</span>
                <input
                  type="text"
                  placeholder="value"
                  value={spec.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    handleSpecChange(index, 'value', e.target.value)
                  }
                  className="spec-value"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-column">
        {/* Title Section */}
        <div className="title-section">
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        {/* Description Section */}
        <div className="description-section">
          <textarea
            placeholder="Description"
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
            Enhance
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="category-section">
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
          
          {/* Category Options Preview */}
          <div className="category-options-preview">
            <p>option for dropdown</p>
            {categories.map((category, index) => (
              <div key={category} className="category-option">
                <span className="roman-numeral">
                  {['i', 'ii', 'iii', 'iv', 'v', 'vi'][index]}.
                </span>
                <span className="category-name">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button 
            className="done-button"
            onClick={handleSubmit}
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sell;