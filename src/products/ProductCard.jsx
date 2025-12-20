import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const defaultProductImage =
  "https://via.placeholder.com/200x200?text=Add+Image";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate(); 

  const { id, name, weight, flavors, price, image, category } = product;
  const [displayImage, setDisplayImage] = useState(defaultProductImage);

  useEffect(() => {
    const savedImages = localStorage.getItem("productImages");
    if (savedImages) {
      const images = JSON.parse(savedImages);
      if (images[id]) {
        setDisplayImage(images[id]);
        return;
      }
    }
    setDisplayImage(image && image.trim() !== "" ? image : defaultProductImage);
  }, [id, image]);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={displayImage}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.src = defaultProductImage;
          }}
        />
        {category && (
          <span className="product-category-tag">{category}</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-weight">{weight}</p>

        <p className="product-flavors" title={flavors}>
          {flavors.length > 40 ? flavors.substring(0, 40) + "..." : flavors}
        </p>

        <div className="product-price-section">
          <span className="product-price">
            ₹{price.toLocaleString()}
          </span>

          <button
            className="add-to-cart-btn"
            onClick={() => {
              onAddToCart && onAddToCart(product); 
              navigate("/OptimumNutration");      
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
