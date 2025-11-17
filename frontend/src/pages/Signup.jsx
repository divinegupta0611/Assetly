import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../database/supabaseClient';
import { Link } from 'react-router-dom';
import '../style/AuthCSS.css';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  const { Name, Email, Password, confirmPassword } = formData;
  if (Password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('Email', Email);

  if (fetchError) {
    console.error(fetchError);
    alert("Something went wrong while checking existing user.");
    return;
  }

  if (existingUser && existingUser.length > 0) {
    alert("User already exists with this email!");
    return;
  }

  // Insert user into the table
  const { data, error: insertError } = await supabase
    .from('users')
    .insert([{ Name, Email, Password }]);

    if (insertError) {
    alert(insertError.message);
  } else {
    // Save the user in localStorage
    localStorage.setItem('user', JSON.stringify({ Name, Email }));

    alert("Sign Up successful! Redirecting to dashboard...");
    window.location.href = "/dashboard"; // NavBar will now detect user
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Assetly</div>
          <div className="auth-subtitle">Manage Your Assets with Ease</div>
        </div>

        <div className="auth-body">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-description">Sign up to start tracking your warranties</p>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                name="Name"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.Name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="Email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.Email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="Password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="button" className="submit-button" onClick={handleSubmit}>
            Sign Up
          </button>

          <div className="toggle-auth">
            Already have an account? <Link to="/signin" className="toggle-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
