import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [isLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  
  const { login, register, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get Google OAuth URL on component mount
    const getGoogleAuthUrl = async () => {
      try {
        const response = await axios.get('/auth/google/url');
        setGoogleAuthUrl(response.data.auth_url);
      } catch (error) {
        console.error('Failed to get Google auth URL:', error);
      }
    };
    getGoogleAuthUrl();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success;
      if (isLogin) {
        success = await login(username, password);
      } else {
        // Only allow user registration, not admin/manager
        success = await register(username, password, 'user');
      }

      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked, URL:', googleAuthUrl, 'Loading:', loading);
    if (googleAuthUrl && !loading) {
      window.location.href = googleAuthUrl;
    } else {
      // Use a working Google OAuth URL for demo
      const clientId = '737894197103-utbvekck19hhshdd5509.apps.googleusercontent.com'; // Your actual client ID
      const redirectUri = 'https://inventory-final-07.vercel.app/auth/callback';
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
      console.log('Redirecting to Google OAuth:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    }
  };

  const handleGoogleCallback = useCallback(async (code) => {
    setLoading(true);
    try {
      // Exchange the authorization code for a token
      const response = await axios.post('/auth/google', {
        token: code  // The code from Google OAuth
      });

      if (response.data.access_token) {
        // Store the token
        localStorage.setItem('token', response.data.access_token);
        
        // Update axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        // Update auth context with user info
        const userInfo = {
          username: response.data.user?.username || 'google_user',
          role: response.data.user?.role || 'user'
        };
        
        // Update auth context
        setUser(userInfo);
        
        // Clean up URL and navigate
        window.history.replaceState({}, document.title, '/');
        navigate('/dashboard');
        toast.success('Successfully logged in with Google!');
      }
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      toast.error('Google login was cancelled or failed.');
      return;
    }

    if (code) {
      handleGoogleCallback(code);
    }
  }, [handleGoogleCallback]);

  return (
    <div className="login-container">
      {/* Left Side - Nature Background */}
      <div className="login-left">
        <div className="nature-background">
          <div className="overlay"></div>
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome Back</h1>
            <p className="welcome-text">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using.
            </p>
            <div className="social-links">
              <button type="button" className="social-icon" aria-label="Facebook">📘</button>
              <button type="button" className="social-icon" aria-label="Twitter">🐦</button>
              <button type="button" className="social-icon" aria-label="Instagram">📷</button>
              <button type="button" className="social-icon" aria-label="YouTube">📺</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Sign in</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Email Address</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" />
                <span className="checkmark"></span>
                Remember Me
              </label>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>



          {/* Google OAuth */}
          <div className="google-section">
            <div className="divider">
              <span>or</span>
            </div>
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="google-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 