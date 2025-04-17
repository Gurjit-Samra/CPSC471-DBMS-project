import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LandingPage from "./LandingPage";
import ProductsPage from "./ProductsPage";
import SignInPage from "./SignInPage"
import CustomerRegistrationPage from "./CustomerRegistrationPage";
import ProductDetailsPage from "./ProductDetailsPage";
import AdminSignInPage from "./AdminSignInPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/customer-registration" element={<CustomerRegistrationPage />} />
          <Route path="/products/:type/:id" element={<ProductDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);