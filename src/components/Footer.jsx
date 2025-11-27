import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="jd-footer">
      <div className="jd-footer-container">
        {/* Left column – About */}
        <div className="jd-footer-col jd-footer-about">
          <h2 className="jd-footer-title">Jamai Da Hotel</h2>
          <p className="jd-footer-text">
            Authentic Indian cuisine crafted with love and the finest spices.
            Experience the rich flavors and traditions of India in every dish.
          </p>
        </div>

        {/* Middle column – Contact */}
        <div className="jd-footer-col">
          <h3 className="jd-footer-heading">Contact Us</h3>
          <div className="jd-footer-row">
            <span className="jd-footer-icon">📞</span>
            <a href="tel:+919641442589" className="jd-footer-link">
              +91 9641442589
            </a>
          </div>
          <div className="jd-footer-row">
            <span className="jd-footer-icon">📍</span>
            <span className="jd-footer-text">
              Khudiram Nagar, Haldia
            </span>
          </div>
        </div>

        {/* Right column – Business Hours */}
        <div className="jd-footer-col">
          <h3 className="jd-footer-heading">Business Hours</h3>
          <div className="jd-footer-row">
            <span className="jd-footer-icon">⏰</span>
            <div>
              <div className="jd-footer-text">Monday - Sunday</div>
              <div className="jd-footer-subtext">7:00 AM - 11:30 PM</div>
            </div>
          </div>
        </div>
      </div>

      <hr className="jd-footer-divider" />

      <div className="jd-footer-bottom">
        <p className="jd-footer-copy">
          © {currentYear} Jamai Da Hotel. All rights reserved.
        </p>
        <div className="jd-footer-dev">
          <span>Developed by&nbsp;</span>
          <span className="jd-footer-dev-logo">◎</span>
          <span className="jd-footer-dev-name">ULMiND</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
