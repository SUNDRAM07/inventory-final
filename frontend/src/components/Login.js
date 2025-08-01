import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isLogin 
        ? await login(username, password)
        : await register(username, password);

      if (result.success) {
        toast.success(isLogin ? 'Login successful!' : 'Registration successful! Please login.');
        if (!isLogin) {
          setIsLogin(true);
          setPassword('');
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>
        <i className="fas fa-boxes"></i> Inventory Management
      </h2>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
        {isLogin ? 'Login' : 'Register'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Login; 