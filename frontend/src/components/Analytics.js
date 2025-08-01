import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    lowStockCount: 0,
    categoryDistribution: {},
    topProducts: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('/products?limit=100');
      const productsData = response.data;
      setProducts(productsData);

      // Calculate analytics
      const totalProducts = productsData.length;
      const totalValue = productsData.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
      const lowStockCount = productsData.filter(product => product.quantity < 10).length;

      // Category distribution
      const categoryDistribution = {};
      productsData.forEach(product => {
        categoryDistribution[product.type] = (categoryDistribution[product.type] || 0) + 1;
      });

      // Top products by value
      const topProducts = productsData
        .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
        .slice(0, 5);

      setAnalytics({
        totalProducts,
        totalValue: totalValue.toFixed(2),
        averagePrice: averagePrice.toFixed(2),
        lowStockCount,
        categoryDistribution,
        topProducts
      });

    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const categoryChartData = {
    labels: Object.keys(analytics.categoryDistribution),
    datasets: [
      {
        data: Object.values(analytics.categoryDistribution),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const topProductsChartData = {
    labels: analytics.topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Total Value ($)',
        data: analytics.topProducts.map(product => (product.price * product.quantity).toFixed(2)),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        <i className="fas fa-chart-bar"></i> Analytics
      </h1>

      {/* Key Metrics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{analytics.totalProducts}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>${analytics.totalValue}</h3>
          <p>Total Inventory Value</p>
        </div>
        <div className="stat-card">
          <h3>${analytics.averagePrice}</h3>
          <p>Average Product Value</p>
        </div>
        <div className="stat-card">
          <h3>{analytics.lowStockCount}</h3>
          <p>Low Stock Items</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Category Distribution */}
        <div className="chart-container">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            <i className="fas fa-chart-pie"></i> Product Categories
          </h3>
          {Object.keys(analytics.categoryDistribution).length > 0 ? (
            <div style={{ height: '300px', position: 'relative' }}>
              <Doughnut 
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No data available</p>
          )}
        </div>

        {/* Top Products by Value */}
        <div className="chart-container">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            <i className="fas fa-trophy"></i> Top Products by Value
          </h3>
          {analytics.topProducts.length > 0 ? (
            <div style={{ height: '300px', position: 'relative' }}>
              <Bar 
                data={topProductsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Total Value ($)'
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No data available</p>
          )}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          <i className="fas fa-list"></i> Detailed Analytics
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Category Breakdown */}
          <div>
            <h4 style={{ marginBottom: '15px', color: '#555' }}>Category Breakdown</h4>
            {Object.entries(analytics.categoryDistribution).map(([category, count]) => (
              <div key={category} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>{category}</span>
                <span style={{ fontWeight: 'bold' }}>{count} products</span>
              </div>
            ))}
          </div>

          {/* Top Products List */}
          <div>
            <h4 style={{ marginBottom: '15px', color: '#555' }}>Top Products by Value</h4>
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{index + 1}. {product.name}</span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {product.type} • Qty: {product.quantity}
                  </div>
                </div>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                  ${(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Low Stock Alert */}
          <div>
            <h4 style={{ marginBottom: '15px', color: '#555' }}>Low Stock Alert</h4>
            {products.filter(product => product.quantity < 10).map(product => (
              <div key={product.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{product.name}</span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {product.type} • SKU: {product.sku}
                  </div>
                </div>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: product.quantity === 0 ? '#dc3545' : '#ffc107'
                }}>
                  {product.quantity} left
                </span>
              </div>
            ))}
            {products.filter(product => product.quantity < 10).length === 0 && (
              <p style={{ color: '#28a745', fontStyle: 'italic' }}>
                No low stock items! 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 