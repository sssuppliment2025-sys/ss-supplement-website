// Main.jsx
import React from "react";
import "./App.css"; // optional styling file

const productCategories = [
  "Protein Wafer Bar",
  "100% Performance Whey",
  "Fuel Whey",
  "Whey Protein",
  "Isorich Protein",
  "Creatine Monohydrate",
  "Nitro Iso Whey",
  "Alpha Whey",
  "Muscle Gainer",
  "Mass Gainer",
  "Accessories"
];

const App = () => {
  return (
    <div className="main-wrapper">

      {/* Header Section */}
      <section className="hero">
        <h1 className="title">Jamai Da Hotel</h1>
        <p className="subtitle">Fresh Flavors from Our Kitchen to Your Table</p>

        <div className="alert-box closed">
          <p className="alert-title">⏱ Currently Closed</p>
          <p className="alert-desc">
            We're closed for the day. Our kitchen is preparing fresh dishes for tomorrow!
          </p>
        </div>

        <div className="next-open">
          <p>We’ll be back at</p>
          <h2 className="open-time">7:00 AM</h2>
          <small>Regular Hours: 7:00 AM - 11:30 PM</small>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="category-section">
        {productCategories.map((item, index) => (
          <button className="category-btn" key={index}>
            {item}
          </button>
        ))}
      </section>
    </div>
  );
};

export default App;
