import React from "react";
import ImageCarousel from "./ImageCarousel";

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
  "Accessories",
];

const Body = () => {
  return (
    <>
      {/* ====== Laptop / Desktop View ====== */}
      <div className="main-wrapper desktop-view">
        {/* Image Carousel */}
        <ImageCarousel />

        <section className="category-section" >
          {productCategories.map((item, index) => (
            <button className="category-btn" key={index}>
              <a href="/UnderConstruction">{item}</a>
            </button>
          ))}
        </section>
      </div>

      {/* ====== Mobile / Phone View ====== */}
      <div className="main-wrapper mobile-view">
        <ImageCarousel />

        <section className="category-section">
          {productCategories.map((item, index) => (
            <button className="category-btn" key={index}>
              <a href="/UnderConstruction">{item}</a>
            </button>
          ))}
        </section>
      </div>
    </>
  );
};

export default Body;
