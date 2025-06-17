import './SearchBar.css';
import { Search} from 'lucide-react';
import { useState, } from 'react';



const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <div className='search-container'>
      <div className='search-wrapper'>
        <input
          className='input-search'
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search for anything..."
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={handleSearch}
          className='button-search'
        >
          <Search size={25} />
        </button>
      </div>
    </div>
  );
};




export default SearchBar;