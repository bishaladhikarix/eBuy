import './Logo.css';
import { Link } from 'react-router-dom';
import { useSearch } from '../../../context/searchcontext/SearchContext';

const Logo = () => {

  const { setSearchText } = useSearch();
  // Clear search text when logo is clicked
  const handleLogoClick = () => {
    setSearchText('');
  };
  return (
    <div className='logo-styles'>
      <div className='logo-text-styles'>
        <Link to={'/'} onClick={handleLogoClick}>eBuy</Link>
      </div>
    </div>
  );




}


export default Logo;