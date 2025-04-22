import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Divider,
  Link,
  Avatar,
  Stack,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// Provinces with tax rates (2024, GST+PST/HST)
const provinces = [
  { name: "Alberta", tax: 0.05 },
  { name: "British Columbia", tax: 0.12 },
  { name: "Manitoba", tax: 0.12 },
  { name: "New Brunswick", tax: 0.15 },
  { name: "Newfoundland and Labrador", tax: 0.15 },
  { name: "Nova Scotia", tax: 0.15 },
  { name: "Ontario", tax: 0.13 },
  { name: "Prince Edward Island", tax: 0.15 },
  { name: "Quebec", tax: 0.14975 },
  { name: "Saskatchewan", tax: 0.11 },
];

const steps = [
  "Shipping and Gift Options",
  "Payment and Billing",
  "Review and Place Order",
];

// Quick validations
function isValidPostalCode(code) {
  // Canadian postal code regex (simple)
  return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code.trim());
}
function isValidPhone(phone) {
  // Simple NA phone validation
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
}

// CSRF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  // Shipping
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    province: "",
    phone: "",
  });
  // Billing
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    province: "",
    phone: "",
  });
  const [useAsBilling, setUseAsBilling] = useState(true);

  // Payment placeholder
  const [paymentMethod] = useState("credit"); // or "paypal" etc

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Fetch cart items on mount
  useEffect(() => {
    fetch("/api/cart/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  // Calculate totals
  const merchandise = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shippingCost = 19.95; // Example static shipping
  // Get selected province's tax rate, default to Ontario (0.13) if not found
  const selectedProvince =
    provinces.find((prov) => prov.name === shipping.province) || provinces[6];
  const taxRate = selectedProvince.tax;
  const tax = Math.round(merchandise * taxRate * 100) / 100;
  const total = merchandise + shippingCost + tax;

  // Validation check for Step 1
  const isShippingValid =
    shipping.firstName.trim() &&
    shipping.lastName.trim() &&
    shipping.address.trim() &&
    shipping.postalCode.trim() &&
    isValidPostalCode(shipping.postalCode) &&
    shipping.city.trim() &&
    shipping.province &&
    shipping.phone.trim() &&
    isValidPhone(shipping.phone);

  // Validation check for Step 2
  // For payment and billing, if we are copying shipping → billing, we skip these checks:
  const isBillingValid = useAsBilling
    ? true
    : // If not using shipping data, require user fill out billing
      billing.firstName.trim() &&
      billing.lastName.trim() &&
      billing.address.trim() &&
      billing.postalCode.trim() &&
      isValidPostalCode(billing.postalCode) &&
      billing.city.trim() &&
      billing.province &&
      billing.phone.trim() &&
      isValidPhone(billing.phone);

  // Handler for shipping changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };
  // Handler for billing changes
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  // If user toggles "Use as billing", copy shipping → billing
  const handleUseAsBilling = (e) => {
    const checked = e.target.checked;
    setUseAsBilling(checked);
    if (checked) {
      // Copy shipping to billing
      setBilling({ ...shipping });
    }
  };

  // Whenever shipping changes *and* useAsBilling is true, recopy
  useEffect(() => {
    if (useAsBilling) {
      setBilling({ ...shipping });
    }
  }, [shipping, useAsBilling]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handlePlaceOrder = async () => {
    // Actually POST to /api/order/ with shipping/billing info
    try {
      const csrftoken = getCookie("csrftoken");
      // Build data for request
      const data = {
        shipping_first_name: shipping.firstName,
        shipping_last_name: shipping.lastName,
        shipping_address: shipping.address,
        shipping_address2: shipping.address2,
        shipping_city: shipping.city,
        shipping_state: "", // if you keep state separate from province
        shipping_province: shipping.province,
        shipping_postal_code: shipping.postalCode,
        shipping_phone: shipping.phone,

        billing_first_name: billing.firstName,
        billing_last_name: billing.lastName,
        billing_address: billing.address,
        billing_address2: billing.address2,
        billing_city: billing.city,
        billing_state: "",
        billing_province: billing.province,
        billing_postal_code: billing.postalCode,
        billing_phone: billing.phone,

        // payment placeholders if needed
        // card_number: ...
      };

      const resp = await fetch("/api/order/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      });
      if (!resp.ok) {
        const errData = await resp.json();
        alert("Error placing order: " + (errData.error || "Unknown error"));
        return;
      }
      // If successful, we can navigate to a success page or show a message
      const orderData = await resp.json();
      navigate(`/order-success/${orderData.id}`);
    } catch (error) {
      console.error(error);
      alert("Network error placing order.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: "64px", md: "93px" },
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIosNewIcon />}
        sx={{
          position: "absolute",
          top: { xs: 16, md: 32 },
          left: { xs: 16, md: 48 },
          borderRadius: "999px",
          fontWeight: 600,
          zIndex: 20,
          minWidth: 0,
          px: 2,
          py: 1,
        }}
        onClick={() => navigate("/products?cartOpen=true")}
        color="primary"
        variant="outlined"
      >
        Back to Products
      </Button>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Main Checkout Form (Left) */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: { md: 700 }, mr: { md: 4 }, width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Checkout
          </Typography>
          <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {/* Step 1: Shipping */}
            {activeStep === 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Ship To
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={shipping.firstName}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={shipping.lastName}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Street Address"
                      name="address"
                      value={shipping.address}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Apt, suite, etc."
                      name="address2"
                      value={shipping.address2}
                      onChange={handleShippingChange}
                      fullWidth
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Postal Code"
                      name="postalCode"
                      value={shipping.postalCode}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                      error={!!shipping.postalCode && !isValidPostalCode(shipping.postalCode)}
                      helperText={
                        !!shipping.postalCode && !isValidPostalCode(shipping.postalCode)
                          ? "Invalid postal code"
                          : ""
                      }
                    />
                    <TextField
                      label="Town/City"
                      name="city"
                      value={shipping.city}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                    />
                    <TextField
                      select
                      label="Province"
                      name="province"
                      value={shipping.province}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {provinces.map((prov) => (
                        <MenuItem key={prov.name} value={prov.name}>
                          {prov.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={shipping.phone}
                      onChange={handleShippingChange}
                      required
                      fullWidth
                      error={!!shipping.phone && !isValidPhone(shipping.phone)}
                      helperText={
                        !!shipping.phone && !isValidPhone(shipping.phone)
                          ? "Enter 10 digit phone number"
                          : ""
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useAsBilling}
                          onChange={handleUseAsBilling}
                          name="useAsBilling"
                        />
                      }
                      label="Use as billing address"
                      sx={{ ml: 2 }}
                    />
                  </Stack>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 3,
                    fontWeight: 600,
                    borderRadius: "999px",
                    width: 200,
                    alignSelf: "center",
                    display: "block",
                  }}
                  onClick={handleNext}
                  disabled={!isShippingValid}
                >
                  Next
                </Button>
              </>
            )}
            {/* Step 2: Payment and Billing */}
            {activeStep === 1 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment and Billing
                </Typography>
                {/* Payment is a placeholder. But let's show billing if useAsBilling is false */}
                {!useAsBilling && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                      Billing Address
                    </Typography>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="First Name"
                          name="firstName"
                          value={billing.firstName}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                        />
                        <TextField
                          label="Last Name"
                          name="lastName"
                          value={billing.lastName}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                        />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Street Address"
                          name="address"
                          value={billing.address}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                        />
                        <TextField
                          label="Apt, suite, etc."
                          name="address2"
                          value={billing.address2}
                          onChange={handleBillingChange}
                          fullWidth
                        />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Postal Code"
                          name="postalCode"
                          value={billing.postalCode}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                          error={!!billing.postalCode && !isValidPostalCode(billing.postalCode)}
                          helperText={
                            !!billing.postalCode && !isValidPostalCode(billing.postalCode)
                              ? "Invalid postal code"
                              : ""
                          }
                        />
                        <TextField
                          label="Town/City"
                          name="city"
                          value={billing.city}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                        />
                        <TextField
                          select
                          label="Province"
                          name="province"
                          value={billing.province}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                        >
                          <MenuItem value="">Please Select</MenuItem>
                          {provinces.map((prov) => (
                            <MenuItem key={prov.name} value={prov.name}>
                              {prov.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Phone Number"
                          name="phone"
                          value={billing.phone}
                          onChange={handleBillingChange}
                          required
                          fullWidth
                          error={!!billing.phone && !isValidPhone(billing.phone)}
                          helperText={
                            !!billing.phone && !isValidPhone(billing.phone)
                              ? "Enter 10 digit phone number"
                              : ""
                          }
                        />
                      </Stack>
                    </Stack>
                  </>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "999px",
                      width: 120,
                    }}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "999px",
                      width: 120,
                    }}
                    onClick={handleNext}
                    disabled={!isBillingValid}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
            {/* Step 3: Review and Place Order */}
            {activeStep === 2 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Review and Place Order
                </Typography>
                <Typography variant="body1">
                  Shipping to: {shipping.firstName} {shipping.lastName}, {shipping.address},{" "}
                  {shipping.address2 && shipping.address2 + ", "} {shipping.city},{" "}
                  {shipping.province}, {shipping.postalCode}, {shipping.phone}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Billing to: {billing.firstName} {billing.lastName}, {billing.address},{" "}
                  {billing.address2 && billing.address2 + ", "} {billing.city},{" "}
                  {billing.province}, {billing.postalCode}, {billing.phone}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "999px",
                      width: 120,
                    }}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "999px",
                      width: 120,
                    }}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Box>
        {/* Order Summary (Right) */}
        <Box
          sx={{
            width: { xs: "100%", md: 340 },
            minWidth: 260,
            ml: { md: 4 },
            mt: { xs: 4, md: 0 },
            alignSelf: { md: "flex-start" },
            position: { md: "sticky" },
            top: { md: 100 },
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: "#f7f7f7",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}
              </Typography>
              <Button
                component={RouterLink}
                to="/cart"
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                }}
              >
                Edit
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Cart Items List */}
            {cart.map((item) => (
              <Box key={item.object_id + item.product_type} sx={{ display: "flex", mb: 2 }}>
                <Avatar
                  variant="square"
                  src={item.image || "/static/no-image.png"}
                  alt={item.name}
                  sx={{ width: 64, height: 64, mr: 2, borderRadius: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    C${Number(item.price).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    Qty: {item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                C${merchandise.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>Shipping &amp; Handling</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                C${shippingCost.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>Tax ({(taxRate * 100).toFixed(2)}%)</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                C${tax.toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>TOTAL TO PAY</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                C${total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
