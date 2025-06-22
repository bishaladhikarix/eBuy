import './UserIcon.css';
import { Link } from 'react-router-dom';
import {User} from 'lucide-react';

const UserIcon = ()=>{



    return(
      <button 
        className='account-button'
      >
        <User size={25} />
        <span className='element'> <Link to={'/account'}>Login</Link> </span>
      </button>
    )

}


export default UserIcon;