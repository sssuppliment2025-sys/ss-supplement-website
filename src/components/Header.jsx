import React from "react";
import "./Header.css";


const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <h2 className="logo">Jamai Da Hotel</h2>
      </div>

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

        {/* Theme Toggle */}
        <button className="theme-btn">
          <span className="moon-icon">🌙</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
