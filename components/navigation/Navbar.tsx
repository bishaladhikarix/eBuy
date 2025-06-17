import './Navbar.css';
import { Menu } from 'lucide-react';
import Logo from './logo/Logo';
import SearchBar from '../search/SearchBar';
import UserActions from './action/UserActions';
import CategoriesDropdown from './dropdown/CategoriesDropdown';

const Navbar = () => {

  return (
    <div className='nav'>
      {/* Top Navigation Bar */}
      <div className='container-nav'>
        <div className='top-nav'>
          <Logo />
          <SearchBar />
          <UserActions />
        </div>
      </div>
      
      {/* Secondary Navigation */}
      <div className='secondary-nav'>
        <div className='container'>
          <div className='secondary-nav-inner'>
            <CategoriesDropdown />
            
            {/* Quick Links */}
            <div className='quick-links'>

              <button 
                className='quick-link'
              >
                Help & Contact
              </button>
              <button 
                className='quick-link'
              >
                Sell
              </button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button className='mobile-menu'>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;