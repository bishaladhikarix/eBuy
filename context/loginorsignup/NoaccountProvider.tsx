import Noaccount from "./Noaccount";
import { useState, type ReactNode } from "react";

type prop ={
    children:ReactNode
}

const NoaccountProvider = ({children}:prop) =>{
    const [Signups,setSignup] = useState<boolean | null>(null);

    return(
        <Noaccount.Provider value={{Signups,setSignup}}>
            {children}
        </Noaccount.Provider>
    )
}

export default NoaccountProvider;