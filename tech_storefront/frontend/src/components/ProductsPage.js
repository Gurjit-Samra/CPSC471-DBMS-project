import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Badge,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCart from "./ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // approximate height of your header box (adjust if needed)
  const HEADER_HEIGHT = 62;

  // fetch product data from backend
  useEffect(() => {
    fetch("/api/products/", {
      credentials: "include", // for session/csrf
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]); // fallback
      });
  }, []);

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

  return (
    <Box
      sx={{
        height: "100vh", // fill viewport
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // hide overflow on outer container
        backgroundImage: 'url("/static/hero.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* fixed header */}
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
            {/* Cart Icon */}
            <IconButton color="primary" sx={{ ml: 2 }} onClick={handleCartOpen}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* scrollable products area */}
      <Box
        sx={{
          flex: 1,
          mt: `${HEADER_HEIGHT}px`, // push below the fixed header
          overflowY: "auto", // enable vertical scrolling
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Shop Products
        </Typography>
        <Grid
          container
          spacing={4}
          alignItems="stretch" // stretch items to equal height
        >
          {products.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={product.id}
              sx={{ display: "flex" }} // make each cell a flex container
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1, // fill the grid‐cell
                  maxWidth: 345, // fixed card width
                  borderRadius: 7,
                  border: "1.5px solid #e0e0e0",
                  boxShadow: 'none',

                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "contain", // fill and crop
                    transition: "transform 0.3s cubic-bezier(.4,2,.6,1)", // smooth zoom
                    "&:hover": {
                      transform: "scale(1.05)", // zoom out slightly on hover
                      zIndex: 1,
                    },
                    cursor: "pointer",
                    background: "#ffffff",
                    p: 0,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      whiteSpace: "normal", // allow wrapping
                      wordBreak: "break-word", // break long words
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 800 }}
                  >
                    ${Number(product.price).toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: "auto" }}>
                  <Button
                    fullWidth
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
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* cart drawer/modal */}
      <ShoppingCart cart={cart} open={cartOpen} onClose={handleCartClose} />
    </Box>
  );
}
