import './Logo.css';
import { Link } from 'react-router-dom';

const Logo = () => {

  return (
    <div className='logo-styles'>
      <div className='logo-text-styles'>
        <Link to={'/'}>eBuy</Link>
      </div>
    </div>
  );




}


export default Logo;