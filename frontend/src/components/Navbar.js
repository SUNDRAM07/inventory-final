import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, canManageProducts, canViewAnalytics } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = (role) => {
    // Add null check for role
    if (!role) return null;
    
    const roleColors = {
      admin: '#dc3545',
      manager: '#fd7e14',
      user: '#6c757d'
    };
    
    return (
      <span 
        style={{ 
          backgroundColor: roleColors[role] || '#6c757d',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.8em',
          marginLeft: '8px'
        }}
      >
        {role.toUpperCase()}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">
          <i className="fas fa-boxes"></i> Inventory Manager
        </Link>
      </div>
      
      <div className="nav-menu">
        <Link to="/dashboard" className="nav-link">
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        
        <Link to="/products" className="nav-link">
          <i className="fas fa-box"></i> Products
        </Link>
        
        {canManageProducts() && (
          <Link to="/add-product" className="nav-link">
            <i className="fas fa-plus"></i> Add Product
          </Link>
        )}
        
        {canViewAnalytics() && (
          <Link to="/analytics" className="nav-link">
            <i className="fas fa-chart-bar"></i> Analytics
          </Link>
        )}
        
        {isAdmin() && (
          <Link to="/users" className="nav-link">
            <i className="fas fa-users"></i> Users
          </Link>
        )}
      </div>
      
      <div className="nav-user">
        <span className="user-info">
          <i className="fas fa-user"></i> {user?.username || 'User'}
          {getRoleBadge(user?.role)}
        </span>
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 