import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAuth } from "./AuthContext";

export default function LandingPage() {
  const { user, setUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const getCookie = (name) => {
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
  };

  // Menu open/close handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Sign out handler
  const handleSignOut = async () => {
    const csrftoken = getCookie("csrftoken");
    await fetch("/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
    });
    setUser(null);
    handleMenuClose();
    navigate("/"); // Redirect to landing page
  };

  return (
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
      {/* Header with Cart and User */}
      <Box
        sx={{
          width: "auto",
          background: "rgba(255,255,255,1)",
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
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
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
          <RouterLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
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
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, letterSpacing: 0, color: "black" }}
            >
              FGG Tech
            </Typography>
          </RouterLink>
          <Stack direction="row" spacing={2} alignItems="center">
            {!user && (
              <>
                <Button
                  component={RouterLink}
                  to="/sign-in"
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/customer-registration"
                  variant="contained"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
                >
                  Create Account
                </Button>
              </>
            )}
            {/* User Icon, Name, and Menu */}
            {user && (
              <>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton onClick={handleMenuOpen}>
                    <AccountCircleIcon color="primary" fontSize="large" />
                  </IconButton>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.email}
                  </Typography>
                </Stack>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      boxShadow: "0 4px 24px rgba(60,72,88,0.15)",
                      minWidth: 220,
                      p: 1,
                    },
                  }}
                >
                  <MenuItem
                    sx={{
                      borderRadius: 3,
                      pointerEvents: "none",
                      backgroundColor: "transparent !important",
                      px: 2, // horizontal padding
                      py: 1, // vertical padding
                    }}
                  >
                    <Typography variant="subtitle2">{user.email}</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    sx={{
                      borderRadius: 3,
                      pointerEvents: "none",
                      backgroundColor: "transparent !important",
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {user.street_address}, {user.city}, {user.state},{" "}
                      {user.country}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleSignOut}
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      "&:hover": { backgroundColor: "#f0f4fa" },
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                  >
                    <Typography color="error">Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 700,
            width: "100%",
            textAlign: "center",
            py: { xs: 6, md: 10 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              color: "#263238",
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              letterSpacing: "-1px",
            }}
          >
            Welcome to FGG Tech
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: "#546e7a",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}
          >
            Discover the latest laptops, phones, and electronics. Shop smarter,
            faster, and easier.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              size="large"
              color="primary"
              sx={{
                fontWeight: 700,
                px: 5,
                fontSize: "1.1rem",
                borderRadius: "999px",
                boxShadow: "none",
                // Custom hover effect:
                "&:hover": {
                  backgroundColor: "1875D2",
                  boxShadow: "none",
                },
              }}
            >
              Shop Now
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Admin Sign In Button */}
      <Fab
        component="a"
        href="/admin/"
        color="secondary"
        size="small"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
        aria-label="Admin Sign In"
      >
        <AdminPanelSettingsIcon />
      </Fab>
    </Box>
  );
}
