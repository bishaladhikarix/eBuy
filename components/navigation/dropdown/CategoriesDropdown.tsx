
import './CategoriesDropdown.css';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const categories = [
    'Laptop',
    'Graphic Card',
    'Moniter',
    'CPU',
    'Ram'
  ];


  return (
    <div className='container'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='button'
      >
        <Menu size={20} />
        <span style={{ display: window.innerWidth >= 768 ? 'inline' : 'none' }}>Categories</span>
      </button>
      
      {isOpen && (
        <div className='dropdown'>
          {categories.map((category, index) => (
            <button
              key={index}
              className='category-items'
              style={{
                borderTopLeftRadius: index === 0 ? '8px' : '0',
                borderTopRightRadius: index === 0 ? '8px' : '0',
                borderBottomLeftRadius: index === categories.length - 1 ? '8px' : '0',
                borderBottomRightRadius: index === categories.length - 1 ? '8px' : '0'
              }}
              onClick={() => {
                console.log('Selected category:', category);
                setIsOpen(false);
              }}
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