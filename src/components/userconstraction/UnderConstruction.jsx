import React from "react";
import "./UnderConstruction.css";
import Layout from "../Layout"; 

const UnderConstruction = () => {
  return (
    <Layout>
      <div className="about-container">
        <div className="about-card">
          {/* Shop Image */}
          <div className="about-image-wrapper">
            <img
              src="/image/About.jpg"
              alt="Our Supplement Store"
              className="about-image"
            />
          </div>

          <h1 className="about-title">About Us</h1>

          <p className="about-text">
            We are dedicated to providing <strong>high-quality supplements</strong>
            that support fitness, health, and overall well-being. Our products are
            carefully sourced to ensure safety, purity, and performance.
          </p>

          <p className="about-text">
            Our goal is to help individuals at every level of their fitness journey
            — from beginners to professionals — achieve better results with
            trusted nutrition.
          </p>

          {/* Mission */}
          <h2 className="about-subtitle">🎯 Our Mission</h2>
          <p className="about-text">
            To empower people to live healthier and stronger lives by offering
            authentic supplements backed by science, quality testing, and customer
            trust.
          </p>

          {/* Quality */}
          <h2 className="about-subtitle">✅ Quality You Can Trust</h2>
          <p className="about-text">
            Every product we offer goes through strict quality checks and is
            sourced from reliable brands. We believe that what you put into your
            body matters.
          </p>

          {/* Customers */}
          <h2 className="about-subtitle">🤝 Customer First</h2>
          <p className="about-text">
            Customer satisfaction is at the heart of everything we do. We aim to
            provide transparent information, genuine products, and dependable
            service.
          </p>

          {/* Location */}
          <div className="about-location">
            📍 <span>Address:</span><br />
            Babaji Basa, opposite Dr. Meghnath Saha Institute of Technology,<br />
            near Ambuja City Centre Mall,<br />
            Bhabanipur, Haldia,<br />
            West Bengal – 721657
          </div>

          <div className="about-highlight">
            💪 Fuel Your Body. Build Your Strength.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UnderConstruction;
