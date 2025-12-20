import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from './ProductCard';
import { productCategories, getCategoryBySlug } from './productsData';
import './CategoryPage.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const [category, setCategory] = useState(null);
  const [categoryKey, setCategoryKey] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const productRefs = useRef({});

  useEffect(() => {
    const result = getCategoryBySlug(slug);
    if (result) {
      const [key, cat] = result;
      setCategoryKey(key);
      setCategory(cat);
      setFilteredProducts(cat.products);
    }
  }, [slug]);

  // Handle highlight scroll
  useEffect(() => {
    if (highlightId && filteredProducts.length > 0) {
      setHighlightedProduct(parseInt(highlightId));
      
      // Scroll to the product after a short delay to ensure DOM is ready
      setTimeout(() => {
        const productElement = productRefs.current[highlightId];
        if (productElement) {
          productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedProduct(null);
      }, 3000);
    }
  }, [highlightId, filteredProducts]);

  useEffect(() => {
    if (category) {
      let sorted = [...category.products];
      switch (sortBy) {
        case 'price-low':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      setFilteredProducts(sorted);
    }
  }, [sortBy, category]);

  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  if (!category) {
    return (
      <Layout>
        <div className="category-page">
          <div className="not-found">
            <h1>Category Not Found</h1>
            <p>The category you're looking for doesn't exist.</p>
            <Link to="/" className="back-btn">← Back to Home</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="category-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="current">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="category-header">
          <div className="category-info">
            <h1>{category.name}</h1>
            <p className="category-description">{category.description}</p>
            <span className="product-count">{category.products.length} Products</span>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="filter-bar">
          <div className="sort-section">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-container">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              ref={(el) => productRefs.current[product.id] = el}
              className={`product-wrapper ${highlightedProduct === product.id ? 'highlighted' : ''}`}
            >
              <ProductCard 
                product={{ ...product, category: category.name }} 
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="back-section">
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
