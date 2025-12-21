import { useEffect, useState } from "react";
import "./AddressPage.css";

const STORAGE_KEY = "saved_addresses";

const emptyForm = {
  id: null,
  name: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "West Bengal",
  landmark: "",
  altPhone: "",
  type: "Home",
  isDefault: false,
};

export default function AddressPage() {
  const [form, setForm] = useState(emptyForm);
  const [addresses, setAddresses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= LOAD ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setAddresses(saved);
  }, []);

  /* ================= HELPERS ================= */
  const saveStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAddresses(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Invalid phone";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Invalid pincode";
    if (!form.address) e.address = "Address required";
    if (!form.city) e.city = "City required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!validate()) return;

    let updated = [...addresses];

    if (form.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }

    if (editMode) {
      updated = updated.map((a) => (a.id === form.id ? form : a));
    } else {
      updated.push({ ...form, id: Date.now() });
    }

    saveStorage(updated);
    setForm(emptyForm);
    setEditMode(false);
    setErrors({});
  };

  /* ================= ACTIONS ================= */
  const editAddress = (addr) => {
    setForm(addr);
    setEditMode(true);
  };

  const deleteAddress = (id) => {
    if (!window.confirm("Delete address?")) return;
    saveStorage(addresses.filter((a) => a.id !== id));
  };

  /* ================= GEOLOCATION ================= */
  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`
      );
      const data = await res.json();

      if (!data.results?.length) return;

      const c = data.results[0].address_components;
      const get = (t) => c.find((x) => x.types.includes(t))?.long_name || "";

      setForm((p) => ({
        ...p,
        address: data.results[0].formatted_address,
        pincode: get("postal_code"),
        city: get("administrative_area_level_2"),
        locality: get("sublocality") || get("locality"),
      }));
    });
  };

  return (
    <>
      <div className="address-page">
        
        <div className="address-box">
          <div className="address-header">DELIVERY ADDRESS</div>

          <button className="location-btn" onClick={useMyLocation}>
            📍 Use my current location
          </button>

          <div className="form-grid">
            <div>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div>
              <input name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div>
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
              {errors.pincode && <span className="error">{errors.pincode}</span>}
            </div>

            <input name="locality" placeholder="Locality" value={form.locality} onChange={handleChange} />

            <div className="full">
              <textarea name="address" placeholder="Address (Area & Street)" value={form.address} onChange={handleChange} />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div>
              <input name="city" placeholder="City/District/Town" value={form.city} onChange={handleChange} />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <select name="state" value={form.state} onChange={handleChange}>
              <option>West Bengal</option>
              <option>Bihar</option>
              <option>Odisha</option>
            </select>

            <input name="landmark" placeholder="Landmark (Optional)" value={form.landmark} onChange={handleChange} />
            <input name="altPhone" placeholder="Alternate Phone (Optional)" value={form.altPhone} onChange={handleChange} />

            <div className="full address-type">
              <label><input type="radio" name="type" value="Home" checked={form.type === "Home"} onChange={handleChange} /> Home</label>
              <label><input type="radio" name="type" value="Work" checked={form.type === "Work"} onChange={handleChange} /> Work</label>
            </div>

            <div className="full">
              <label className="default-check">
                <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                Set as default address
              </label>
            </div>

            <div className="full actions">
              <button className="save-btn" onClick={handleSubmit}>
                {editMode ? "UPDATE ADDRESS" : "SAVE AND DELIVER HERE"}
              </button>
              <button className="cancel-btn" onClick={() => setForm(emptyForm)}>CANCEL</button>
            </div>
          </div>
        </div>

        {addresses.length > 0 && (
          <div className="saved-list">
            <h3>Saved Addresses</h3>
            {addresses.map((a) => (
              <div key={a.id} className="saved-card">
                <p><b>{a.name}</b> ({a.type}) {a.isDefault && <span className="badge">DEFAULT</span>}</p>
                <p>{a.address}</p>
                <p>{a.city} - {a.pincode}</p>
                <p>{a.phone}</p>
                <div className="saved-actions">
                  <button onClick={() => editAddress(a)}>Edit</button>
                  <button onClick={() => deleteAddress(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
