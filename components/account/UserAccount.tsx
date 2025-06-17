import './UserAccount.css';
import {User} from 'lucide-react';

const UserAccount = ()=>{



    return(
      <button 
        className='account-button'
      >
        <User size={25} />
        <span className='element'>Account</span>
      </button>
    )

}


export default UserAccount;