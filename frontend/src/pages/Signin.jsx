import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../database/supabaseClient';
import { Link } from 'react-router-dom';
import '../style/AuthCSS.css';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ Email: '', Password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { Email, Password } = formData;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('Email', Email)
      .eq('Password', Password)
      .single();

    if (error || !user) {
      alert("Invalid email or password!");
    } else {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = "/dashboard";
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-description">Sign in to access your dashboard</p>

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

          <button type="button" className="submit-button" onClick={handleSubmit}>
            Sign In
          </button>

          <div className="toggle-auth">
            Don't have an account? <Link to="/signup" className="toggle-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
