import React from "react";
import "./Header.css";
import { FaSearch, FaMoon, FaSun, FaWhatsapp } from "react-icons/fa";

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="header-container">
      {/* Left: Logo Image */}
      <div className="header-left">
        <img src="/logo.jpg" alt="SS Supplement Logo" className="logo-image" />
      </div>

      {/* Center: Nav links */}
      <div className="header-center">
        <nav className="nav-links">
          <a href="/UnderConstruction">About</a>
          <a href="/UnderConstruction">Products</a>
          <a href="/UnderConstruction">Product Details</a>
          <a href="/UnderConstruction">Contact Us</a>
          <a href="/UnderConstruction" className="whatsapp-link">
            <FaWhatsapp className="whatsapp-icon" />
          </a>
        </nav>
      </div>

      {/* Right: Search + Theme */}
      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
        </div>

        <div className="theme-btn-desktop">
          <button className="theme-btn" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
          </button>
        </div>

        <div className="theme-btn-mobile">
          <button className="theme-btn" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
