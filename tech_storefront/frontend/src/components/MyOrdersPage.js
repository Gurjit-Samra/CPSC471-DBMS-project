import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Stack,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Badge,
    } from "@mui/material";
    import { Link as RouterLink, useNavigate } from "react-router-dom";
    import { useAuth } from "./AuthContext";
    import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
    import AccountCircleIcon from "@mui/icons-material/AccountCircle";
    import CloseIcon from "@mui/icons-material/Close";

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

    export default function MyOrdersPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    // For demonstration, if you want to show a cart icon, you'd also fetch cart count, etc.
    const [cartCount] = useState(0); // You can adapt from your code if needed

    useEffect(() => {
        // Fetch all orders for the current user
        fetch("/api/order/", {
        credentials: "include",
        })
        .then((res) => {
            if (!res.ok) {
            throw new Error("Failed to fetch orders");
            }
            return res.json();
        })
        .then((data) => setOrders(data))
        .catch((err) => setError(err.message));
    }, []);

    // Menu open/close
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

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

    if (!user) {
        return (
        <Box
            sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            }}
        >
            <Typography variant="h6">
            You must be signed in to view your orders.
            </Typography>
        </Box>
        );
    }

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
            <Typography variant="h6" sx={{ fontWeight: 800, color: "black" }}>
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
            {/* Example cart icon if needed */}
            <IconButton color="primary" sx={{ ml: 2 }}>
                <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
                </Badge>
            </IconButton>
            </Stack>
        </Box>

        {/* Body */}
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
                maxWidth: 900,
                px: { xs: 2, sm: 3, md: 4 },
                mb: 4,
            }}
            >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                My Orders
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {orders.length === 0 && !error ? (
                <Typography>No orders found.</Typography>
            ) : (
                orders.map((order) => (
                <Card
                    key={order.id}
                    sx={{
                    mb: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 24px rgba(60,72,88,0.1)",
                    overflow: "hidden",
                    }}
                >
                    <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1 }}
                    >{`Order #${order.id}`}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Placed on: {new Date(order.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Status:{" "}
                        <strong>
                        {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </strong>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Total Paid: ${Number(order.total).toFixed(2)}
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button
                        component={RouterLink}
                        to={`/my-orders/${order.id}`}
                        size="small"
                        variant="outlined"
                    >
                        View Details
                    </Button>
                    </CardActions>
                </Card>
                ))
            )}
            </Box>
        </Box>
        </Box>
    );
}
