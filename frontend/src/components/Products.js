import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products?limit=100');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId) => {
    if (!newQuantity || newQuantity < 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      await axios.put(`/products/${productId}/quantity`, {
        quantity: parseInt(newQuantity)
      });
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, quantity: parseInt(newQuantity) }
          : product
      ));
      
      setEditingQuantity(null);
      setNewQuantity('');
      toast.success('Quantity updated successfully');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = [...new Set(products.map(product => product.type))];

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        <i className="fas fa-box"></i> Products
      </h1>

      {/* Search and Filter */}
      <div className="card">
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-control"
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
      </div>

      {/* Products Table */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>
          Products ({filteredProducts.length})
        </h3>
        
        {filteredProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div>
                        <strong>{product.name}</strong>
                        {product.description && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{product.type}</td>
                    <td>{product.sku}</td>
                    <td>
                      {editingQuantity === product.id ? (
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                            style={{ width: '60px', padding: '5px' }}
                            min="0"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(product.id)}
                            className="btn btn-success"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingQuantity(null);
                              setNewQuantity('');
                            }}
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: product.quantity < 10 ? '#dc3545' : '#28a745'
                          }}>
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => {
                              setEditingQuantity(product.id);
                              setNewQuantity(product.quantity.toString());
                            }}
                            className="btn btn-primary"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td>${product.price}</td>
                    <td>${(product.price * product.quantity).toFixed(2)}</td>
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
            No products found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products; 