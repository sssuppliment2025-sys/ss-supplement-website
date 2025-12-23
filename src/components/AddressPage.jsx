import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../pages/Cart.css";
import "./AddressPage.css";

const SERVICEABLE_PINCODES = ["721652", "721101", "700001"];
const STORAGE_KEY = "ss_addresses";   // final address (single)
const DRAFT_KEY = "ss_address_draft"; // live draft

const BASE_FORM = {
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
};

const Address = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();

  const initialized = useRef(false);

  const [form, setForm] = useState(BASE_FORM);
  const [status, setStatus] = useState("");

  /* ================= RESTORE ON FIRST LOAD ================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const draft = localStorage.getItem(DRAFT_KEY);

    if (saved) {
      setForm({ ...BASE_FORM, ...JSON.parse(saved) });
    } else if (draft) {
      setForm({ ...BASE_FORM, ...JSON.parse(draft) });
    }

    initialized.current = true;
  }, []);

  /* ================= AUTO-SAVE DRAFT ================= */
  useEffect(() => {
    if (!initialized.current) return;

    const hasData = Object.values(form).some(Boolean);
    if (hasData) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }
  }, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus("");
  };

  const checkDeliverable = (pin) => {
    setStatus(
      SERVICEABLE_PINCODES.includes(pin)
        ? "deliverable"
        : "not-deliverable"
    );
  };

  /* ================= SAVE FINAL ADDRESS ================= */
  const saveAddressToLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  };

  /* ================= USE CURRENT LOCATION ================= */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "ss-supplement-app/1.0",
              },
            }
          );

          const data = await res.json();
          const a = data.address || {};

          const pincode = a.postcode || "";
          const city =
            a.city || a.town || a.village || a.county || "";
          const locality =
            a.suburb || a.neighbourhood || a.village || city || "";

          const addressLine = [
            a.house_number,
            a.road,
            locality,
            city,
          ]
            .filter(Boolean)
            .join(", ");

          setForm((prev) => ({
            ...prev,
            pincode,
            city,
            locality,
            address: addressLine || data.display_name || "",
          }));

          checkDeliverable(pincode);
        } catch {
          alert("Unable to fetch address. Please fill manually.");
        }
      },
      () => alert("Location permission denied"),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.pincode ||
      !form.address ||
      !form.city
    ) {
      alert("⚠️ Please fill all required address details.");
      return;
    }

    if (status === "not-deliverable") {
      alert("❌ Currently not deliverable to this address.");
      return;
    }

    saveAddressToLocal();
    navigate("/payment");
  };

  /* ================= UI ================= */
  return (
    <>
      {/* HEADER */}
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <div className="brand">
          <img src="/logo.jpg" alt="SS Supplement" />
          <span>SS Supplement</span>
        </div>
      </header>

      <div className="cart-layout">
        {/* LEFT */}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => {
                handleChange(e);
                checkDeliverable(e.target.value);
              }}
            />

            <input name="locality" placeholder="Locality" value={form.locality} onChange={handleChange} />

            <textarea
              name="address"
              placeholder="Address (Area and Street)"
              value={form.address}
              onChange={handleChange}
              maxLength={100}
              className="address-textarea"
            />

            <p className="char-count">{(form.address || "").length}/100</p>

            <input name="city" placeholder="City/District/Town" value={form.city} onChange={handleChange} />

            <select disabled>
              <option>West Bengal</option>
            </select>

            <input name="landmark" placeholder="Landmark (Optional)" value={form.landmark} onChange={handleChange} />
            <input name="altPhone" placeholder="Alternate Phone (Optional)" value={form.altPhone} onChange={handleChange} />
          </div>

          {/* ADDRESS TYPE */}
          <div className="address-type">
            <p><b>Address Type</b></p>
            <div className="address-type-options">
              <label>
                <input
                  type="radio"
                  checked={form.addressType === "home"}
                  onChange={() => setForm({ ...form, addressType: "home" })}
                />
                Home (All day delivery)
              </label>

              <label>
                <input
                  type="radio"
                  checked={form.addressType === "work"}
                  onChange={() => setForm({ ...form, addressType: "work" })}
                />
                Work (10 AM – 5 PM)
              </label>
            </div>
          </div>

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

          <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
            <button className="place-order-btn" onClick={handleSubmit}>
              SAVE AND CONTINUE
            </button>
            <button className="clear-cart-link" onClick={() => navigate(-1)}>
              CANCEL
            </button>
          </div>
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

      <footer className="cart-footer">
        ⭐ 1000+ Happy Customers ❤️
      </footer>
    </>
  );
};

export default Address;
