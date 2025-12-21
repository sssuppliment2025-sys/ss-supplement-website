import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import App from "./App.jsx";
import UnderConstruction from "./components/userconstraction/UnderConstruction.jsx";
import { CategoryPage, ProductImageManager } from "./products";
import OptimumNutration from "./products/ProductsDetailsPages/OptimumNutration.jsx";
import Layout from "./components/Layout";



function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/UnderConstruction" element={<UnderConstruction />} />
        <Route path="/products/:slug" element={<CategoryPage />} />
        <Route path="/admin/images" element={<ProductImageManager />} />
        <Route path="/Product" element={ <Layout> <OptimumNutration /> </Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<MainApp />);
