import { createContext } from "react";
import type { UserData } from "../../utils/auth";
import type { UpdateProfileRequest } from "../../services/authApi";

export type contextType = {
    Loggedin: boolean;
    setLoggedin: (val: boolean) => void;
    Token: string | null;
    setToken: (val: string | null) => void;
    user: UserData | null;
    setUser: (val: UserData | null) => void;
    loading: boolean;
    setLoading: (val: boolean) => void;
    error: string | null;
    setError: (val: string | null) => void;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<boolean>;
    updateProfile: (userData: UpdateProfileRequest) => Promise<boolean>;
    updateName: (firstName: string, lastName: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<contextType | undefined>(undefined); 
export default AuthContext;