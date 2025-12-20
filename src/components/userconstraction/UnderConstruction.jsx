import React from "react";
import Layout from "../Layout";
import "./UnderConstruction.css";

const UnderConstruction = () => {
  return (
    <div className="construction-page-container">
      <div className="construction-content-wrapper">
        <img
          src="/ConstractionPic.webp"
          alt="Construction Worker"
          className="construction-worker-logo"
        />
        <a href="/" className="cta-button construction-back-button">
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default UnderConstruction;
