import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../pages/Cart.css";
import "./PaymentPage.css";

/* ================= CONFIG ================= */
const UPI_ID = "8116873240@superyes"; // 🔴 replace with real UPI

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);

  /* ================= GET SAVED ADDRESS ================= */
  const address =
    JSON.parse(localStorage.getItem("ss_addresses")) || null;

  /* ================= COPY UPI ================= */
  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Unable to copy UPI ID");
    }
  };

  /* ================= BUILD WHATSAPP MESSAGE ================= */
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
${address?.name || "N/A"}
${address?.phone || "N/A"}
${address?.address || "N/A"}
${address?.locality || ""}${address?.city ? ", " + address.city : ""}
${address?.state || ""} - ${address?.pincode || ""}

Please confirm this order.
    `;
  };

  /* ================= PLACE ORDER ================= */
  const placeOrderOnWhatsApp = () => {
    if (!address || !address.name) {
      alert("Address missing. Please add address again.");
      navigate("/AddressPage");
      return;
    }

    if (paymentMethod === "online" && transactionId.trim().length < 6) {
      alert("Please enter a valid Transaction ID");
      return;
    }

    const numbers = ["918900299008", "919123456789"];
    const randomNumber =
      numbers[Math.floor(Math.random() * numbers.length)];

    const message = encodeURIComponent(buildWhatsAppMessage());

    window.open(
      `https://wa.me/${randomNumber}?text=${message}`,
      "_blank"
    );

    clearCart();
  };

  /* ================= UI ================= */
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

      {/* LAYOUT */}
      <div className="cart-layout payment-layout">
        {/* LEFT */}
        <div className="cart-left">
          <h2 className="cart-title">Payment</h2>

          <p className="payment-subtitle">
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
            <div className="online-payment-box">
              <p className="online-info">
                Scan the QR or pay via UPI.  
                After payment, enter the <b>Transaction ID</b>.
              </p>

              {/* QR */}
              <div className="qr-wrapper">
                <img src="/upi-qr.jpeg" alt="UPI QR Code" />
              </div>

              {/* UPI + COPY */}
              <div className="upi-id">
                <b>UPI ID:</b>
                <span className="upi-text">{UPI_ID}</span>
                <button className="copy-btn" onClick={copyUpiId}>
                  {copied ? "✔ Copied" : "Copy"}
                </button>
              </div>

              {/* TRANSACTION ID */}
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
