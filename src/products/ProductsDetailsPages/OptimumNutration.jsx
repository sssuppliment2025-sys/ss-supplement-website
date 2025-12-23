import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getAllProducts } from "../productsData";
import "../ProductsDetailsPagesCss/AllProductsDetailsPages.css";

const defaultImage = "https://via.placeholder.com/400";

const OptimumNutration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [suggestiveProducts, setSuggestiveProducts] = useState([]);

  // For load use effect
  useEffect(() => {
    setAllProducts(getAllProducts());
  }, []);

  //id changes
  useEffect(() => {
    if (!allProducts.length) return;
    const product = allProducts.find(p => p.id === Number(id));
    if (!product) return;

    setCurrentProduct(product);
    setSelectedFlavor(product.flavors);
    setSelectedWeight(product.weight);

    // Donchan by random suggestive products
    const filtered = allProducts.filter(p => p.id !== product.id);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setSuggestiveProducts(shuffled.slice(0, 4));
  }, [id, allProducts]);

  if (!currentProduct) return <h2 className="not-found">Product not found</h2>;

  const relatedProducts = allProducts.filter(p => p.name === currentProduct.name);
  const flavorOptions = relatedProducts.map(p => p.flavors);
  const weightOptions = [...new Set(relatedProducts.map(p => p.weight))];

  const finalProduct = {
    ...currentProduct,
    selectedFlavor,
    selectedWeight,
  };

  const handleFlavorClick = (flavor) => {
    const matched = relatedProducts.find(p => p.flavors === flavor && p.weight === selectedWeight);
    if (matched) navigate(`/product/${matched.id}`);
  };

  const handleWeightClick = (weight) => {
    const matched = relatedProducts.find(p => p.weight === weight && p.flavors === selectedFlavor);
    if (matched) navigate(`/product/${matched.id}`);
  };

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="image-box">
          <img src={currentProduct.image || defaultImage} alt={currentProduct.name} />
        </div>

        <div className="product-details">
          <h1>{currentProduct.name}</h1>

          {weightOptions.length > 0 && (
            <div className="option-group">
              <h4>Select Weight</h4>
              <div className="option-scroll">
                {weightOptions.map((w) => (
                  <button
                    key={w}
                    className={selectedWeight === w ? "active" : ""}
                    onClick={() => handleWeightClick(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {flavorOptions.length > 0 && (
            <div className="option-group">
              <h4>Select Flavor</h4>
              <div className="option-scroll">
                {flavorOptions.map((f, idx) => (
                  <button
                    key={idx}
                    className={selectedFlavor === f ? "active" : ""}
                    onClick={() => handleFlavorClick(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <h2 className="price">₹{currentProduct.price}</h2>

          <div className="btn-group">
            <button className="buy-btn" onClick={() => { addToCart(finalProduct); navigate("/cart"); }}>
              Buy Now
            </button>
            <button className="cart-btn" onClick={() => addToCart(finalProduct)}>Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="suggested-section">
        <h2>You may also like</h2>
        <div className="suggested-grid">
          {suggestiveProducts.map((p) => (
            <div
              key={p.id}
              className="suggested-card"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <img src={p.image || defaultImage} alt={p.name} />
              <div className="suggested-title">{p.name}</div>
              <div className="suggested-price">₹{p.price}</div>
              <button
                className="suggested-btn"
                onClick={(e) => { e.stopPropagation(); addToCart(p); }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptimumNutration;
