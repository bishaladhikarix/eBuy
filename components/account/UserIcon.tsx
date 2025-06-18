import './UserIcon.css';
import {User} from 'lucide-react';

const UserIcon = ()=>{



    return(
      <button 
        className='account-button'
      >
        <User size={25} />
        <span className='element'>Login</span>
      </button>
    )

}


export default UserIcon;