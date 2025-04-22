// tech_storefront/frontend/src/components/ProductsPage.js

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
import Link from "@mui/material/Link";
import { useAuth } from "./AuthContext";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

/**
 * Helper to retrieve CSRF token from cookies.
 */
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

export default function ProductsPage() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [search, setSearch] = useState("");

  // State for recommended-or-trending section
  const [recMode, setRecMode] = useState(""); // "recommended" or "trending"
  const [recProducts, setRecProducts] = useState([]);

  // Fetch product data from backend
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

  // Fetch search suggestions from backend
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

  // Fetch recommended-or-trending when the page loads
  useEffect(() => {
    fetch("/api/products/recommend-or-trending/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRecMode(data.mode);
        setRecProducts(data.products);
      })
      .catch((err) => {
        console.error("Error fetching recommended/trending:", err);
      });
  }, []);

  // Fetch wishlist when user is logged in
  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist/", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart/", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // When user logs in, fetch cart and wishlist
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    }
  }, [user]);

  // Add item to cart
  const handleAddToCart = async (product) => {
    if (!user) {
      // If not logged in, prompt
      navigate("/sign-in");
      return;
    }
    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch("/api/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: product.id,
          product_type: product.type,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const updatedCartItem = await response.json();
        setCart((prev) => {
          // If item already in cart, update
          const existingItem = prev.find(
            (item) => item.object_id === updatedCartItem.object_id
          );
          if (existingItem) {
            return prev.map((item) =>
              item.object_id === updatedCartItem.object_id
                ? updatedCartItem
                : item
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

  // Remove item from cart
  const handleRemoveFromCart = async (object_id, product_type) => {
    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch("/api/cart/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({ product_id: object_id, product_type }),
      });
      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (object_id, product_type, newQuantity) => {
    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch("/api/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: object_id,
          product_type,
          quantity: newQuantity,
        }),
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // Open cart drawer
  const handleCartOpen = () => setCartOpen(true);
  // Close cart drawer
  const handleCartClose = () => setCartOpen(false);

  // Move to checkout
  const handleCheckout = () => {
    if (!user) {
      navigate("/sign-in");
    } else {
      navigate("/checkout");
    }
  };

  // Toggle wishlist item
  const handleAddToWishlist = async (product) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    const csrftoken = getCookie("csrftoken");
    const isWishlisted = wishlist.some(
      (item) =>
        item.object_id === product.id && item.product_type === product.type
    );
    try {
      if (isWishlisted) {
        // Remove
        await fetch("/api/wishlist/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          credentials: "include",
          body: JSON.stringify({
            product_id: product.id,
            product_type: product.type,
          }),
        });
        setWishlist((prev) =>
          prev.filter(
            (item) =>
              !(
                item.object_id === product.id &&
                item.product_type === product.type
              )
          )
        );
      } else {
        // Add
        const res = await fetch("/api/wishlist/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          credentials: "include",
          body: JSON.stringify({
            product_id: product.id,
            product_type: product.type,
          }),
        });
        if (res.ok) {
          const newItem = await res.json();
          setWishlist((prev) => [...prev, newItem]);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Sign out
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
    navigate("/");
  };

  // Menu open/close
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Generate categories from all products
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category || p.type || "Other"))),
  ];

  // Filter by category (if user selected a category)
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => (p.category || p.type) === filter);

  // Helper map for display
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
          {user && (
            <>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={handleMenuOpen}>
                  <AccountCircleIcon color="primary" fontSize="large" />
                </IconButton>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user.first_name} {user.last_name}
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
                  component={RouterLink}
                  to="/wishlist"
                  sx={{
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    "&:hover": { backgroundColor: "#f0f4fa" },
                  }}
                >
                  <Typography color="primary">My Wishlist</Typography>
                </MenuItem>

                <MenuItem
                  component={RouterLink}
                  to="/my-orders"
                  sx={{
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    "&:hover": { backgroundColor: "#f0f4fa" },
                  }}
                >
                  <Typography color="primary">My Orders</Typography>
                </MenuItem>

                {(user.is_staff || user.is_superuser) && (
                  <MenuItem
                    component={RouterLink}
                    to="/admin-dashboard"
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      "&:hover": { backgroundColor: "#f0f4fa" },
                    }}
                  >
                    <Typography color="primary">Admin Dashboard</Typography>
                  </MenuItem>
                )}

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

      {/* Main scrollable area */}
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
          {/* Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
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

          {/* If we have a recommended/trending list, show it here */}
          {recMode && recProducts.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {recMode === "recommended"
                  ? "Recommended Products"
                  : "Trending Products"}
              </Typography>
              <Grid container spacing={2}>
                {recProducts.map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={`${item.type}${item.id}`}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 4,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            objectFit: "contain",
                            backgroundColor: "#f5f5f5",
                          }}
                        />
                        {/* (No wishlist button here, but you can add if you want) */}
                      </Box>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(`/products/${item.type}/${item.id}`)
                          }
                        >
                          {item.name}
                        </Typography>

                        {item.percent_discount ? (
                          <Typography variant="h6" color="primary">
                            <span
                              style={{
                                textDecoration: "line-through",
                                marginRight: 8,
                                color: "#888",
                              }}
                            >
                              ${Number(item.price).toFixed(2)}
                            </span>
                            $
                            {(
                              Number(item.price) *
                              (1 - item.percent_discount / 100)
                            ).toFixed(2)}
                          </Typography>
                        ) : (
                          <Typography variant="h6" color="primary">
                            ${Number(item.price).toFixed(2)}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            borderRadius: "999px",
                            textTransform: "none",
                          }}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() =>
                            navigate(`/products/${item.type}/${item.id}`)
                          }
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

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

          {/* Main product grid */}
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
                key={`${product.type}${product.id}`}
                sx={{ display: "flex" }}
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
                    sx={{ cursor: "pointer", position: "relative" }}
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
                        objectFit: "contain",
                        transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
                        "&:hover": {
                          transform: "scale(1.05)",
                          zIndex: 1,
                        },
                        background: "#ffffff",
                        p: 0,
                      }}
                    />
                    <IconButton
                      aria-label="toggle wishlist"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(255,255,255,0.8)",
                        "&:hover": { background: "#ffeaea" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product);
                      }}
                    >
                      {wishlist.some(
                        (item) =>
                          item.object_id === product.id &&
                          item.product_type === product.type
                      ) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon color="error" />
                      )}
                    </IconButton>
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
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {product.percent_discount ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              marginRight: 8,
                            }}
                          >
                            ${Number(product.price).toFixed(2)}
                          </span>
                          $
                          {(
                            Number(product.price) *
                            (1 - product.percent_discount / 100)
                          ).toFixed(2)}
                        </>
                      ) : (
                        `$${Number(product.price).toFixed(2)}`
                      )}
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
                      onClick={() => handleAddToCart(product)}
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

      {/* Cart drawer/modal */}
      <ShoppingCart
        cart={cart}
        open={cartOpen}
        onClose={handleCartClose}
        onUpdateQuantity={updateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </Box>
  );
}
