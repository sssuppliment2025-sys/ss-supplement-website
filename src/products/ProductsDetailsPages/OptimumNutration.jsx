import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ProductsDetailsPagesCss/AllProductsDetailsPages.css";
import { getAllProducts } from "../productsData.js";

const OptimumNutration = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  // ❌ Safety check
  if (!product) {
    return <h2 className="not-found">Product not found</h2>;
  }

  const manufacturingPrice = product.price - 600;
  const profit = product.price - manufacturingPrice;

  // ✅ Suggested products from same category
  const suggestedProducts = getAllProducts()
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="product-page">
      {/* MAIN PRODUCT */}
      <div className="product-container">
        <div className="image-box">
          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
          />
          <span className="badge">Best Seller</span>
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="sub-text">{product.weight}</p>
          <p className="sub-text">Flavors: {product.flavors}</p>

          <div className="rating">
            ⭐⭐⭐⭐☆ <span>(4.4 / 5)</span>
          </div>

          <div className="price-box">
            <p>
              <span>Manufacturing Price:</span> ₹{manufacturingPrice}
            </p>
            <p className="sell-price">₹{product.price}</p>
            <p className="profit">Estimated Profit: ₹{profit}</p>
          </div>

          <div className="btn-group">
            <button className="buy-btn">Buy Now</button>
            <button className="cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>

      {/* SUGGESTED PRODUCTS */}
      <div className="suggested-section">
        <h2>Suggested Products</h2>

        <div className="suggested-grid">
          {suggestedProducts.map((item) => (
            <div key={item.id} className="suggested-card">
              <img
                src={item.image || "https://via.placeholder.com/200"}
                alt={item.name}
              />
              <h3>{item.name}</h3>
              <p>{item.weight}</p>
              <p className="suggested-price">₹{item.price}</p>

              {/* ✅ ALWAYS open /Product */}
              <button
                onClick={() =>
                  navigate("/Product", {
                    state: { product: item }
                  })
                }
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptimumNutration;
