import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LandingPage from "./LandingPage";
import ProductsPage from "./ProductsPage";
import SignInPage from "./SignInPage";
import CustomerRegistrationPage from "./CustomerRegistrationPage";
import ProductDetailsPage from "./ProductDetailsPage";
import WriteReviewPage from "./WriteReviewPage"
import WishlistPage from "./WishlistPage";


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
          <Route path="/products/:type/:id/write-review" element={<WriteReviewPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}