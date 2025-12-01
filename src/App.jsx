import React from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Body from "./components/Body.jsx";
const productCategories = [
  "Protein Wafer Bar",
  "100% Performance Whey",
  "Fuel Whey",
  "Whey Protein",
  "Isorich Protein",
  "Creatine Monohydrate",
  "Nitro Iso Whey", // ← your line was broken, now fixed
  "Alpha Whey",
  "Muscle Gainer",
  "Mass Gainer",
  "Accessories"
];

const App = () => {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
};

export default App;
