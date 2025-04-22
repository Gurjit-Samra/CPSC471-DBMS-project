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
  CardActions,
  CircularProgress,
  Grid,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCart from "./ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "./AuthContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ProductsPage from "./ProductsPage";

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

  // Fetch cart items when the user is logged in
  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart/", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Get the cart when the user signs in
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

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
          product_id: product.id,
          product_type: product.type,
          quantity: 1, // Default quantity is 1
        }),
      });

      if (response.ok) {
        const updatedCartItem = await response.json();
        setCart((prev) => {
          const existingItem = prev.find(
            (item) => item.product_id === updatedCartItem.product_id
          );
          if (existingItem) {
            return prev.map((item) =>
              item.product_id === updatedCartItem.product_id
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
        body: JSON.stringify({
          product_id: object_id,
          product_type: product_type,
        }),
      });
      if (response.ok) {
        fetchCart(); // Refresh cart after deletion
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateCartQuantity = async (product_id, product_type, newQuantity) => {
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
          product_id,
          product_type,
          quantity: newQuantity,
        }),
      });
      if (response.ok) {
        fetchCart(); // Refresh cart after update
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
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

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/sign-in");
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      navigate("/sign-in");
    } else {
      navigate(`/products/${type}/${id}/write-review`);
    }
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
            sx={{
              width: 36,
              height: 36,
              mr: 2,
            }}
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

      {/* Product Details Section */}
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
            <>
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
                    {/* Check if there's a discount */}
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
                        <span>
                          $
                          {(
                            Number(product.price) *
                            (1 - product.percent_discount / 100)
                          ).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      `$${Number(product.price).toFixed(2)}`
                    )}
                  </Typography>
                  {product.description && (
                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                      {product.description.split("\n").map(
                        (line, idx) =>
                          line.trim() && (
                            <li key={idx}>
                              <Typography variant="body1">{line}</Typography>
                            </li>
                          )
                      )}
                    </Box>
                  )}
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

              {/* Similar Products section */}
              {product.recommendations && product.recommendations.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    Similar Products
                  </Typography>

                  <Grid container spacing={2}>
                    {product.recommendations.map((rec) => (
                      <Grid item xs={12} sm={6} md={4} key={`${rec.type}${rec.id}`}>
                        <Card
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 4,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={rec.image}
                            alt={rec.name}
                            sx={{
                              objectFit: "contain",
                              backgroundColor: "#f5f5f5",
                            }}
                          />
                          <CardContent>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                mb: 1,
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate(`/products/${rec.type}/${rec.id}`)
                              }
                            >
                              {rec.name}
                            </Typography>

                            {rec.percent_discount ? (
                              <Typography variant="h6" color="primary">
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    marginRight: 8,
                                    color: "#888",
                                  }}
                                >
                                  ${Number(rec.price).toFixed(2)}
                                </span>
                                $
                                {(
                                  Number(rec.price) *
                                  (1 - rec.percent_discount / 100)
                                ).toFixed(2)}
                              </Typography>
                            ) : (
                              <Typography variant="h6" color="primary">
                                ${Number(rec.price).toFixed(2)}
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
                              onClick={() => {
                                if (user) {
                                  handleAddToCart({
                                    id: rec.id,
                                    type: rec.type,
                                    price: rec.price,
                                    name: rec.name,
                                  });
                                } else {
                                  navigate("/sign-in");
                                }
                              }}
                            >
                              Add to Cart
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() =>
                                navigate(`/products/${rec.type}/${rec.id}`)
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

              {/* Show reviews if present */}
              {product.reviews && product.reviews.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Reviews
                  </Typography>
                  {product.reviews.map((review) => (
                    <Box
                      key={review.id}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {review.customer_first_name} {review.customer_last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {"★".repeat(review.rating) +
                          "☆".repeat(5 - review.rating)}
                      </Typography>
                      <Typography variant="body1">
                        {review.review_text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleWriteReview}
                sx={{
                  mt: 3,
                  borderRadius: "999px",
                  fontWeight: 600,
                }}
              >
                Write a Review
              </Button>
            </>
          ) : (
            <Typography color="error" sx={{ mt: 8 }}>
              Product not found.
            </Typography>
          )}
        </Box>
      </Box>
      {/* cart drawer/modal */}
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
