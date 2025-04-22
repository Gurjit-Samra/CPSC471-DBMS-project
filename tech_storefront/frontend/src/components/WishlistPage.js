import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ShoppingCart from "./ShoppingCart";

export default function WishlistPage() {
  const { user, setUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

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

  // Fetch wishlist on mount
  useEffect(() => {
    fetch("/api/wishlist/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setWishlist(data));
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    fetch("/api/cart/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  // Remove from wishlist
  const handleToggleWishlist = async (product) => {
    const csrftoken = getCookie("csrftoken");
    await fetch("/api/wishlist/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      credentials: "include",
      body: JSON.stringify({
        product_id: product.object_id,
        product_type: product.product_type,
      }),
    });
    setWishlist((prev) =>
      prev.filter(
        (item) =>
          !(
            item.object_id === product.object_id &&
            item.product_type === product.product_type
          )
      )
    );
  };

  // Cart handlers
  const handleCartOpen = () => {
    setCartOpen(true);
    fetch("/api/cart/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCart(data));
  };
  const handleCartClose = () => setCartOpen(false);

  // Menu handlers
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
    navigate("/");
  };

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/sign-in");
    }
  }

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

          {/* Admin Dashboard Button */}
          {user && (user.is_staff || user.is_superuser) && (
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

          <IconButton color="primary" sx={{ ml: 2 }} onClick={handleCartOpen}>
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Box>

      {/* Simple ArrowBack Icon under header */}
      <IconButton
        sx={{
          position: "absolute",
          top: 72,
          left: 16,
          zIndex: 11,
          background: "rgba(255,255,255,0.8)",
          "&:hover": { background: "rgba(230,230,230,1)" },
        }}
        component={RouterLink}
        to="/products"
        aria-label="Back to Products"
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Wishlist Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: "64px", md: "93px" },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, mt: 4 }}>
          My Wishlist
        </Typography>
        {wishlist.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            Your wishlist is empty.
          </Typography>
        ) : (
          <Grid
            container
            spacing={4}
            alignItems="stretch"
            sx={{ margin: 0, width: "100%", maxWidth: 1200 }}
          >
            {wishlist.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${product.product_type}${product.object_id}`}
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
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{ cursor: "pointer", position: "relative" }}
                    onClick={() =>
                      navigate(`/products/${product.product_type}/${product.object_id}`)
                    }
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.image || "/static/no-image.png"}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: 180,
                        objectFit: "contain",
                        background: "#ffffff",
                        p: 0,
                      }}
                    />
                    <IconButton
                      aria-label="remove from wishlist"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(255,255,255,0.8)",
                        "&:hover": { background: "#ffeaea" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product);
                      }}
                    >
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() =>
                        navigate(`/products/${product.product_type}/${product.object_id}`)
                      }
                    >
                      {product.name}
                    </Typography>
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
                      ${Number(product.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Cart Drawer/Modal */}
      <ShoppingCart
        cart={cart}
        open={cartOpen}
        onClose={handleCartClose}
        onUpdateQuantity={() => {}}
        onRemoveFromCart={() => {}}
        onCheckout={handleCheckout}
      />
    </Box>
  );
}