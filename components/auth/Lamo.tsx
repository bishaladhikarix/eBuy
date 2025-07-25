import useSignup from '../hooks/useSignup.ts';
import Login from './Login.tsx';
import Signup from './Signup.tsx';


const Lamo = () =>{

    const {Signups} = useSignup();

    if(Signups){
        return(<Signup></Signup>)
    }
    return(
        <Login></Login>
    )
}

export default Lamo;