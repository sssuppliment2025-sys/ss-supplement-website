import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext.jsx";

const defaultProductImage =
  "https://via.placeholder.com/200x200?text=Add+Image";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // ✅ ONLY HERE
  const navigate = useNavigate();

  const {
    id,
    name,
    weight,
    flavors,
    price,
    image,
    category
  } = product;

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

    setDisplayImage(
      image && image.trim() !== "" ? image : defaultProductImage
    );
  }, [id, image]);

  const handleProductClick = () => {
    navigate("/Product", { state: { product } });
  };

  return (
    <div className="product-card">
      <div
        className="product-image-container"
        onClick={handleProductClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src={displayImage}
          alt={name}
          className="product-image"
          onError={(e) => (e.target.src = defaultProductImage)}
        />

        {category && (
          <span className="product-category-tag">{category}</span>
        )}
      </div>

      <div className="product-info">
        <h3
          className="product-name"
          onClick={handleProductClick}
          style={{ cursor: "pointer" }}
        >
          {name}
        </h3>

        <p className="product-weight">{weight}</p>

        <p className="product-flavors" title={flavors}>
          {flavors.length > 40
            ? flavors.substring(0, 40) + "..."
            : flavors}
        </p>

        <div className="product-price-section">
          <span className="product-price">
            ₹{price.toLocaleString()}
          </span>

          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
