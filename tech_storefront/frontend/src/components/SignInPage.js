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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SignInContainer = Stack;

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

export default function SignInPage(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

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
    setServerError(""); // Clear previous errors
    if (!validateInputs()) return;

    const form = event.target;
    const data = {
      email: form.email.value,
      password: form.password.value,
    };

    const csrftoken = getCookie("csrftoken");

    try {
      const response = await fetch("/api/sign-in/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Sign in failed.");
        return;
      }

      // Fetch the current user and update context
      const userRes = await fetch("/api/current-user/", { credentials: "include" });
      const userData = await userRes.json();
      setUser(userData);

      navigate("/products"); // redirect to products page

    } catch (error) {
      setServerError("Network error. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
            minHeight: "100vh",
            width: "100vw",
            backgroundImage: 'url("/static/hero.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
      >
        {/* Header */}
        <Box
          sx={{
            width: "auto",
            background: "rgba(255,255,255,0.95)",
            border: "1.5px solid #e0e0e0",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3, // vertical padding inside the header
            px: { xs: 2, md: 3 }, // horizontal padding inside the header
            mt: 2, // margin-top for space from the top
            mx: { xs: 1, md: 2 }, // margin left/right for space from the sides
            maxWidth: "calc(100vw - 16px)", // prevent overflow on small screens
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1400,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, md: 8 },
            }}
          >
            <RouterLink to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Box
                component="img"
                src="/static/favicon2.ico"
                alt="FGG Tech"
                sx={{
                  width: 50,
                  height: 50,
                  mr: 3,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 0, color: "black" }}>
                FGG Tech
              </Typography>
            </RouterLink>
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/sign-in"
                variant="outlined"
                color="primary"
                sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    // Custom hover effect:
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                href="/customer-registration"
                variant="contained"
                color="primary"
                sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    // Custom hover effect:
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
              >
                Create Account
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Sign In Card */}
        <SignInContainer direction="column" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
          <Card variant="outlined" sx={{ width: { xs: "100%", sm: 450 }, p: 4, m: "auto" }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", textAlign: "center" }}
            >
              Sign in
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
              <Button 
                type="submit" 
                fullWidth variant="contained"
                sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    // Custom hover effect:
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
                >
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
      </Box>
    </>
  );
}