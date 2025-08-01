import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    categories: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        <i className="fas fa-tachometer-alt"></i> Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
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

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>
          <i className="fas fa-bolt"></i> Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/add-product" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Product
          </Link>
          <Link to="/products" className="btn btn-success">
            <i className="fas fa-list"></i> View All Products
          </Link>
          <Link to="/analytics" className="btn btn-primary">
            <i className="fas fa-chart-bar"></i> View Analytics
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>
          <i className="fas fa-clock"></i> Recent Products
        </h3>
        {recentProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
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
                      <span className={`badge ${product.quantity < 10 ? 'badge-danger' : 'badge-success'}`}>
                        {product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No products found. <Link to="/add-product">Add your first product</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 