// Token management utilities
const TOKEN_KEY = 'ebuy_auth_token';
const USER_KEY = 'ebuy_user_data';

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

// Store token in localStorage
export const storeToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Store user data
export const storeUserData = (userData: UserData): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

// Get user data
export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic JWT expiration check (decode payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      removeToken(); // Remove expired token
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    removeToken(); // Remove invalid token
    return false;
  }
};
