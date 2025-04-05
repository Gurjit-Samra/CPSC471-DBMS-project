import React, { Component } from "react";
import ProductsPage from "./ProductsPage";
import CustomerRegistrationPage from "./CustomerRegistrationPage";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<p>This is the home page</p>} />
          <Route path="/customer-registration" element={<CustomerRegistrationPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>    
      </Router>
    );
  }
}