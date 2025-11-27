import "./index.css";
import React, { useEffect, useState } from "react";
import App from "./App.jsx";
import Header from "./components/Header.jsx";



function MainApp() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <LanguageProvider>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/Header" element={<Header />} />
            
          </Routes>
        </UserContextProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<MainApp />);