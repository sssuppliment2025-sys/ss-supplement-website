import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import UnderConstruction from "./components/userconstraction/UnderConstruction.jsx";
import { CategoryPage, ProductImageManager } from "./products";
import OptimumNutration from "./products/ProductsDetailsPages/OptimumNutration.jsx";
import Layout from "./components/Layout";
import AddressPage from "./components/AddressPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import Cart from "./pages/Cart.jsx";

function MainApp() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/UnderConstruction" element={<UnderConstruction />} />
          <Route path="/products/:slug" element={<CategoryPage />} />
          <Route path="/admin/images" element={<ProductImageManager />} />
          <Route
            path="/Product"
            element={
              <Layout>
                <OptimumNutration />
              </Layout>
            }
          />
          <Route path="/AddressPage" element={<AddressPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<MainApp />);
