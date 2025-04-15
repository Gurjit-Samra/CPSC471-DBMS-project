import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

const SignInContainer = Stack;

export default function SignInPage(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const validateInputs = () => {
    let isValid = true;
    const email = document.getElementById("signin-email");
    const password = document.getElementById("signin-password");

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validateInputs()) return;

    const form = event.target;
    const data = {
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const response = await fetch("/api/admin-sign-in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Sign in failed.");
        return;
      }

      console.log("User signed in:", result);
    } catch (error) {
      setServerError("Network error. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
        <Card variant="outlined" sx={{ width: { xs: "100%", sm: 450 }, p: 4, m: "auto" }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", textAlign: "center" }}
          >
            Admin Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="signin-email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="signin-email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="signin-password">Password</FormLabel>
              <TextField
                required
                fullWidth
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            {serverError && (
              <Typography color="error" sx={{ textAlign: "center" }}>
                {serverError}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Link href="/customer-registration/" variant="body2">
                Register
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}