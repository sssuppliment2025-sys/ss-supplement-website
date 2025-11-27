import React from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header-container">
      {/* Left Section */}
      <div className="header-left">
        <h2 className="logo">SS Supplement</h2>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Search Box */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            className="search-input"
          />
        </div>

        {/* Theme button for Desktop / Laptop */}
        <div className="theme-btn-desktop">
          <button className="theme-btn">
            <span className="moon-icon">🌙</span>
          </button>
        </div>

        {/* Theme button for Mobile */}
        <div className="theme-btn-mobile">
          <button className="theme-btn">
            <span className="moon-icon">🌙</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
