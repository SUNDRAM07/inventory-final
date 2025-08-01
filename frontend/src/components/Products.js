import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const { canManageProducts } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/products/${productId}/quantity`, 
        { quantity: parseInt(newQuantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Quantity updated successfully');
      fetchProducts(); // Refresh the list
      setEditingId(null);
      setEditQuantity('');
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Error updating quantity:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditQuantity(product.quantity.toString());
  };

  const handleSave = (productId) => {
    if (editQuantity && !isNaN(editQuantity)) {
      updateQuantity(productId, editQuantity);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditQuantity('');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || product.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = [...new Set(products.map(product => product.type))];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-box"></i> Products</h1>
        <p>Manage your inventory products</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Created</th>
              {canManageProducts() && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                    <div>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <p className="product-description">{product.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>{product.type}</td>
                <td>{product.sku}</td>
                <td>
                  {editingId === product.id ? (
                    <div className="edit-quantity">
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        min="0"
                      />
                      <button 
                        onClick={() => handleSave(product.id)}
                        className="btn btn-success btn-sm"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="btn btn-secondary btn-sm"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <span className={`quantity ${product.quantity < 10 ? 'low-stock' : ''}`}>
                      {product.quantity}
                    </span>
                  )}
                </td>
                <td>${product.price}</td>
                <td>{new Date(product.created_at).toLocaleDateString()}</td>
                {canManageProducts() && (
                  <td>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-primary btn-sm"
                      title="Edit quantity"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products; 