import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    clearCart,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  /* ================= EMPTY CART ================= */
  if (cartItems.length === 0) {
    return (
      <>
        {/* HEADER */}
        <header className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <div className="brand">
            <img src="/logo.jpg" alt="SS Supplement" />
            <span>SS Supplement</span>
          </div>
        </header>

        {/* EMPTY CART */}
        <div className="empty-cart-container">
          <img
            src="/empty-cart.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h2>Your cart is empty</h2>
        </div>
      </>
    );
  }

  /* ================= CART PAGE ================= */
  return (
    <>
      {/* HEADER */}
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="brand">
          <img src="/logo.jpg" alt="SS Supplement" />
          <span>SS Supplement</span>
        </div>
      </header>

      {/* CART LAYOUT */}

      <div className="cart-layout">
        {/* LEFT */}
        <div className="cart-left">
          <h2 className="cart-title">My Cart ({cartItems.length})</h2>

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-img"
              />

              <div className="cart-item-info">
                <h4>{item.name}</h4>

                <p className="item-meta">
                  Weight: {item.weight || "N/A"}
                </p>

                <p className="item-meta">
                  Flavour: {item.flavors || "None"}
                </p>

                <p className="price">₹{item.price}</p>
              </div>

              <div className="cart-actions">
                <div className="cart-qty">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    disabled={item.qty === 1}
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <h3>PRICE DETAILS</h3>

          <div className="price-row">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="price-row">
            <span>Platform Fee</span>
            <span>₹7</span>
          </div>

          <hr />

          <div className="price-row total">
            <span>Total Amount</span>
            <span>₹{totalPrice + 7}</span>
          </div>

          <button
            className="place-order-btn"
            onClick={() => navigate("/AddressPage")}
          >
            PLACE ORDER
          </button>

          <button className="clear-cart-link" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="cart-footer">
        ⭐ 1000+ Happy Customers ❤️
      </footer>
    </>
  );
};

export default Cart;
