import './UserAccountPage.css';
import Lamo from '../auth/Lamo.tsx';
import useAuth from '../hooks/useAuth.ts';

const UserAccountPage = () => {

    const {Loggedin} = useAuth();

    if(Loggedin){
        
        return(
            <div>This is user profile page</div>
        )
    }
    return(
        <Lamo/>
    )
}

export default UserAccountPage;