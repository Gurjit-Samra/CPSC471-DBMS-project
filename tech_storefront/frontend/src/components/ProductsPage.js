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
  TextField,
  Autocomplete,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";

import ShoppingCart from "./ShoppingCart";
import { useAuth } from "./AuthContext";

/** Helper to retrieve CSRF token from cookies. */
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
  // WishList & Cart
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Products & Search
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Additional attribute filters
  // (We keep price, ram, screen_size as in original code)
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [ramFilter, setRamFilter] = useState("");
  const [screenSizeFilter, setScreenSizeFilter] = useState("");

  // Instead of one brandFilter string, we use an array of selected brand names:
  const [selectedBrands, setSelectedBrands] = useState([]);

  // We'll store the distinct brand options for the dropdown:
  const [brandOptions, setBrandOptions] = useState([]);

  // Recommended or trending
  const [recMode, setRecMode] = useState(""); // "recommended" or "trending"
  const [recProducts, setRecProducts] = useState([]);

  // Auth & Menu
  const { user, setUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  // Which "category" button is active
  const [filter, setFilter] = useState("All");

  // ----------------------------
  // 1) If user is logged in, fetch cart & wishlist
  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchCart();
    }
  }, [user]);

  // 2) Get product suggestions whenever "search" changes
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

  // 3) Fetch recommended or trending
  useEffect(() => {
    fetch("/api/products/recommend-or-trending/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setRecMode(data.mode);
        setRecProducts(data.products);
      })
      .catch((err) => {
        console.error("Error fetching recommended/trending:", err);
      });
  }, []);

  // 4) Actually fetch products with filters
  const fetchProducts = () => {
    let url = `/api/products/?search=${encodeURIComponent(search)}`;

    // If user selected brand(s) except "All"
    if (selectedBrands.length > 0 && !selectedBrands.includes("All")) {
      const joined = selectedBrands.join(",");
      url += `&brand=${encodeURIComponent(joined)}`;
    }

    if (priceMin) {
      url += `&price_min=${encodeURIComponent(priceMin)}`;
    }
    if (priceMax) {
      url += `&price_max=${encodeURIComponent(priceMax)}`;
    }
    if (ramFilter) {
      url += `&ram=${encodeURIComponent(ramFilter)}`;
    }
    if (screenSizeFilter) {
      url += `&screen_size=${encodeURIComponent(screenSizeFilter)}`;
    }

    // GET from server
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  };

  // Re-fetch products whenever filters/search changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, priceMin, priceMax, ramFilter, screenSizeFilter, selectedBrands]);

  // After products have loaded, gather unique brand names for the dropdown
  useEffect(() => {
    const uniqueBrands = new Set();
    products.forEach((p) => {
      if (p.brand && p.brand.trim() !== "") {
        uniqueBrands.add(p.brand.trim());
      }
    });
    setBrandOptions(Array.from(uniqueBrands).sort());
  }, [products]);

  // ----------------------------
  // Wishlist & Cart API calls
  // ----------------------------
  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist/", { credentials: "include" });
      if (res.ok) {
        setWishlist(await res.json());
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart/", { credentials: "include" });
      if (res.ok) {
        setCart(await res.json());
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
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
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

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

  // Wishlist toggling
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
        // remove from wishlist
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
        // add to wishlist
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

  // Cart drawer open/close
  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  // Checkout
  const handleCheckout = () => {
    if (!user) navigate("/sign-in");
    else navigate("/checkout");
  };

  // Sign out & user menu
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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

  // For “category” buttons
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category || p.type || "Other"))),
  ];

  // Filter by category if user picks something other than "All"
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => (p.category || p.type) === filter);

  // Type display map
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

  // Functions for brand multi-select
  const handleSelectAllBrands = () => {
    // "All" is a special value that means "no brand filtering"
    setSelectedBrands(["All"]);
  };
  const handleSelectNoBrands = () => {
    // empty array = do no brand filtering
    setSelectedBrands([]);
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
      {/* HEADER */}
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

      {/* MAIN CONTENT */}
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
          {/* SEARCH BAR */}
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

          {/* RECOMMENDED OR TRENDING */}
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

          {/* CATEGORY BUTTONS */}
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

          {/* FILTER FIELDS UI */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mt: 2,
              mb: 2,
              backgroundColor: "rgba(255,255,255,0.7)",
              p: 2,
              borderRadius: 2,
            }}
          >
            {/* MULTI-SELECT BRAND DROPDOWN */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="brand-filter-label">Brand(s)</InputLabel>
              <Select
                labelId="brand-filter-label"
                multiple
                value={selectedBrands}
                onChange={(e) => setSelectedBrands(e.target.value)}
                input={<OutlinedInput label="Brand(s)" />}
                renderValue={(selected) => {
                  if (selected.includes("All")) {
                    return "All brands";
                  }
                  return selected.join(", ");
                }}
              >
                {/* Special item for "All" */}
                <MenuItem value="All" disabled={brandOptions.length === 0}>
                  <Checkbox checked={selectedBrands.includes("All")} />
                  <ListItemText primary="(Select All)" />
                </MenuItem>
                {/* Actual brand options */}
                {brandOptions.map((b) => (
                  <MenuItem key={b} value={b}>
                    <Checkbox checked={selectedBrands.includes(b)} />
                    <ListItemText primary={b} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" onClick={handleSelectAllBrands}>
              Select All
            </Button>
            <Button variant="outlined" onClick={handleSelectNoBrands}>
              Select None
            </Button>

            <TextField
              label="Min Price"
              size="small"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              sx={{ maxWidth: 120 }}
            />
            <TextField
              label="Max Price"
              size="small"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              sx={{ maxWidth: 120 }}
            />

            {/* Show RAM filter if user is looking at PC or Laptop */}
            {(filter.toLowerCase() === "pc" ||
              filter.toLowerCase() === "laptop") && (
              <TextField
                label="Min RAM (GB)"
                size="small"
                type="number"
                value={ramFilter}
                onChange={(e) => setRamFilter(e.target.value)}
                sx={{ maxWidth: 120 }}
              />
            )}

            {/* Show screen size filter if user is looking at Phone or TV */}
            {(filter.toLowerCase() === "phone" ||
              filter.toLowerCase() === "tv") && (
              <TextField
                label="Min Screen Size"
                size="small"
                type="number"
                value={screenSizeFilter}
                onChange={(e) => setScreenSizeFilter(e.target.value)}
                sx={{ maxWidth: 140 }}
              />
            )}
          </Box>

          {/* PRODUCT GRID */}
          <Grid container spacing={4} alignItems="stretch">
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

      {/* CART DRAWER */}
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
