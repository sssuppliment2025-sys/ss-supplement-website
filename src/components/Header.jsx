import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaSearch, FaMoon, FaSun, FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { getAllProducts } from "../products";

const Header = ({ darkMode, toggleDarkMode }) => {
  const headerRef = useRef(null);
  // Add sticky shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 10) {
        headerRef.current.classList.add('sticky');
      } else {
        headerRef.current.classList.remove('sticky');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  // Initialize with actual window width check
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 600;
    }
    return false;
  });

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 600;
      setIsMobile(mobile);
      // Close menu when switching to desktop
      if (!mobile && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Check immediately
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      const allProducts = getAllProducts();
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.flavors?.toLowerCase().includes(query.toLowerCase()) ||
        product.weight?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Limit to 8 results
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to the first matching product's category
      const firstResult = searchResults[0];
      if (firstResult.categorySlug) {
        navigate(`/products/${firstResult.categorySlug}?highlight=${firstResult.id}`);
      }
      setShowResults(false);
      setSearchQuery("");
      closeMenu();
    }
  };

  const handleProductClick = (product) => {
    // Navigate to the category page with the product highlighted
    if (product.categorySlug) {
      navigate(`/products/${product.categorySlug}?highlight=${product.id}`);
    }
    setShowResults(false);
    setSearchQuery("");
    closeMenu();
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="header-container" ref={headerRef}>
        {/* Left: Logo */}
        <div className="header-left">
          <Link to="/">
            <img src="/logo.jpg" alt="SS Supplement Logo" className="logo-image" />
          </Link>
        </div>

        {/* Center: Desktop Navigation - Only render on desktop */}
        {!isMobile && (
          <div className="header-center">
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/UnderConstruction">About</Link>
              <Link to="/UnderConstruction">Contact Us</Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                <FaWhatsapp className="whatsapp-icon" />
              </a>
            </nav>
          </div>
        )}

        {/* Right: Search + Theme/Hamburger */}
        <div className="header-right">
          <div className="search-box" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <FaSearch className="search-icon" onClick={handleSearchSubmit} />
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
              />
            </form>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="search-result-info">
                      <span className="search-result-name">{product.name}</span>
                      <span className="search-result-details">
                        {product.weight} • ₹{product.price} • {product.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="search-results-dropdown">
                <div className="search-no-results">
                  No products found for "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Theme Toggle */}
          {!isMobile && (
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
          )}

          {/* Mobile: Hamburger Button - Only render on mobile */}
          {isMobile && (
            <button className="hamburger-btn" onClick={toggleMenu} aria-label="Menu">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu - Only render on mobile */}
      {isMobile && (
        <>
          {/* Overlay - only show when menu is open */}
          {menuOpen && (
            <div className="mobile-menu-overlay" onClick={closeMenu}></div>
          )}

          {/* Slide-in Menu */}
          <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button className="close-menu-btn" onClick={closeMenu} aria-label="Close menu">
                <span className="close-x">✕</span>
              </button>
            </div>

            <div className="mobile-menu-links">
              <Link to="/" onClick={closeMenu}>🏠 Home</Link>
              <Link to="/UnderConstruction" onClick={closeMenu}>ℹ️ About</Link>
              <Link to="/UnderConstruction" onClick={closeMenu}>📞 Contact Us</Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                <FaWhatsapp className="whatsapp-icon" /> WhatsApp
              </a>
            </div>

            <div className="mobile-menu-theme">
              <span>Theme</span>
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
          </nav>
        </>
      )}
    </>
  );
};

export default Header;