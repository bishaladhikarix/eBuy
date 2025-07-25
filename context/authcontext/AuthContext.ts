import { createContext } from "react";

export type contextType = {
    Loggedin:boolean | null ,
    setLoggedin:(val:boolean | null)=> void;

    Token:string | null ,
    setToken:(val:string | null) => void;

}

const AuthContext = createContext<contextType | undefined>(undefined); 
export default AuthContext;