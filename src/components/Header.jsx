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
          <button className="theme-toggle" onClick={toggleDarkMode}>
            <div className={`toggle-track ${darkMode ? 'dark' : 'light'}`}>
              <div className="toggle-slider">
                {darkMode ? <FaMoon className="toggle-icon" /> : <FaSun className="toggle-icon" />}
              </div>
              <div className="toggle-background">
                {darkMode ? (
                  <>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                  </>
                ) : (
                  <>
                    <span className="cloud cloud-1"></span>
                    <span className="cloud cloud-2"></span>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>

        <div className="theme-btn-mobile">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            <div className={`toggle-track ${darkMode ? 'dark' : 'light'}`}>
              <div className="toggle-slider">
                {darkMode ? <FaMoon className="toggle-icon" /> : <FaSun className="toggle-icon" />}
              </div>
              <div className="toggle-background">
                {darkMode ? (
                  <>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                  </>
                ) : (
                  <>
                    <span className="cloud cloud-1"></span>
                    <span className="cloud cloud-2"></span>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
