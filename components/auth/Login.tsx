import React, { useState } from 'react';
import './Login.css';
import useSignup from '../hooks/useSignup.ts';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {Signups,setSignup} = useSignup();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
  };

  const handleSignUpClick = () => {
    
    setSignup(true);
    console.log(Signups)
    console.log('Navigate to sign up page');
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
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="signup-link" onClick={handleSignUpClick}>
          Don't have an account
        </p>
      </form>
    </div>
  );
};

export default Login;