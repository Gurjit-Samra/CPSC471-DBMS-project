import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Rating,
  Stack,
} from "@mui/material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";

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

export default function WriteReviewPage() {
  const { type, id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details for display
    fetch(`/api/products/${type}/${id}/`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [type, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch("/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({
          product_type: type,
          product_id: id,
          rating,
          review_text: reviewText,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }
      navigate(`/products/${type}/${id}`);
    } catch (err) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <CssBaseline />
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
          height: "100vh",
          overflowY: "auto",
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
          <RouterLink to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Box
              component="img"
              src="/static/favicon2.ico"
              alt="FGG Tech"
              sx={{ width: 36, height: 36, mr: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0, color: "black" }}>
              FGG Tech
            </Typography>
          </RouterLink>
        </Box>

        {/* Review Form */}
        <Stack direction="column" justifyContent="center" alignItems="center" sx={{ flex: 1, pt: "72px" }}>
          <Card variant="outlined" sx={{ width: { xs: "100%", sm: 450 }, p: 4, m: "auto", borderRadius: 8 }}>
            {product && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ width: 56, height: 56, objectFit: "contain", mr: 2, background: "#fff", borderRadius: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {product.name}
                </Typography>
              </Box>
            )}
            <Typography
              component="h1"
              variant="h5"
              sx={{ width: "100%", textAlign: "center", mb: 2 }}
            >
              Write a Review
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(_, value) => setRating(value || 1)}
                  size="large"
                  max={5}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="review-text">Review</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="review-text"
                  name="review_text"
                  multiline
                  minRows={3}
                  placeholder="Share your thoughts about this product..."
                  variant="outlined"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </FormControl>
              {error && (
                <Typography color="error" sx={{ textAlign: "center" }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
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
                Submit Review
              </Button>
              <Button
                component={RouterLink}
                to={`/products/${type}/${id}`}
                fullWidth
                variant="text"
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
                Cancel
              </Button>
            </Box>
          </Card>
        </Stack>
      </Box>
    </>
  );
}