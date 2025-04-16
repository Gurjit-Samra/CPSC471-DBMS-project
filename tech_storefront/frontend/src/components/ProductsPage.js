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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Dummy product data (replace with API fetch)
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Laptop Pro 15",
    price: 1499.99,
    description: "A powerful laptop for professionals.",
    image: "/static/images/laptop/laptop1.png",
  },
  {
    id: 2,
    name: "Smartphone X",
    price: 899.99,
    description: "The latest smartphone with amazing features.",
    image: "/static/phone.jpg",
  },
  {
    id: 3,
    name: "Ultra HD TV",
    price: 1199.99,
    description: "Crystal clear 4K Ultra HD television.",
    image: "/static/tv.jpg",
  },
  // ...add more products as needed
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Simulate fetching products from API
  useEffect(() => {
    // TODO: Replace with actual API call
    setProducts(DUMMY_PRODUCTS);
    // Fetch current user info from backend
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
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
                      {user.street_address}, {user.city}, {user.state}, {user.country}
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
            <IconButton color="primary" sx={{ ml: 2 }}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Products Grid */}
      <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, mt: 2 }}>
          Shop Products
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "25px",
                  boxShadow: "0 2px 12px rgba(60,72,88,0.07)",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "contain", p: 2, background: "#f5f7fa" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 700 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 800 }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
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
    </Box>
  );
}
