import React from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

const productCategories = [
  "Protein Wafer Bar",
  "100% Performance Whey",
  "Fuel Whey",
  "Whey Protein",
  "Isorich Protein",
  "Creatine Monohydrate",
  "Nitro Iso Whey", // ← your line was broken, now fixed
  "Alpha Whey",
  "Muscle Gainer",
  "Mass Gainer",
  "Accessories"
];

const App = () => {
  return (
    <>
      <Header />

      {/* ====== Laptop/Desktop View ====== */}
      {/* <div className="main-wrapper desktop-view">
        <section className="hero">
          <h1 className="title">SS Supplement</h1>
          <p className="subtitle">Genuine product, cheap price.</p>
        </section>

        <section className="category-section">
          {productCategories.map((item, index) => (
            <button className="category-btn" key={index}>
              {item}
            </button>
          ))}
        </section>
      </div> */}

      {/* ====== Mobile/Phone View ====== */}
      {/* <div className="main-wrapper mobile-view">
        <section className="hero">
          <h1 className="title">SS Supplement</h1>
          <p className="subtitle">Genuine product, cheap price.</p>
        </section>

        <section className="category-section">
          {productCategories.map((item, index) => (
            <button className="category-btn" key={index}>
              {item}
            </button>
          ))}
        </section>
      </div> */}

      <Footer />
    </>
  );
};

export default App;
