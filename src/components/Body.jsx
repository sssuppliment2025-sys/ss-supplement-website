import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import { ProductCard, getRandomProducts, getCategoryNames } from "../products";
import "./Body.css";


const categoryNavItems = getCategoryNames();

const Body = () => {
  const [featuredProducts] = useState(() => getRandomProducts(8));

  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  
  const getCategoryIcon = (key) => {
    const icons = {
      wheyProtein: '🥛',
      creatine: '💪',
      massGainer: '🏋️',
      multivitamin: '💊',
      fishOil: '🐟',
      preWorkout: '⚡',
      weightLoss: '🔥',
      recovery: '🩹',
      intraWorkout: '💧',
      minerals: '🧬',
      peanutButter: '🥜',
      ayurvedic: '🌿',
      proteinBars: '🍫',
      accessories: '🎒'
    };
    return icons[key] || '📦';
  };

  return (
    <>
      {/* ====== Laptop / Desktop View ====== */}
      <div className="main-wrapper desktop-view">
        {/* Image Carousel */}
        <ImageCarousel />

        {/* Category Navigation - Links to separate pages */}
        <section className="category-grid-section">
          <h2 className="section-heading">Shop by Category</h2>
          <div className="category-grid">
            {categoryNavItems.map((cat) => (
              <Link 
                to={`/products/${cat.slug}`}
                className="category-card-link"
                key={cat.key}
              >
                <span className="cat-icon">{getCategoryIcon(cat.key)}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Featured Products</h2>
            <span className="product-count">Handpicked for you</span>
          </div>
          <div className="featured-products-scroll">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ====== Mobile / Phone View ====== */}
      <div className="main-wrapper mobile-view">
        <ImageCarousel />

        {/* Category Navigation - Mobile */}
        <section className="category-grid-section">
          <h2 className="section-heading">Shop by Category</h2>
          <div className="category-grid mobile">
            {categoryNavItems.map((cat) => (
              <Link 
                to={`/products/${cat.slug}`}
                className="category-card-link"
                key={cat.key}
              >
                <span className="cat-icon">{getCategoryIcon(cat.key)}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section - Mobile */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Featured Products</h2>
          </div>
          <div className="featured-products-scroll">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Body;
