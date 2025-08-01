import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    categories: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { canManageProducts, canViewAnalytics } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse] = await Promise.all([
        axios.get('/products?limit=100')
      ]);

      const products = productsResponse.data;
      
      // Calculate statistics
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const lowStock = products.filter(product => product.quantity < 10).length;
      const categories = new Set(products.map(product => product.type)).size;
      
      setStats({
        totalProducts,
        totalValue: totalValue.toFixed(2),
        lowStock,
        categories
      });

      // Get recent products (last 5)
      setRecentProducts(products.slice(-5).reverse());
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p>Welcome to your inventory management dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard">
        <div className="stat-card">
          <h3>{stats.totalProducts}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>${stats.totalValue}</h3>
          <p>Total Inventory Value</p>
        </div>
        <div className="stat-card">
          <h3>{stats.lowStock}</h3>
          <p>Low Stock Items</p>
        </div>
        <div className="stat-card">
          <h3>{stats.categories}</h3>
          <p>Product Categories</p>
        </div>
      </div>

      {/* Quick Actions - Only show if user has permissions */}
      {(canManageProducts() || canViewAnalytics()) && (
        <div className="quick-actions">
          <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
          <div className="action-buttons">
            {canManageProducts() && (
              <Link to="/add-product" className="action-btn primary">
                <i className="fas fa-plus"></i> Add New Product
              </Link>
            )}
            <Link to="/products" className="action-btn secondary">
              <i className="fas fa-list"></i> View All Products
            </Link>
            {canViewAnalytics() && (
              <Link to="/analytics" className="action-btn primary">
                <i className="fas fa-chart-bar"></i> View Analytics
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div className="recent-products">
        <h3><i className="fas fa-clock"></i> Recent Products</h3>
        {recentProducts.length > 0 ? (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.type}</td>
                    <td>{product.sku}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                    <td>
                      <span className={`status-badge ${product.quantity < 10 ? 'low-stock' : 'in-stock'}`}>
                        {product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
            {canManageProducts() && (
              <Link to="/add-product" className="btn btn-primary">
                <i className="fas fa-plus"></i> Add Your First Product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 