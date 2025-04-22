import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Fade,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    } from "@mui/material";
    import DashboardIcon from "@mui/icons-material/Dashboard";
    import LaunchIcon from "@mui/icons-material/Launch";

    import {
    ResponsiveContainer,
    LineChart,
    Line,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Bar,
    } from "recharts";

    export default function AdminDashboardPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const isAdmin = useMemo(
        () => Boolean(user && (user.is_superuser || user.is_staff)),
        [user]
    );

    useEffect(() => {
        if (!isLoading && !isAdmin) {
        navigate("/");
        }
    }, [isLoading, isAdmin, navigate]);

    useEffect(() => {
        if (isAdmin) {
        fetch("/api/admin-analytics/", {
            credentials: "include",
        })
            .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to load analytics");
            }
            return res.json();
            })
            .then((data) => {
            setAnalytics(data);
            setLoadingAnalytics(false);
            })
            .catch((err) => {
            console.error(err);
            setLoadingAnalytics(false);
            });
        }
    }, [isAdmin]);

    if (isLoading || !user) {
        return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <Typography variant="h6">Loading dashboard…</Typography>
        </Box>
        );
    }

    if (loadingAnalytics) {
        return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <CircularProgress />
        </Box>
        );
    }

    if (!analytics) {
        return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <Typography variant="h6" color="error">
            Could not load analytics.
            </Typography>
        </Box>
        );
    }

    const {
        total_orders,
        total_sales,
        total_customers,
        daily_sales,
        recent_orders,
        daily_signups,
        category_revenue,
        top_sellers,
    } = analytics;

    const categoryRevenueArray = Object.entries(category_revenue).map(
        ([category, obj]) => ({
        category,
        revenue: obj.revenue,
        units_sold: obj.units_sold,
        })
    );

    return (
        <Fade in>
        <Box
            sx={{
            height: "100vh",
            overflowY: "auto",
            width: "100%",
            bgcolor: "background.default",
            py: 6,
            px: 2,
            }}
        >
            <Paper
            elevation={4}
            sx={{
                maxWidth: 1400,
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
                Welcome back, <strong>{user.first_name || user.email}</strong>!
                </Typography>

                {/* Quick nav buttons */}
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
                    onClick={() => (window.location.href = `${window.location.origin}/admin/`)}
                >
                    Django Admin
                </Button>
                </Stack>

                {/* Summaries */}
                <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ borderRadius: 4, height: "100%" }}>
                    <CardContent>
                        <Typography variant="overline">Total Orders</Typography>
                        <Typography variant="h5" fontWeight={700}>
                        {total_orders}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ borderRadius: 4 }}>
                    <CardContent>
                        <Typography variant="overline">Total Sales</Typography>
                        <Typography variant="h5" fontWeight={700}>
                        ${total_sales.toFixed(2)}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ borderRadius: 4 }}>
                    <CardContent>
                        <Typography variant="overline">Total Customers</Typography>
                        <Typography variant="h5" fontWeight={700}>
                        {total_customers}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ borderRadius: 4 }}>
                    <CardContent>
                        <Typography variant="overline">Avg. Order Value</Typography>
                        <Typography variant="h5" fontWeight={700}>
                        {total_orders > 0 ? `$${(total_sales / total_orders).toFixed(2)}` : "$0.00"}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                </Grid>

                {/* Daily Sales (Line Chart) */}
                <Box>
                <Typography variant="h6" mb={2} fontWeight={700}>
                    Daily Sales (Last 14 days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={daily_sales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />

                    {/* Revenue (left Y-axis) */}
                    <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
                    {/* Orders (right Y-axis) */}
                    <YAxis yAxisId="right" orientation="right" />

                    <Tooltip formatter={(v, n) => (n === "Revenue" ? `$${v.toFixed(2)}` : v)} />
                    <Legend />

                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Revenue"
                        dot={false}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Orders"
                        dot={{ r: 3 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </Box>

                {/* Daily Signups (Line Chart) */}
                <Box>
                <Typography variant="h6" mb={2} fontWeight={700}>
                    New Customers (Last 14 days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={daily_signups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="signups"
                        stroke="#ff7300"
                        strokeWidth={2}
                        name="Signups"
                    />
                    </LineChart>
                </ResponsiveContainer>
                </Box>

                {/* Revenue by Category (Composed Chart) */}
                <Box>
                <Typography variant="h6" mb={2} fontWeight={700}>
                    Revenue by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={categoryRevenueArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />

                    {/* Revenue on left, Units on right */}
                    <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" />

                    <Tooltip formatter={(v, n) => (n === "Revenue" ? `$${v.toFixed(2)}` : v)} />
                    <Legend />

                    {/* Bars for revenue */}
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8884d8" barSize={40} />

                    {/* Line for units sold */}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="units_sold"
                        name="Units Sold"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    </ComposedChart>
                </ResponsiveContainer>
                </Box>

                {/* Recent Orders */}
                <Box>
                <Typography variant="h6" mb={2} fontWeight={700}>
                    Recent Orders
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                    {recent_orders.length === 0 ? (
                    <Typography>No recent orders</Typography>
                    ) : (
                    <List>
                        {recent_orders.map((order) => (
                        <ListItem key={order.id}>
                            <ListItemText
                            primary={`Order #${order.id} - $${order.total.toFixed(2)} - ${order.status}`}
                            secondary={`Customer: ${order.customer_email} | Placed: ${new Date(order.created_at).toLocaleString()}`}
                            />
                        </ListItem>
                        ))}
                    </List>
                    )}
                </Paper>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Top Sellers */}
                <Box>
                <Typography variant="h5" mb={2} fontWeight={700}>
                    Top 5 Best-Selling Products (By Category)
                </Typography>

                {/* We can do 2 columns, each cell is a category */}
                <Grid container spacing={2}>
                    {Object.entries(top_sellers).map(([cat, products]) => (
                    <Grid item xs={12} sm={6} md={4} key={cat}>
                        <Paper sx={{ p: 2, borderRadius: 4 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                            {cat.toUpperCase()}
                        </Typography>
                        {products.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                            No sales yet.
                            </Typography>
                        ) : (
                            <List dense>
                            {products.map((p) => (
                                <ListItem key={p.id} sx={{ py: 0.5 }}>
                                <ListItemText
                                    primary={`${p.name}`}
                                    secondary={`Qty Sold: ${p.total_qty} | Revenue: $${p.total_revenue.toFixed(2)}`}
                                />
                                </ListItem>
                            ))}
                            </List>
                        )}
                        </Paper>
                    </Grid>
                    ))}
                </Grid>
                </Box>
            </Stack>
            </Paper>
        </Box>
        </Fade>
    );
}
