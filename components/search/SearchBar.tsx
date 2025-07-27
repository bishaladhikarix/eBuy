import './SearchBar.css';
import { Search} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../context/searchcontext/SearchContext';

const SearchBar = () => {
  const { searchText, setSearchText } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchText);
  const debounceRef = useRef<number | null>(null);
  
  // Sync local state with context when context changes
  useEffect(() => {
    setLocalSearchTerm(searchText);
  }, [searchText]);

  // Debounced real-time search effect
  useEffect(() => {
    // Clear the previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set a new timeout for 300ms delay
    debounceRef.current = setTimeout(() => {
      setSearchText(localSearchTerm);
      console.log('Real-time searching for:', localSearchTerm);
    }, 300);

    // Cleanup timeout on component unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localSearchTerm, setSearchText]);
  
  const handleSearch = () => {
    // Clear debounce and search immediately when button is clicked
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setSearchText(localSearchTerm);
    console.log('Manual search for:', localSearchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search for anything..."
          onFocus={(e) => e.target.style.borderColor = 'black'}
          onBlur={(e) => e.target.style.borderColor = '#313233ff'}
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