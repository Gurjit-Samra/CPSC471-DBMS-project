import React from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ShoppingCart({ cart, open, onClose, onCheckout }) {
  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

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
              {cart.map((product, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemText
                    primary={product.name}
                    secondary={`$${Number(product.price).toFixed(2)}`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body2" color="text.secondary">
                    ${Number(product.price).toFixed(2)}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

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
            <span>${Number(totalPrice).toFixed(2)}</span>
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