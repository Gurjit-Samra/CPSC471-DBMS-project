// tech_storefront/frontend/src/components/OrderSuccessPage.js

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Stack,
    IconButton,
    Menu,
    MenuItem,
    Badge,
    } from "@mui/material";
    import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
    import AccountCircleIcon from "@mui/icons-material/AccountCircle";
    import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
    import { useAuth } from "./AuthContext";

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

    export default function OrderSuccessPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { orderId } = useParams();

    // For the user menu in header
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Sign out handler for user
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

    const [cartCount, setCartCount] = useState(0);

    // For order data
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch the newly created order details
        fetch(`/api/order/${orderId}/`, { credentials: "include" })
        .then((res) => {
            if (!res.ok) {
            throw new Error("Failed to fetch order details.");
            }
            return res.json();
        })
        .then((data) => setOrder(data))
        .catch((err) => setError(err.message));
    }, [orderId]);

    if (error) {
        return (
        <Box
            sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            p: 4,
            }}
        >
            <Typography variant="h6" color="error">
            {error}
            </Typography>
        </Box>
        );
    }

    if (!order) {
        return (
        <Box
            sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            p: 4,
            }}
        >
            <Typography variant="h6">Loading order details...</Typography>
        </Box>
        );
    }

    // If we have order data, deconstruct relevant fields
    const {
        id,
        created_at,
        status,
        total,
        shipping_first_name,
        shipping_last_name,
        shipping_address,
        shipping_address2,
        shipping_city,
        shipping_state,
        shipping_province,
        shipping_postal_code,
        shipping_phone,
        billing_first_name,
        billing_last_name,
        billing_address,
        billing_address2,
        billing_city,
        billing_state,
        billing_province,
        billing_postal_code,
        billing_phone,
        items,
    } = order;

    // The page below mimics the "ProductsPage" or "LandingPage" style:
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
            borderBottom: "1.5px solid rgba(237,237,237,0.5)",
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
            <Typography variant="h6" sx={{ fontWeight: 800, color: "black" }}>
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

            {/* Example Cart Icon, if you want it on success page too */}
            <IconButton color="primary" sx={{ ml: 1 }}>
                <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
                </Badge>
            </IconButton>
            </Stack>
        </Box>

        {/* Main content container, scrollable */}
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
            pt: { xs: "64px", md: "93px" }, // enough top padding to clear the header
            }}
        >
            <Box
            sx={{
                width: "100%",
                maxWidth: 900,
                px: { xs: 2, sm: 3, md: 4 },
                mb: 4,
            }}
            >
            {/* PAGE TITLE */}
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                Thank You for Your Order!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Your order was placed successfully.
            </Typography>

            <Card
                sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 4px 24px rgba(60,72,88,0.1)",
                overflow: "hidden",
                }}
            >
                <CardHeader
                title={`Order #${id}`}
                subheader={`Placed on: ${new Date(created_at).toLocaleString()}`}
                />
                <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Status:{" "}
                    <strong>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    </strong>
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Items:
                </Typography>
                <List sx={{ mb: 2 }}>
                    {items.map((item) => (
                    <ListItem key={item.id} disableGutters>
                        <ListItemText
                        primary={`${item.name} (x${item.quantity})`}
                        secondary={`$${Number(item.price).toFixed(2)} each`}
                        />
                    </ListItem>
                    ))}
                </List>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6">
                    Total: <strong>${Number(total).toFixed(2)}</strong>
                </Typography>
                </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card
                sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 4px 24px rgba(60,72,88,0.1)",
                }}
            >
                <CardHeader title="Shipping Address" />
                <CardContent>
                <Typography>
                    {shipping_first_name} {shipping_last_name}
                </Typography>
                <Typography>
                    {shipping_address}
                    {shipping_address2 ? `, ${shipping_address2}` : ""}
                </Typography>
                <Typography>
                    {shipping_city && `${shipping_city}, `}
                    {shipping_state && `${shipping_state}, `}
                    {shipping_province && `${shipping_province} `}
                    {shipping_postal_code}
                </Typography>
                <Typography>Phone: {shipping_phone}</Typography>
                </CardContent>
            </Card>

            {/* Billing Info */}
            <Card
                sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 4px 24px rgba(60,72,88,0.1)",
                }}
            >
                <CardHeader title="Billing Address" />
                <CardContent>
                <Typography>
                    {billing_first_name} {billing_last_name}
                </Typography>
                <Typography>
                    {billing_address}
                    {billing_address2 ? `, ${billing_address2}` : ""}
                </Typography>
                <Typography>
                    {billing_city && `${billing_city}, `}
                    {billing_state && `${billing_state}, `}
                    {billing_province && `${billing_province} `}
                    {billing_postal_code}
                </Typography>
                <Typography>Phone: {billing_phone}</Typography>
                </CardContent>
            </Card>

            {/* Continue Shopping Button */}
            <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                color="primary"
                sx={{
                fontWeight: 700,
                borderRadius: "999px",
                boxShadow: "none",
                "&:hover": {
                    backgroundColor: "1875D2",
                    boxShadow: "none",
                },
                }}
            >
                Continue Shopping
            </Button>
            </Box>
        </Box>
        </Box>
    );
    }
