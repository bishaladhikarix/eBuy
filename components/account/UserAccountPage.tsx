import './UserAccountPage.css';
import Lamo from '../auth/Lamo.tsx';
import Profile from './Profile.tsx';
import useAuth from '../hooks/useAuth.ts';

const UserAccountPage = () => {

    const {Loggedin} = useAuth();

    if(!Loggedin){
        
        return(
            <Profile/>
        )
    }
    return(
        <Lamo/>
    )
}

export default UserAccountPage;