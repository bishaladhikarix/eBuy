import './UserIcon.css';
import { Link } from 'react-router-dom';
import {User} from 'lucide-react';

const UserIcon = ()=>{



    return(
      <button 
        className='account-button'
      >
        
        <span className='element'> <Link to={'/account'}><User size={25} /></Link> </span>
      </button>
    )

}


export default UserIcon;