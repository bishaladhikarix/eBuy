import React, { useState } from 'react';
import './Signup.css';
import useSignup from '../hooks/useSignup.ts';
import useAuth from '../hooks/useAuth.ts';

interface FormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const Signup: React.FC = () => {
  const { setSignup } = useSignup();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginClick = () => {
    setSignup(false);
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      // You could set a local error state here or use the auth error
      return;
    }
    
    // Split fullName into firstName and lastName
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (!firstName || !formData.username.trim()) {
      return;
    }

    const success = await register(
      formData.username,
      firstName,
      lastName,
      formData.email,
      formData.password,
      formData.phoneNumber
    );
    
    if (success) {
      console.log('Registration successful!');
      // The AuthProvider will handle state updates automatically
    }
    // Error handling is managed by AuthProvider and displayed below
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password (6+ chars, include uppercase, lowercase, number)"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message" style={{
            color: 'red',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary signup-button" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
        <p className="signup-link" onClick={handleLoginClick}>
          Have an account?
        </p>
      </form>
    </div>
  );
};

export default Signup;