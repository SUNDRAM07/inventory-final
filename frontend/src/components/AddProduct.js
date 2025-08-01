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
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-plus"></i> Add New Product</h1>
        <p>Create a new product in your inventory</p>
      </div>

      <div className="add-product-form">
        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3><i className="fas fa-info-circle"></i> Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Product Type *</label>
                <select
                  id="type"
                  name="type"
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
                  <option value="Furniture">Furniture</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., PROD-001"
                  required
                />
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="form-section">
              <h3><i className="fas fa-warehouse"></i> Inventory & Pricing</h3>
              
              <div className="form-group">
                <label htmlFor="quantity">Initial Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="image-preview">
                    <img 
                      src={formData.image_url} 
                      alt="Product preview" 
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
          <div className="form-section full-width">
            <h3><i className="fas fa-align-left"></i> Product Description</h3>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Enter detailed product description..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Adding Product...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Add Product
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct; 