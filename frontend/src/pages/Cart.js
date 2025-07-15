import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import Logopng from "../Assests/maxxieslogos.png";
import BG from "../Assests/BG2.jpg";
import { useNavigate } from "react-router-dom";

const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const Cart = ({ cart, removeFromCart, updateQuantity }) => {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = subtotal - discount;

  const promoCodes = {
    SUPP10: { discount: 0.1, description: "10% off" },
    HEALTH20: { discount: 0.2, description: "20% off" },
    FIT25: { discount: 0.25, description: "25% off" },
  };

  const handleQuantityChange = (itemId, newQuantity, stock) => {
    if (newQuantity < 1 || newQuantity > stock) return;
    updateQuantity(itemId, newQuantity);
  };

  const handlePromoInputChange = (e) => {
    setPromoCode(e.target.value.toUpperCase());
    if (isPromoApplied) {
      setIsPromoApplied(false);
      setPromoMessage("");
    }
  };

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    const code = promoCode.trim().toUpperCase();
    setTimeout(() => {
      if (promoCodes[code]) {
        const discountAmount = subtotal * promoCodes[code].discount;
        setDiscount(discountAmount);
        setPromoMessage(`Success! ${promoCodes[code].description} applied`);
        setIsPromoApplied(true);
      } else {
        setDiscount(0);
        setPromoMessage("Invalid promo code");
        setIsPromoApplied(false);
      }
      setIsApplyingPromo(false);
    }, 500);
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoMessage("");
    setIsPromoApplied(false);
  };

  const handleProceedToCheckout = () => {
    navigate('/paymentpage', { state: { totalAmount: totalPrice } });
  };

  // Sidebar content (matches ProductDetail)
  const SidebarContent = (
    <Box
      component="aside"
      sx={{
        width: { xs: 250, sm: 320 },
        minHeight: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundColor: "rgba(34, 69, 98, 0.92)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        boxShadow: 4,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <img src={Logopng} alt="Logo" style={{ width: 120, borderRadius: 12, marginTop: 80 }} />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          letterSpacing: 2,
          mb: 4,
          color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        Maxxies
      </Typography>
      <Box sx={{ width: "90%" }}>
        {sidebarButtons.map((btn) => (
          <Button
            key={btn.text}
            variant="contained"
            color={btn.color}
            fullWidth
            startIcon={btn.icon}
            sx={{
              mb: 2,
              minHeight: 56,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: 17,
              justifyContent: "flex-start",
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)",
              },
            }}
            onClick={() => {
              navigate(btn.route);
              if (isMobile) setDrawerOpen(false);
            }}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );

  // Empty cart view
  if (cart.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Sidebar */}
        {isMobile ? (
          <>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                position: "absolute",
                top: 18,
                left: 18,
                zIndex: 1301,
                bgcolor: "rgba(34,69,98,0.92)",
                color: "#fff",
                boxShadow: 2,
                "&:hover": { bgcolor: "rgba(34,69,98,1)" },
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  backgroundImage: `url(${BG})`,
                  backgroundColor: "rgba(1, 21, 37, 0.92)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "#fff",
                },
              }}
            >
              {SidebarContent}
            </Drawer>
          </>
        ) : (
          SidebarContent
        )}

        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 4,
              boxShadow: "0 4px 32px 0 rgba(34,69,98,0.09)",
              p: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#224562",
                fontWeight: "bold",
                letterSpacing: 2,
                mb: 2,
                textShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              Your Shopping Cart
            </Typography>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <Typography sx={{ fontSize: 18, color: "#333", mb: 1 }}>
              Your cart is empty
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 16, mb: 3 }}>
              Add some supplements to get started!
            </Typography>
            <Button
              onClick={() => navigate("/user-store")}
              sx={{
                background: "#224562",
                color: "#fff",
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: 17,
                px: 4,
                py: 1.5,
                boxShadow: "0 2px 12px 0 rgba(34,69,98,0.08)",
                "&:hover": { background: "#16304a" },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Main cart view
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Sidebar */}
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "absolute",
              top: 18,
              left: 18,
              zIndex: 1301,
              bgcolor: "rgba(34,69,98,0.92)",
              color: "#fff",
              boxShadow: 2,
              "&:hover": { bgcolor: "rgba(34,69,98,1)" },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                backgroundImage: `url(${BG})`,
                backgroundColor: "rgba(1, 21, 37, 0.92)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
              },
            }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        SidebarContent
      )}

      {/* Main Cart Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#224562",
            fontWeight: "bold",
            letterSpacing: 2,
            mb: 4,
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
        >
          Your Shopping Cart
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 5,
            width: "100%",
            maxWidth: 1400,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {/* Cart Items */}
          <Box sx={{ flex: "2 1 600px", maxWidth: 700, width: "100%" }}>
            {cart.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 3,
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
                  mb: 4,
                  p: 3,
                  alignItems: "center",
                  border: "1px solid #e5eaf2",
                  gap: 3,
                }}
              >
                {/* Product Image */}
                <Box
                  sx={{
                    width: 110,
                    height: 90,
                    borderRadius: 2,
                    background: "#f5f8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                    mr: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img
                    src={item.image ? `http://localhost:5000${item.image}` : "/placeholder.jpg"}
                    alt={item.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </Box>
                {/* Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h6"
                      onClick={() => navigate(`/product/${item._id}`)}
                      sx={{
                        color: "#224562",
                        fontWeight: "bold",
                        fontSize: 22,
                        cursor: "pointer",
                        mb: 0,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box
                      sx={{
                        background: "#224562",
                        color: "#fff",
                        borderRadius: 1,
                        fontSize: 15,
                        fontWeight: "bold",
                        px: 1.5,
                        py: 0.5,
                        opacity: 0.9,
                        ml: 1,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.category}
                    </Box>
                  </Box>
                  <Typography sx={{ color: "#555", fontSize: 16, mt: 0.5 }}>
                    {item.brand}
                  </Typography>
                  {/* Quantity controls */}
                  <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f5f8ff",
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        boxShadow: "0 1px 4px 0 rgba(34,69,98,0.08)",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          minWidth: 32,
                          borderRadius: 1,
                          fontWeight: "bold",
                          mr: 0.5,
                        }}
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.stock)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Typography sx={{ fontSize: 18, minWidth: 32, textAlign: "center" }}>
                        {item.quantity}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          minWidth: 32,
                          borderRadius: 1,
                          fontWeight: "bold",
                          ml: 0.5,
                        }}
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.stock)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </Button>
                    </Box>
                    {item.quantity >= item.stock && (
                      <Typography sx={{ color: "error.main", fontSize: 15, ml: 1 }}>
                        Max stock reached
                      </Typography>
                    )}
                  </Box>
                  {/* Price and subtotal */}
                  <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                    <Typography sx={{ color: "#224562", fontWeight: "bold", fontSize: 17 }}>
                      Rs. {item.price.toFixed(2)} each
                    </Typography>
                    <Typography sx={{ color: "#333", fontSize: 16 }}>
                      Subtotal: <strong>Rs. {(item.price * item.quantity).toFixed(2)}</strong>
                    </Typography>
                  </Box>
                </Box>
                {/* Remove button */}
                <Button
                  onClick={() => removeFromCart(item._id)}
                  aria-label="Remove item"
                  sx={{
                    background: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: 20,
                    width: 36,
                    height: 36,
                    minWidth: 0,
                    alignSelf: "flex-start",
                    "&:hover": { background: "#b71c1c" },
                  }}
                >
                  ×
                </Button>
              </Box>
            ))}
          </Box>

          {/* Sidebar summary */}
          <Box
            sx={{
              flex: "1 1 320px",
              minWidth: 320,
              maxWidth: 380,
              background: "rgba(34, 69, 98, 0.92)",
              color: "#fff",
              borderRadius: 3,
              boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)",
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
            }}
          >
            {/* Promo Section */}
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: 22,
                  letterSpacing: 1,
                  mb: 2,
                  color: "#fff",
                  textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                Promo Code
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={handlePromoInputChange}
                  disabled={isApplyingPromo || isPromoApplied}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 16,
                    background: "rgba(255,255,255,0.4)",
                    color: "#fff",
                    fontWeight: "bold",
                    outline: "none",
                  }}
                />
                {!isPromoApplied ? (
                  <Button
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim() || isApplyingPromo}
                    sx={{
                      background: "#FFD600",
                      color: "#224562",
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 2.5,
                      fontSize: 16,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                      "&:hover": { background: "#ffe066" },
                    }}
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </Button>
                ) : (
                  <Button
                    onClick={removePromoCode}
                    sx={{
                      background: "#224562",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 2.5,
                      fontSize: 16,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                      "&:hover": { background: "#16304a" },
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              {promoMessage && (
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: "bold",
                    mt: 0.5,
                    color: isPromoApplied ? "#FFD600" : "#d32f2f",
                  }}
                >
                  {promoMessage}
                </Typography>
              )}
            </Box>

            {/* Order Summary */}
            <Box
              sx={{
                width: "100%",
                background: "rgba(255,255,255,0.4)",
                borderRadius: 2,
                p: 3,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#224562",
                  fontWeight: "bold",
                  fontSize: 20,
                  mb: 2,
                }}
              >
                Order Summary
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 16, mb: 1 }}>
                <span>
                  Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
                </span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </Box>
              {discount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 16,
                    color: "#FFD600",
                    mb: 1,
                  }}
                >
                  <span>Discount</span>
                  <span>- Rs. {discount.toFixed(2)}</span>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: 18,
                  color: "#224562",
                  mb: 2,
                }}
              >
                <span>Total</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, fontWeight: 'bold', fontSize: 18 }}
                onClick={handleProceedToCheckout}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </Button>
              <Button
                onClick={() => navigate("/user-store")}
                sx={{
                  width: "100%",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 17,
                  borderRadius: 2,
                  py: 1.2,
                  "&:hover": { background: "rgba(255,255,255,0.25)" },
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
