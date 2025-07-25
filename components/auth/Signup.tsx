import React, { useState } from 'react';
import './Signup.css';
import useSignup from '../hooks/useSignup.ts';


interface FormData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const Signup: React.FC = () => {
  const {Signups,setSignup} = useSignup();
  const [formData, setFormData] = useState<FormData>({
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

  const handleLoginClick = ()=>{
    setSignup(false);
    console.log(Signups);
    
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="form-input"
            required
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

        <div className="input-group">
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="signup-button">
          SignUP
        </button>
        <p className="signup-link" onClick={handleLoginClick}>
          Have an account?
        </p>
      </form>
    </div>
  );
};

export default Signup;