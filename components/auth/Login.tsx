import React, { useState } from 'react';
import './Login.css';
import useSignup from '../hooks/useSignup.ts';
import useAuth from '../hooks/useAuth.ts';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { setSignup } = useSignup();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      console.log('Login successful!');
      // The AuthProvider will handle state updates automatically
    }
    // Error handling is managed by AuthProvider and displayed below
  };

  const handleSignUpClick = () => {
    setSignup(true);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
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
            placeholder="Password"
            value={formData.password}
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

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="signup-link" onClick={handleSignUpClick}>
          Don't have an account
        </p>
      </form>
    </div>
  );
};

export default Login;