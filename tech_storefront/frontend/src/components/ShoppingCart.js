import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Slide,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ShoppingCart({ cart, open, onClose, onCheckout, onUpdateQuantity, onRemoveFromCart }) {
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: { xs: "100%", sm: 400 },
          backgroundColor: "white",
          boxShadow: "0 4px 24px rgba(60,72,88,0.15)",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {cart.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Your cart is empty.
            </Typography>
          ) : (
            <List>
              {cart.map((item, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${Number(item.price).toFixed(2)}`}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        item.quantity > 1 &&
                        onUpdateQuantity(item.object_id, item.product_type, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        onUpdateQuantity(item.object_id, item.product_type, item.quantity + 1)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        onRemoveFromCart(item.object_id, item.product_type)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/*"View Cart Page" Button*/}
        {cart.length > 0 && (
          <Box sx={{ px: 2, mb: 1 }}>
            <Button
              component={RouterLink}
              to="/cart"
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                borderRadius: "999px",
                fontWeight: 600,
                mb: 2,
              }}
            >
              View Cart Page
            </Button>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f5f7fa",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, display: "flex", justifyContent: "space-between" }}
          >
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              fontWeight: 600,
              borderRadius: "999px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "1875D2",
                boxShadow: "none",
              },
            }}
            onClick={onCheckout}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Slide>
  );
}