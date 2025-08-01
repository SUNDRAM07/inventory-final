import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand">
            <i className="fas fa-boxes"></i> Inventory Management
          </Link>
          
          <ul className="navbar-nav">
            <li>
              <Link to="/">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/products">
                <i className="fas fa-box"></i> Products
              </Link>
            </li>
            <li>
              <Link to="/add-product">
                <i className="fas fa-plus"></i> Add Product
              </Link>
            </li>
            <li>
              <Link to="/analytics">
                <i className="fas fa-chart-bar"></i> Analytics
              </Link>
            </li>
            <li>
              <span style={{ color: '#fff', marginRight: '10px' }}>
                Welcome, {user?.username}
              </span>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer',
                  padding: '5px 10px',
                  borderRadius: '4px'
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 