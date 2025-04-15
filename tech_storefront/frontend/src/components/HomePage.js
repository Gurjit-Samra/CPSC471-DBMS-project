import React, { Component } from "react";
import ProductsPage from "./ProductsPage";
import CustomerRegistrationPage from "./CustomerRegistrationPage";
import SignInPage from "./SignInPage";
import LandingPage from "./LandingPage";
import AdminSignInPage from "./AdminSignInPage";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/customer-registration" element={<CustomerRegistrationPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/admin-sign-in" element={<AdminSignInPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>    
      </Router>
    );
  }
}