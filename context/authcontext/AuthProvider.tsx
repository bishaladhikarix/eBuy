import { useState, useEffect } from "react"
import type {ReactNode} from "react";
import AuthContext from "./AuthContext.ts"
import { loginUser, registerUser, updateUserProfile, updateUserName, type UpdateProfileRequest } from "../../services/authApi.ts";
import { storeToken, getToken, removeToken, storeUserData, getUserData, isAuthenticated } from "../../utils/auth.ts";
import type { UserData } from "../../utils/auth.ts";

type authProviderProp = {
    children:ReactNode;
}

const AuthProvider = ({children}:authProviderProp) =>{
    const [Loggedin, setLoggedin] = useState<boolean>(false);
    const [Token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Check authentication status on app load
    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated()) {
                const token = getToken();
                const userData = getUserData();
                
                if (token && userData) {
                    setToken(token);
                    setUser(userData);
                    setLoggedin(true);
                }
            } else {
                // Clear any invalid data
                setToken(null);
                setUser(null);
                setLoggedin(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginUser({ email, password });
            
            if (response.success && response.data) {
                const { token, user } = response.data;
                
                // Store token and user data
                storeToken(token);
                storeUserData(user);
                
                // Update state
                setToken(token);
                setUser(user);
                setLoggedin(true);
                
                console.log('Login successful, user data:', user);
                
                setLoading(false);
                return true;
            } else {
                setError(response.message || 'Login failed');
                setLoading(false);
                return false;
            }
        } catch (error) {
            setError('Network error occurred');
            setLoading(false);
            return false;
        }
    };

    // Register function
    const register = async (username: string, firstName: string, lastName: string, email: string, password: string, phone?: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await registerUser({ username, firstName, lastName, email, password, phone });
            
            if (response.success && response.data) {
                const { token, user } = response.data;
                
                // Store token and user data
                storeToken(token);
                storeUserData(user);
                
                // Update state
                setToken(token);
                setUser(user);
                setLoggedin(true);
                
                setLoading(false);
                return true;
            } else {
                setError(response.message || 'Registration failed');
                setLoading(false);
                return false;
            }
        } catch (error) {
            setError('Network error occurred');
            setLoading(false);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        removeToken();
        setToken(null);
        setUser(null);
        setLoggedin(false);
        setError(null);
    };

    // Update profile function
    const updateProfile = async (userData: UpdateProfileRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        if (!Token) {
            setError('Not authenticated');
            setLoading(false);
            return false;
        }

        try {
            console.log('Updating profile with data:', userData);
            const response = await updateUserProfile(Token, userData);
            console.log('Update profile response:', response);
            
            if (response.success && response.data) {
                const { user } = response.data;
                
                // Update stored user data
                storeUserData(user);
                
                // Update state
                setUser(user);
                
                setLoading(false);
                return true;
            } else {
                setError(response.message || 'Profile update failed');
                setLoading(false);
                return false;
            }
        } catch (error) {
            setError('Network error occurred');
            setLoading(false);
            return false;
        }
    };

    // Update just name fields function (simpler alternative)
    const updateName = async (firstName: string, lastName: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        if (!Token) {
            setError('Not authenticated');
            setLoading(false);
            return false;
        }

        try {
            console.log('Updating name with:', { firstName, lastName });
            const response = await updateUserName(Token, firstName, lastName);
            console.log('Update name response:', response);
            
            if (response.success && response.data) {
                const { user } = response.data;
                
                // Update stored user data
                storeUserData(user);
                
                // Update state
                setUser(user);
                
                setLoading(false);
                return true;
            } else {
                setError(response.message || 'Name update failed');
                setLoading(false);
                return false;
            }
        } catch (error) {
            setError('Network error occurred');
            setLoading(false);
            return false;
        }
    };

    return(
        <AuthContext.Provider value={{
            Loggedin,
            setLoggedin,
            Token,
            setToken,
            user,
            setUser,
            loading,
            setLoading,
            error,
            setError,
            login,
            register,
            updateProfile,
            updateName,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;