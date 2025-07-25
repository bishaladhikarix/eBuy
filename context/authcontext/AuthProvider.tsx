import { useState } from "react"
import type {ReactNode} from "react";
import AuthContext from "./AuthContext.ts"

type authProviderProp = {
    children:ReactNode;
}

const AuthProvider = ({children}:authProviderProp) =>{
    const [Loggedin,setLoggedin] = useState<boolean | null>(null);
    const [Token,setToken] = useState<string | null>(null);
    return(
        <AuthContext.Provider value={{Loggedin,setLoggedin,Token,setToken}}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;