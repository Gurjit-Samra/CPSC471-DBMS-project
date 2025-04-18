import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCart from "./ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "./AuthContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const TYPE_DISPLAY_NAMES = {
  L: "Laptop",
  P: "Phone",
  TV: "TV",
  PC: "PC",
  VG: "Video Game",
  C: "Console",
  A: "Accessory",
  laptop: "Laptop",
  phone: "Phone",
  tv: "TV",
  pc: "PC",
  vg: "Video Game",
  c: "Console",
  a: "Accessory",
};

export default function ProductDetailsPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    fetch(`/api/products/${type}/${id}/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type, id]);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  // Menu open/close handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Helper function to get CSRF token
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

  // approximate height of your header box (adjust if needed)
  const HEADER_HEIGHT = 62;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundImage: 'url("/static/hero.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <Box
        sx={{
            width: "auto",
            background: "rgba(255,255,255,1)",
            border: "1.5px solid #e0e0e0",
            borderRadius: "10px 10px 30px 30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
            px: { xs: 2, md: 3 },
            mt: 2,
            mx: { xs: 1, md: 2 },
            maxWidth: "calc(100vw - 16px)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: 6,
            position: "sticky",
            top: 0,
            zIndex: 10,
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
                      px: 2,
                      py: 1,
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
            <IconButton color="primary" sx={{ ml: 2 }} onClick={handleCartOpen}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Product Details Section */}
      <Box
        sx={{
          flex: 1,
          mt: `${HEADER_HEIGHT}px`,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 0,
          py: { xs: 2, md: 4 },
          width: "100vw",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{ mb: 2, borderRadius: "999px", fontWeight: 600 }}
            onClick={() => navigate("/products")}
          >
            Back to Products
          </Button>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress />
            </Box>
          ) : product ? (
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                borderRadius: 7,
                border: "1.5px solid #e0e0e0",
                boxShadow: "none",
                p: 3,
                alignItems: "center",
                background: "#fff",
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  width: { xs: "100%", md: 340 },
                  height: 280,
                  objectFit: "contain", // fill and crop
                  transition: "transform 0.3s cubic-bezier(.4,2,.6,1)", // smooth zoom
                  "&:hover": {
                    transform: "scale(1.05)", // zoom out slightly on hover
                    zIndex: 1,
                  },
                  background: "#ffffff",
                  p: 0,
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  ${Number(product.price).toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "#607d8b" }}>
                  Category: {TYPE_DISPLAY_NAMES[product.type] || product.type}
                </Typography>

                {/* Additional attributes */}
                {product.brand && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Brand: {product.brand}
                  </Typography>
                )}
                {product.screen_size && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Screen Size: {product.screen_size} inches
                  </Typography>
                )}
                {product.resolution && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Resolution: {product.resolution}
                  </Typography>
                )}
                {product.ram && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    RAM: {product.ram} GB
                  </Typography>
                )}
                {product.graphics_card && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Graphics Card: {product.graphics_card}
                  </Typography>
                )}
                {product.proccessor && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Processor: {product.proccessor}
                  </Typography>
                )}
                {product.age_rating && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Age Rating: {product.age_rating}
                  </Typography>
                )}
                {product.genre && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Genre: {product.genre}
                  </Typography>
                )}

                <Button
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
                    mt: 2,
                  }}
                  onClick={() => {
                    if (user) {
                      handleAddToCart(product);
                    } else {
                      navigate("/sign-in");
                    }
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Typography color="error" sx={{ mt: 8 }}>
              Product not found.
            </Typography>
          )}
        </Box>
      </Box>
      <ShoppingCart cart={cart} open={cartOpen} onClose={handleCartClose} />
    </Box>
  );
}
