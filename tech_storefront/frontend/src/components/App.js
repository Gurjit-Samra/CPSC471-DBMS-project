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
import CheckoutPage from "./CheckoutPage";
import OrderSuccessPage from "./OrderSuccessPage";
import CartPage from "./CartPage";
import MyOrdersPage from "./MyOrdersPage";
import MyOrderDetailPage from "./MyOrderDetailPage";
import AdminDashboardPage from "./AdminDashboardPage";

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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/my-orders/:orderId" element={<MyOrderDetailPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}