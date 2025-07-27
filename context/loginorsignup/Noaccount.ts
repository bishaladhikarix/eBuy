import { createContext } from "react";

export type ncont = {
    Signups:boolean | null,
    setSignup:(val:boolean | null) => void;
}


const NotContext = createContext<ncont | undefined>(undefined);


export default NotContext;