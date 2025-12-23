import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../pages/Cart.css"; // reuse cart theme
import "./AddressPage.css";

const SERVICEABLE_PINCODES = ["721652", "721101", "700001"];
const STORAGE_KEY = "ss_addresses";

const Address = () => {
  const navigate = useNavigate();

  /* CART DATA FOR RIGHT SECTION */
  const { cartItems, totalPrice, clearCart } = useCart();

  /* ADDRESS FORM STATE */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "West Bengal",
    landmark: "",
    altPhone: "",
    addressType: "home",
  });

  const [status, setStatus] = useState("");

  /* ================= FORM HANDLING ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus("");
  };

  const checkDeliverable = (pin) => {
    if (SERVICEABLE_PINCODES.includes(pin)) {
      setStatus("deliverable");
    } else {
      setStatus("not-deliverable");
    }
  };

  /* ================= SAVE ADDRESS ================= */
  const saveAddressToLocal = () => {
    const existing =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const alreadyExists = existing.some(
      (addr) =>
        addr.phone === form.phone &&
        addr.pincode === form.pincode &&
        addr.address === form.address
    );

    if (!alreadyExists) {
      existing.push(form);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  };

  /* ================= USE CURRENT LOCATION ================= */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        const autoPin = "721652";

        setForm({
          ...form,
          pincode: autoPin,
          locality: "Moyna",
          address: "Moyna Subdistrict",
          city: "Purba Medinipur",
          state: "West Bengal",
        });

        checkDeliverable(autoPin);
      },
      () => alert("Unable to fetch location")
    );
  };

  return (
    <>
      {/* HEADER (SAME AS CART) */}
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
        {/* LEFT → ADDRESS FORM */}
        <div className="cart-left">
          <h2 className="cart-title">Delivery Address</h2>

          <button
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px 14px",
              border: "none",
              borderRadius: "6px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={useCurrentLocation}
          >
            📍 Use my current location
          </button>

          {/* FORM GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => {
                handleChange(e);
                checkDeliverable(e.target.value);
              }}
            />

            <input
              name="locality"
              placeholder="Locality"
              value={form.locality}
              onChange={handleChange}
            />

            <textarea
              name="address"
              placeholder="Address (Area and Street)"
              value={form.address}
              onChange={handleChange}
              maxLength={100}
              className="address-textarea"
            />

            <p className="char-count">
              {form.address.length}/100
            </p>

            <input
              name="city"
              placeholder="City/District/Town"
              value={form.city}
              onChange={handleChange}
            />

            {/* STATE DROPDOWN */}
            <select disabled>
              <option>West Bengal</option>
            </select>

            <input
              name="landmark"
              placeholder="Landmark (Optional)"
              value={form.landmark}
              onChange={handleChange}
            />

            <input
              name="altPhone"
              placeholder="Alternate Phone (Optional)"
              value={form.altPhone}
              onChange={handleChange}
            />
          </div>

          {/* ADDRESS TYPE */}
          <div style={{ marginTop: "20px" }}>
            <p><b>Address Type</b></p>

            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                checked={form.addressType === "home"}
                onChange={() =>
                  setForm({ ...form, addressType: "home" })
                }
              />
              Home
            </label>

            <label>
              <input
                type="radio"
                checked={form.addressType === "work"}
                onChange={() =>
                  setForm({ ...form, addressType: "work" })
                }
              />
              Work
            </label>
          </div>

          {/* STATUS */}
          {status === "not-deliverable" && (
            <p style={{ color: "red", marginTop: "10px" }}>
              ❌ Currently not deliverable
            </p>
          )}

          {status === "deliverable" && (
            <p style={{ color: "green", marginTop: "10px" }}>
              ✔ Deliverable to this address
            </p>
          )}

          {/* ACTIONS */}
          <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
            <button
              className="place-order-btn"
              disabled={status !== "deliverable"}
              onClick={() => {
                saveAddressToLocal();
                navigate("/payment");
              }}
            >
              SAVE AND CONTINUE
            </button>

            <button
              className="clear-cart-link"
              onClick={() => navigate(-1)}
            >
              CANCEL
            </button>
          </div>
        </div>

        {/* RIGHT → CART SUMMARY */}
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

          {/* <button
            className="clear-cart-link"
            onClick={clearCart}
            style={{ marginTop: "20px" }}
          >
            Clear Cart
          </button> */}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="cart-footer">
        ⭐ 1000+ Happy Customers ❤️
      </footer>
    </>
  );
};

export default Address;
