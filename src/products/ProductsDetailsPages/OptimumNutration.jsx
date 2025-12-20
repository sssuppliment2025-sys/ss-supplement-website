import React from "react";
import "../ProductsDetailsPagesCss/AllProductsDetailsPages.css";


const product = {
  name: "Premium Organic Fish Feed",
  description:
    "High-quality organic fish feed designed to improve growth rate, immunity, and overall health of fish.",
  manufacturingPrice: 420,
  sellingPrice: 650,
  image:
    "https://images.unsplash.com/photo-1606813902917-0b4a8e1f3c70",
};

const suggestedProducts = [
  {
    id: 1,
    name: "Vitamin Supplement",
    price: 180,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    id: 2,
    name: "Water Purifier Solution",
    price: 260,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
  },
  {
    id: 3,
    name: "Growth Booster",
    price: 310,
    image: "https://images.unsplash.com/photo-1610394217929-3c58f60d4b1c",
  },
];

const ProductPage = () => {
  const profit = product.sellingPrice - product.manufacturingPrice;

  return (
    <div className="product-page">
      {/* Product Section */}
      <div className="product-container">
        <img src={product.image} alt={product.name} className="product-image" />

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>

          <div className="price-box">
            <p>
              <span>Manufacturing Price:</span> ₹{product.manufacturingPrice}
            </p>
            <p>
              <span>Selling Price (MRP):</span> ₹{product.sellingPrice}
            </p>
            <p className="profit">
              Estimated Profit: ₹{profit}
            </p>
          </div>

          <button className="buy-btn">Buy Now</button>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="suggested-section">
        <h2>Suggested Products</h2>

        <div className="suggested-grid">
          {suggestedProducts.map((item) => (
            <div className="suggested-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
