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

  if (cartItems.length === 0) {
    return <h2 style={{ textAlign: "center" }}>🛒 Cart is empty</h2>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>

          <div className="cart-qty">
            <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>

          <button
            className="remove-btn"
            onClick={() => removeFromCart(item.id)}
          >
            ✕
          </button>
        </div>
      ))}

      <h2>Total: ₹{totalPrice}</h2>

      <button className="clear-btn" onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  );
};

export default Cart;
