// tech_storefront/frontend/src/components/CartPage.js

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    List,
    ListItem,
    ListItemText,
    Stack,
    Divider,
    Avatar,
    } from "@mui/material";
    import AddIcon from "@mui/icons-material/Add";
    import RemoveIcon from "@mui/icons-material/Remove";
    import DeleteIcon from "@mui/icons-material/Delete";
    import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
    import { Link as RouterLink, useNavigate } from "react-router-dom";
    import { useAuth } from "./AuthContext";

    /** Helper to get CSRF token from cookies */
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

    export default function CartPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Compute total price
    const totalPrice = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    /** Fetch cart items on mount (and whenever user changes) */
    useEffect(() => {
        if (user) {
        fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        try {
        const res = await fetch("/api/cart/", {
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            setCart(data);
        }
        } catch (error) {
        console.error("Error fetching cart:", error);
        }
    };

    /** Update quantity in the backend */
    const updateCartQuantity = async (item, newQuantity) => {
        const csrftoken = getCookie("csrftoken");
        try {
        const res = await fetch("/api/cart/", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            body: JSON.stringify({
            product_id: item.object_id,
            product_type: item.product_type,
            quantity: newQuantity,
            }),
        });
        if (res.ok) {
            // Refresh cart items
            fetchCart();
        }
        } catch (error) {
        console.error("Error updating cart:", error);
        }
    };

    /** Remove item from cart (DELETE) */
    const removeFromCart = async (item) => {
        const csrftoken = getCookie("csrftoken");
        try {
        const res = await fetch("/api/cart/", {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            body: JSON.stringify({
            product_id: item.object_id,
            product_type: item.product_type,
            }),
        });
        if (res.ok) {
            fetchCart();
        }
        } catch (error) {
        console.error("Error removing from cart:", error);
        }
    };

    /** Navigate to checkout */
    const handleCheckout = () => {
        // If no user, prompt sign in
        if (!user) {
        navigate("/sign-in");
        } else {
        navigate("/checkout");
        }
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
            overflowX: "hidden",
        }}
        >
        {/* Header bar */}
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
            <Box sx={{ mr: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user
                ? `${user.first_name} ${user.last_name}`
                : "Sign in to manage cart"}
            </Typography>
            </Box>
        </Box>

        {/* Content container */}
        <Box
            sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 7, md: 9 },
            px: 2,
            pb: 4,
            }}
        >
            {/* Back Button */}
            <Button
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
                alignSelf: "flex-start",
                mt: { xs: 2, md: 4 },
                borderRadius: "999px",
                fontWeight: 600,
            }}
            variant="outlined"
            onClick={() => navigate("/products")}
            >
            Back to Products
            </Button>

            <Typography variant="h4" sx={{ fontWeight: 800, mt: 3, mb: 3 }}>
            My Shopping Cart
            </Typography>

            {!cart.length && (
            <Typography sx={{ mb: 3 }}>Your cart is empty.</Typography>
            )}

            {cart.length > 0 && (
            <List sx={{ width: "100%", maxWidth: 800 }}>
                {cart.map((item) => (
                <Box
                    key={`${item.product_type}${item.object_id}`}
                    sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        variant="square"
                        src={item.image || "/static/no-image.png"}
                        alt={item.name}
                        sx={{ width: 64, height: 64, borderRadius: 2 }}
                    />
                    <ListItemText
                        primary={
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {item.name}
                        </Typography>
                        }
                        secondary={`$${Number(item.price).toFixed(2)}`}
                    />
                    </Stack>

                    {/* Quantity controls */}
                    <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 1 }}
                    >
                    <IconButton
                        onClick={() => {
                        if (item.quantity > 1) {
                            updateCartQuantity(item, item.quantity - 1);
                        }
                        }}
                        disabled={item.quantity <= 1}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 20, textAlign: "center" }}>
                        {item.quantity}
                    </Typography>
                    <IconButton
                        onClick={() => updateCartQuantity(item, item.quantity + 1)}
                    >
                        <AddIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => removeFromCart(item)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ marginLeft: "auto", fontWeight: 600 }}>
                        Subtotal: $
                        {(Number(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                    </Stack>
                </Box>
                ))}
            </List>
            )}

            {/* Divider and total */}
            {cart.length > 0 && (
            <>
                <Divider sx={{ width: "100%", maxWidth: 800, my: 3 }} />
                <Box
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
                >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    ${totalPrice.toFixed(2)}
                </Typography>
                </Box>
                <Button
                variant="contained"
                color="primary"
                sx={{
                    borderRadius: "999px",
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": {
                    backgroundColor: "1875D2",
                    boxShadow: "none",
                    },
                    width: 250,
                }}
                onClick={handleCheckout}
                >
                Checkout
                </Button>
            </>
            )}
        </Box>
        </Box>
    );
}
