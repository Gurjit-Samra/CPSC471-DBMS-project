// tech_storefront/frontend/src/components/AdminDashboardPage.js
import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
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

    export default function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If user is not superuser/staff, bounce them out:
        if (!user || (!user.is_superuser && !user.is_staff)) {
        navigate("/"); // or /sign-in, /products, etc.
        }
    }, [user, navigate]);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box
        sx={{
            minHeight: "100vh",
            width: "100vw",
            background: "#f5f5f5",
            p: 4,
        }}
        >
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
            Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
            Welcome, {user.first_name}!
        </Typography>
        {/* 
            Admin features here
        */}
        <Button variant="contained" onClick={() => navigate("/products")}>
            Return to Site
        </Button>
        </Box>
    );
    }
