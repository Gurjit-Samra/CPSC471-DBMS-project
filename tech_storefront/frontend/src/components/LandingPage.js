import React from "react";
import { Box, Button, Typography, Stack, Fab } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(120deg, #e3eafc 0%, #f5f7fa 100%)",
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
              component={RouterLink}
              to="/sign-in"
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
              component={RouterLink}
              to="/customer-registration"
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
            Discover the latest laptops, phones, and electronics. Shop smarter, faster, and easier.
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
        component={RouterLink}
        to="/admin-sign-in"
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