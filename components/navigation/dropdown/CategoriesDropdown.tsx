
import './CategoriesDropdown.css';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useSearch } from '../../../context/searchcontext/SearchContext';

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useSearch();
  
  const categories = [
    'Laptops',      // Updated to match backend categories
    'Graphic Cards',
    'Monitors',     // Fixed spelling
    'CPUs',
    'RAM',
    'Motherboards'  // Updated to match backend
  ];

  const handleCategorySelect = (category: string) => {
    // If the same category is selected, clear the filter
    if (selectedCategory === category) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
    setIsOpen(false);
    console.log('Selected category:', category);
  };

  const handleAllCategories = () => {
    setSelectedCategory('');
    setIsOpen(false);
    console.log('Showing all categories');
  };

  return (
    <div className='container'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='button'
      >
        <Menu size={20} />
        <span style={{ display: window.innerWidth >= 768 ? 'inline' : 'none' }}>
          {selectedCategory || 'Categories'}
        </span>
      </button>
      
      {isOpen && (
        <div className='dropdown'>
          <button
            className='category-items'
            style={{
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              backgroundColor: !selectedCategory ? '#f0f0f0' : 'transparent',
              fontWeight: !selectedCategory ? 'bold' : 'normal'
            }}
            onClick={handleAllCategories}
          >
            All Categories
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className='category-items'
              style={{
                borderBottomLeftRadius: index === categories.length - 1 ? '8px' : '0',
                borderBottomRightRadius: index === categories.length - 1 ? '8px' : '0',
                backgroundColor: selectedCategory === category ? '#f0f0f0' : 'transparent',
                fontWeight: selectedCategory === category ? 'bold' : 'normal'
              }}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;