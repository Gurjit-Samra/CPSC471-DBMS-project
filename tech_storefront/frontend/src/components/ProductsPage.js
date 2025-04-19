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
import Autocomplete from "@mui/material/Autocomplete";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
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
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    fetch(`/api/products/?${params.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]); // fallback
      });
  }, [search]);

  // Searching from the backend
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    fetch(`/api/products/suggestions/?q=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch(() => setSuggestions([]));
  }, [search]);

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

  const handleAddToCart = async (product) => {
    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch("/api/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken, // Include CSRF token
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          user_email: user.email,
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1, // Default quantity is 1
        }),
      });
  
      if (response.ok) {
        const updatedCartItem = await response.json();
        setCart((prev) => {
          const existingItem = prev.find((item) => item.product_id === updatedCartItem.product_id);
          if (existingItem) {
            return prev.map((item) =>
              item.product_id === updatedCartItem.product_id ? updatedCartItem : item
            );
          } else {
            return [...prev, updatedCartItem];
          }
        });
      }
      handleCartOpen();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const handleRemoveFromCart = async (productId) => {
    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch("/api/cart/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken, // Include CSRF token
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({ 
          user_email: user.email,
          product_id: productId 
        }),
      });
  
      if (response.ok) {
        setCart((prev) => prev.filter((item) => item.product_id !== productId));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          background: "rgba(255,255,255,0.5)",
          borderBottom: "1.5px solid rgb(237, 237, 237, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: 1,
          minHeight: 56,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 10,
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
            sx={{ width: 36, height: 36, mr: 2 }}
          />
          <Typography
            variant="h6"
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
          pt: { xs: "64px", md: "93px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            px: { xs: 2, sm: 3, md: 4 },
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Autocomplete
              freeSolo
              options={suggestions}
              inputValue={search}
              onInputChange={(event, newInputValue) => setSearch(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search products..."
                  variant="outlined"
                  sx={{
                    width: 400,
                    background: "#fff",
                    borderRadius: "999px",
                    "& fieldset": { borderRadius: "999px" },
                  }}
                  size="medium"
                />
              )}
              slotProps={{
                paper: {
                  sx: { borderRadius: 5, boxShadow: 8 },
                },
              }}
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
                    flex: 1,
                    maxWidth: 345,
                    borderRadius: 7,
                    border: "1.5px solid #e0e0e0",
                    boxShadow: "none",
                    background: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
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
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
