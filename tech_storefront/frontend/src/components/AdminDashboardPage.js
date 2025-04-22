import React, { useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Fade,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LaunchIcon from "@mui/icons-material/Launch";

export default function AdminDashboardPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    const isAdmin = useMemo(() =>
        Boolean(user && (user.is_superuser || user.is_staff)), [user]);

    useEffect(() => {
        if (!isLoading && !isAdmin) {
        navigate("/");
        }
    }, [isLoading, isAdmin, navigate]);

    if (isLoading || !user) {
        return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <Typography variant="h6">Loading dashboard…</Typography>
        </Box>
        );
    }

    return (
        <Fade in>
        <Box
            sx={{
            minHeight: "100vh",
            width: "100%",
            bgcolor: "background.default",
            py: 6,
            px: 2,
            }}
        >
            <Paper
            elevation={4}
            sx={{
                maxWidth: 960,
                mx: "auto",
                p: { xs: 4, md: 6 },
                borderRadius: 4,
            }}
            >
            <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={1}>
                <DashboardIcon fontSize="large" />
                <Typography variant="h4" fontWeight={700}>
                    Admin Dashboard
                </Typography>
                </Box>

                <Typography variant="body1">
                Welcome back, <strong>{user.first_name || user.username}</strong>!
                </Typography>

                {/* Hook up real widgets / stats here */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                    component={RouterLink}
                    to="/products"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 8 }}
                >
                    Return to Store
                </Button>

                <Button
                    variant="outlined"
                    size="large"
                    endIcon={<LaunchIcon />}
                    sx={{ borderRadius: 8 }}
                    onClick={() =>
                    (window.location.href = `${window.location.origin}/admin/`)
                    }
                >
                    Django Admin
                </Button>
                </Stack>
            </Stack>
            </Paper>
        </Box>
        </Fade>
    );
}
