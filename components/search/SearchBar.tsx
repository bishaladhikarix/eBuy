import './SearchBar.css';
import { Search, ShoppingCart, User, Menu, Heart, Bell } from 'lucide-react';
import { useState } from 'react';



const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className='search-container-styles'>
      <div className='search-wrapper-styles'>
        <input
          className='input-style'
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for anything..."
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={handleSearch}
          className={isHovering ? 'button-hover-style' : 'button-style'}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};




export default SearchBar;