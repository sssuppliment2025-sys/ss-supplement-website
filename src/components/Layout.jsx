import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <div className="app-layout">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
