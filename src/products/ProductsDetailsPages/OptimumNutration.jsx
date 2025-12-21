import React from "react";
import { useLocation } from "react-router-dom";
import "../ProductsDetailsPagesCss/AllProductsDetailsPages.css";

const OptimumNutration = () => {
  const { state } = useLocation();
  const product = state?.product;

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Product not found</h2>;
  }

  const manufacturingPrice = product.price - 600;
  const profit = product.price - manufacturingPrice;

  return (
    <div className="product-page">
      <div className="product-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <div className="product-details">
          <h1>{product.name}</h1>
          <p>{product.weight}</p>
          <p>{product.flavors}</p>

          <div className="price-box">
            <p>
              <span>Manufacturing Price:</span> ₹{manufacturingPrice}
            </p>
            <p>
              <span>Selling Price:</span> ₹{product.price}
            </p>
            <p className="profit">Estimated Profit: ₹{profit}</p>
          </div>

          <button className="buy-btn">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default OptimumNutration;
