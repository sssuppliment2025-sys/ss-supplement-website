import React from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";   

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <h2 className="logo">Jamai Da Hotel</h2>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            className="search-input"
          />
        </div>

        <button className="theme-btn">
          <span className="moon-icon">🌙</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
