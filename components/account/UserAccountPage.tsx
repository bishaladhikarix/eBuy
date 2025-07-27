
import Lamo from '../auth/Lamo.tsx';
import Profile from './Profile.tsx';
import useAuth from '../hooks/useAuth.ts';

const UserAccountPage = () => {

    const { Loggedin } = useAuth();

    // Show Profile if user is logged in
    if (Loggedin) {
        return(
            <Profile/>
        )
    }
    
    // Show Login/Signup if user is not logged in
    return(
        <Lamo/>
    )
}

export default UserAccountPage;