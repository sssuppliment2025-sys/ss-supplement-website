import React from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header-container">
      {/* Left: Logo */}
      <div className="header-left">
        <h2 className="logo">SS Supplement</h2>
      </div>

      {/* Center: Nav links */}
      <div className="header-center">
        <nav className="nav-links">
          <a href="/UnderConstruction">About</a>
          <a href="/UnderConstruction">Products</a>
          <a href="/UnderConstruction">Product Details</a>
          <a href="/UnderConstruction">Contact Us</a>
          <a href="/UnderConstruction">Connect Us</a>
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
          <button className="theme-btn">
            <span className="moon-icon">🌙</span>
          </button>
        </div>

        <div className="theme-btn-mobile">
          {/* Mobile theme button, if you want:
          <button className="theme-btn">
            <span className="moon-icon">🌙</span>
          </button> 
          */}
        </div>
      </div>
    </header>
  );
};

export default Header;
