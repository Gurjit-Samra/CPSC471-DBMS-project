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

function isValidPostalCode(code) {
  // Canadian postal code regex (simple)
  return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code.trim());
}

function isValidPhone(phone) {
  // Simple North American phone validation
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    province: "",
    phone: "",
    useAsBilling: true,
  });
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
  const shipping = 19.95; // Example static shipping

  // Get selected province's tax rate, default to 0.13 (Ontario) if not selected
  const selectedProvince =
    provinces.find((prov) => prov.name === form.province) || provinces[6];
  const taxRate = selectedProvince.tax;
  const tax = Math.round(merchandise * taxRate * 100) / 100;
  const total = merchandise + shipping + tax;

  // Validation for enabling Next button
  const isFormValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.address.trim() &&
    form.postalCode.trim() &&
    isValidPostalCode(form.postalCode) &&
    form.city.trim() &&
    form.province &&
    form.phone.trim() &&
    isValidPhone(form.phone);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

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
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Street Address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Apt, suite, etc."
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Postal Code"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!form.postalCode && !isValidPostalCode(form.postalCode)}
                      helperText={
                        !!form.postalCode && !isValidPostalCode(form.postalCode)
                          ? "Invalid postal code"
                          : ""
                      }
                    />
                    <TextField
                      label="Town/City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      select
                      label="Province"
                      name="province"
                      value={form.province}
                      onChange={handleChange}
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
                      value={form.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!form.phone && !isValidPhone(form.phone)}
                      helperText={
                        !!form.phone && !isValidPhone(form.phone)
                          ? "Enter 10 digit phone number"
                          : ""
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.useAsBilling}
                          onChange={handleChange}
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
                  disabled={!isFormValid}
                >
                  Next
                </Button>
              </>
            )}
            {/* Step 2: Payment and Billing */}
            {activeStep === 1 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment and Billing (Placeholder)
                </Typography>
                {/* ...Payment form fields here... */}
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
                  Review and Place Order (Placeholder)
                </Typography>
                {/* ...Review order details here... */}
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
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    {item.brand ? item.brand : ""}{" "}
                    {item.size ? `No Size` : ""}
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
                C${shipping.toFixed(2)}
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