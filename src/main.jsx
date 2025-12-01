import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import App from "./App.jsx";
import UnderConstruction from "./components/userconstraction/UnderConstruction.jsx";



function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/UnderConstruction" element={<UnderConstruction />} />
        
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<MainApp />);
