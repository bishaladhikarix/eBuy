import NotContext from "./NotContext";
import { useState, type ReactNode } from "react";

type prop ={
    children:ReactNode
}

const NotContextProvider = ({children}:prop) =>{
    const [Signups,setSignup] = useState<boolean | null>(null);

    return(
        <NotContext.Provider value={{Signups,setSignup}}>
            {children}
        </NotContext.Provider>
    )
}

export default NotContextProvider;