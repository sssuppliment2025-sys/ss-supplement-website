import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { productCategories, getProductsByCategory } from '../data/products';
import './ProductSection.css';

const ProductSection = ({ categoryKey, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);
  
  const category = productCategories[categoryKey];
  if (!category) return null;

  const products = category.products;
  const displayProducts = expanded ? products : products.slice(0, 4);

  const handleAddToCart = (product) => {
    // You can implement cart functionality here
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">{category.name}</h2>
        <span className="product-count">{products.length} Products</span>
      </div>
      
      <div className="products-grid">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      
      {products.length > 4 && (
        <button 
          className="view-all-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : `View All ${products.length} Products`}
        </button>
      )}
    </section>
  );
};

export default ProductSection;
