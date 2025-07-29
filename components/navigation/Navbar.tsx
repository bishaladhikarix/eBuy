import './Navbar.css';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './logo/Logo';
import SearchBar from '../search/SearchBar';
import UserActions from './action/UserActions';
import CategoriesDropdown from './dropdown/CategoriesDropdown';



const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
                <Link to={'/help'}>Help & Contact</Link>
              </button>
              <button 
                className='quick-link'
              >
                <Link to={'/sell'}>Sell</Link>
                
              </button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className='mobile-menu-toggle'
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className='mobile-menu-dropdown'>
          <div className='mobile-menu-overlay' onClick={closeMobileMenu}></div>
          <div className='mobile-menu-content'>
            <Link 
              to={'/help'} 
              className='mobile-menu-item'
              onClick={closeMobileMenu}
            >
              Help & Contact
            </Link>
            <Link 
              to={'/sell'} 
              className='mobile-menu-item'
              onClick={closeMobileMenu}
            >
              Sell
            </Link>
            <Link 
              to={'/account'} 
              className='mobile-menu-item'
              onClick={closeMobileMenu}
            >
              My Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;