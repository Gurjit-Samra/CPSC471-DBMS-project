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
import Link from "@mui/material/Link"; // Add this import
import { useAuth } from "./AuthContext";
import TextField from "@mui/material/TextField";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [search, setSearch] = useState("");

  const TYPE_DISPLAY_NAMES = {
    laptop: "Laptops",
    phone: "Phones",
    tv: "TVs",
    pc: "PCs",
    video_game: "Video Games",
    console: "Consoles",
    accessory: "Accessories",
    all: "All",
  };

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

  // Get unique categories from products
  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((p) => p.category || p.type || "Other"))
    ),
  ];

  // Filter products by category
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => (p.category || p.type) === filter);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
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
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 0,
          py: { xs: 2, md: 4 },
          width: "100vw",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              variant="outlined"
              sx={{
                width: 400,
                background: "#fff",
                borderRadius: "999px",
                "& fieldset": { borderRadius: "999px" }, // round the outline
              }}
              size="medium"
            />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Shop Products
          </Typography>

          {/* Category Filter Buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "contained" : "outlined"}
                onClick={() => setFilter(cat)}
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
                {TYPE_DISPLAY_NAMES[cat] || cat}
              </Button>
            ))}
          </Stack>

          <Grid
            container
            spacing={4}
            alignItems="stretch"
            sx={{ margin: 0, width: "100%" }}
          >
            {filteredProducts.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${product.type}${product.id}`} //  unique key
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
                    boxShadow: "none",
                  }}
                >
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/products/${product.type}/${product.id}`)
                    }
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
                        background: "#ffffff",
                        p: 0,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Link
                      component={RouterLink}
                      to={`/products/${product.type}/${product.id}`}
                      underline="hover"
                      sx={{
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        color: "inherit",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        mb: 1,
                        display: "inline-block",
                      }}
                    >
                      {product.name}
                    </Link>

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
      </Box>

      {/* cart drawer/modal */}
      <ShoppingCart cart={cart} open={cartOpen} onClose={handleCartClose} />
    </Box>
  );
}
