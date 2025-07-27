// API service for authentication
const API_BASE_URL = 'http://localhost:5000/api';

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      profileImage?: string;
    };
    token: string;
  };
  error?: string;
}

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit): Promise<AuthResponse> => {
  try {
    console.log(`API Request to ${endpoint}:`, {
      method: options.method,
      headers: options.headers,
      body: options.body
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    console.log(`API Response from ${endpoint}:`, data);
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

// Login API call
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Register API call
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  return apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Get user profile (with token)
export const getUserProfile = async (token: string): Promise<AuthResponse> => {
  return apiCall('/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Update user profile interface
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  profileImage?: string;
}

// Update user profile (with token)
export const updateUserProfile = async (token: string, userData: UpdateProfileRequest): Promise<AuthResponse> => {
  console.log('updateUserProfile called with:', { userData });
  
  // Ensure we have the Content-Type header
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  console.log('Request headers:', headers);
  console.log('Request body:', JSON.stringify(userData));
  
  return apiCall('/auth/profile', {
    method: 'PUT',
    headers,
    body: JSON.stringify(userData),
  });
};

// Update just the name fields (simpler endpoint)
export const updateUserName = async (token: string, firstName: string, lastName: string): Promise<AuthResponse> => {
  console.log('updateUserName called with:', { firstName, lastName });
  
  // Ensure we have the Content-Type header
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  // Log the full URL for debugging
  const fullUrl = `${API_BASE_URL}/auth/update-name`;
  console.log('Making request to:', fullUrl);
  
  return apiCall('/auth/update-name', {
    method: 'PUT',
    headers,
    body: JSON.stringify({ firstName, lastName }),
  });
};
