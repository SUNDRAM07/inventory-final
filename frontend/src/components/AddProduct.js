import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    sku: '',
    image_url: '',
    description: '',
    quantity: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.sku || !formData.quantity || !formData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate numeric fields
      if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
        toast.error('Quantity must be a positive number');
        return;
      }

      if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        toast.error('Price must be a positive number');
        return;
      }

      const productData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
      };

      await axios.post('/products', productData);
      
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to add product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        <i className="fas fa-plus"></i> Add New Product
      </h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Basic Information */}
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>
                <i className="fas fa-info-circle"></i> Basic Information
              </h3>
              
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Product Type *</label>
                <select
                  id="type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                  <option value="Toys">Toys</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="form-control"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., PROD-001"
                  required
                />
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>
                <i className="fas fa-warehouse"></i> Inventory & Pricing
              </h3>
              
              <div className="form-group">
                <label htmlFor="quantity">Initial Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  className="form-control"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={formData.image_url} 
                      alt="Product preview" 
                      style={{ 
                        maxWidth: '100px', 
                        maxHeight: '100px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description..."
            />
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct; 