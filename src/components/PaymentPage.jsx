import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../pages/Cart.css";
import "./AddressPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // last saved address
  const savedAddresses =
    JSON.parse(localStorage.getItem("ss_addresses")) || [];
  const address = savedAddresses[savedAddresses.length - 1];

  /* ================= WHATSAPP MESSAGE ================= */
  const buildWhatsAppMessage = () => {
    const products = cartItems
      .map(
        (item) =>
          `• ${item.name} (${item.weight || ""}, ${
            item.flavour || "No flavour"
          }) x ${item.qty} = ₹${item.price * item.qty}`
      )
      .join("\n");

    return `
🛒 *NEW ORDER – SS SUPPLEMENT*

📦 *Products*
${products}

💰 *Bill*
Subtotal: ₹${totalPrice}
Platform Fee: ₹7
Total: ₹${totalPrice + 7}

💳 *Payment Method*
${paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}

${
  paymentMethod === "online"
    ? `🔐 *Transaction ID*\n${transactionId}`
    : ""
}

🏠 *Delivery Address*
${address?.name}
${address?.phone}
${address?.address}
${address?.locality}, ${address?.city}
${address?.state} - ${address?.pincode}

Please confirm this order.
    `;
  };

  /* ================= SEND TO WHATSAPP ================= */
  const placeOrderOnWhatsApp = () => {
    if (paymentMethod === "online" && !transactionId.trim()) {
      alert("Please enter Transaction ID");
      return;
    }

    const numbers = [
      "918900299008",
      "919123456789",
    ];

    const randomNumber =
      numbers[Math.floor(Math.random() * numbers.length)];

    const message = encodeURIComponent(buildWhatsAppMessage());

    window.open(
      `https://wa.me/${randomNumber}?text=${message}`,
      "_blank"
    );

    clearCart();
  };

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

      {/* SAME CART LAYOUT */}
      <div className="cart-layout">
        {/* LEFT */}
        <div className="cart-left">
          <h2 className="cart-title">Payment</h2>

          <p style={{ color: "var(--text-muted)", marginBottom: "14px" }}>
            Choose a payment method to complete your order.
          </p>

          {/* PAYMENT OPTIONS */}
          <div className="address-type-inline">
            <label>
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>

          {/* ONLINE PAYMENT */}
          {paymentMethod === "online" && (
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                Complete payment using QR / UPI and enter the Transaction ID.
              </p>

              <input
                type="text"
                placeholder="Enter Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
          )}

          {/* PLACE ORDER */}
          {paymentMethod && (
            <button
              className="place-order-btn"
              style={{ marginTop: "30px" }}
              onClick={placeOrderOnWhatsApp}
            >
              Place Order via WhatsApp
            </button>
          )}
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
        </div>
      </div>

      {/* FOOTER */}
      <footer className="cart-footer">
        ⭐ 1000+ Happy Customers ❤️
      </footer>
    </>
  );
};

export default PaymentPage;
