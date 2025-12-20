import React, { useState } from 'react';
import Layout from '../components/Layout';
import { productCategories } from './productsData';
import './ProductImageManager.css';

const ProductImageManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('wheyProtein');
  const [productImages, setProductImages] = useState(() => {
    const saved = localStorage.getItem('productImages');
    return saved ? JSON.parse(saved) : {};
  });
  const [imageUrl, setImageUrl] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSaveImage = (productId) => {
    if (!imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    const newImages = {
      ...productImages,
      [productId]: imageUrl
    };
    
    setProductImages(newImages);
    localStorage.setItem('productImages', JSON.stringify(newImages));
    setImageUrl('');
    setSelectedProductId(null);
    alert('Image saved successfully!');
  };

  const handleRemoveImage = (productId) => {
    const newImages = { ...productImages };
    delete newImages[productId];
    setProductImages(newImages);
    localStorage.setItem('productImages', JSON.stringify(newImages));
  };

  const handleFileUpload = (e, productId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = {
          ...productImages,
          [productId]: reader.result
        };
        setProductImages(newImages);
        localStorage.setItem('productImages', JSON.stringify(newImages));
        alert('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const products = productCategories[selectedCategory]?.products || [];

  return (
    <Layout>
      <div className="image-manager-container">
        <h1 className="manager-title">📷 Product Image Manager</h1>
        <p className="manager-description">
          Add or update product images. You can either upload a file or paste an image URL.
        </p>

        {/* Category Selector */}
        <div className="category-selector">
          <label>Select Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.entries(productCategories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Products List */}
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-image-item">
              <div className="product-preview">
                <img 
                  src={productImages[product.id] || product.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={product.name}
                  className="preview-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.weight} - {product.flavors.substring(0, 30)}...</p>
                <p className="price">₹{product.price}</p>
              </div>
              <div className="image-actions">
                {selectedProductId === product.id ? (
                  <div className="url-input-section">
                    <input 
                      type="text"
                      placeholder="Enter image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="url-input"
                    />
                    <button 
                      className="save-btn"
                      onClick={() => handleSaveImage(product.id)}
                    >
                      Save
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setSelectedProductId(null);
                        setImageUrl('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <button 
                      className="url-btn"
                      onClick={() => setSelectedProductId(product.id)}
                    >
                      Add URL
                    </button>
                    <label className="upload-btn">
                      Upload File
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, product.id)}
                        hidden
                      />
                    </label>
                    {productImages[product.id] && (
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveImage(product.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="instructions">
          <h3>📝 How to Add Product Images</h3>
          <ol>
            <li><strong>Upload File:</strong> Click "Upload File" to select an image from your computer.</li>
            <li><strong>Add URL:</strong> Click "Add URL" to enter an image URL from the internet.</li>
            <li><strong>Direct Edit:</strong> You can also edit the <code>src/products/productsData.js</code> file directly and add image paths to the <code>image</code> property of each product.</li>
          </ol>
          <p><strong>Tip:</strong> For best results, use images with dimensions of 200x200 pixels or larger.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductImageManager;
