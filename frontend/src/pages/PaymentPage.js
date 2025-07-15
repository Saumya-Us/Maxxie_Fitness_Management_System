import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Drawer,
  useMediaQuery,
  Divider,
  CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import Logopng from "../Assests/maxxieslogos.png";
import BG from "../Assests/BG2.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const initialBilling = {
  name: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

const initialCard = {
  number: "",
  exp: "",
  cvc: "",
};

const initialBank = {
  accountName: "",
  accountNumber: "",
  bankName: "",
  ifsc: "",
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalAmount = Number(location.state?.totalAmount) || 0;
  const userId = localStorage.getItem('userId');

  const [billing, setBilling] = useState(initialBilling);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState(initialCard);
  const [bank, setBank] = useState(initialBank);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Sidebar content (same as Cart)
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

  // Billing handlers
  const handleBillingChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  // Payment method handlers
  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };
  const handleBankChange = (e) => {
    setBank({ ...bank, [e.target.name]: e.target.value });
  };

  // Simple validation for demo
  const validate = () => {
    if (
      !billing.name ||
      !billing.email ||
      !billing.address ||
      !billing.city ||
      !billing.state ||
      !billing.zip
    ) {
      setError("Please fill all billing fields.");
      return false;
    }
    if (paymentMethod === "card") {
      if (
        !/^\d{16}$/.test(card.number.replace(/\s/g, "")) ||
        !/^\d{2}\/\d{2}$/.test(card.exp) ||
        !/^\d{3,4}$/.test(card.cvc)
      ) {
        setError("Please enter valid card details.");
        return false;
      }
    }
    if (paymentMethod === "paypal") {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(paypalEmail)) {
        setError("Please enter a valid PayPal email.");
        return false;
      }
    }
    if (paymentMethod === "bank") {
      if (
        !bank.accountName ||
        !bank.accountNumber ||
        !bank.bankName ||
        !bank.ifsc
      ) {
        setError("Please fill all bank details.");
        return false;
      }
    }
    setError("");
    return true;
  };

  // Handle payment
  const handlePayment = async () => {
    setError("");
    setSuccess(false);
    if (!validate()) return;
    setLoading(true);

    try {
      // Prepare payment data
      const paymentData = {
        userId,
        amount: totalAmount,
        type: "membership", // You may want to make this dynamic if needed
        method: paymentMethod,
        description: `Payment by ${billing.name} (${billing.email})`,
      };
      // Get JWT token
      const token = localStorage.getItem("accessToken");
      // Send payment to backend with Authorization header
      await axios.post(
        "http://localhost:5000/finance/payments",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
      navigate('/order-confirmation', { state: { userId } });
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Payment method fields
  const renderPaymentFields = () => {
    if (paymentMethod === "card") {
      return (
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Card Number"
              name="number"
              fullWidth
              value={card.number}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              inputProps={{ maxLength: 19 }}
              required
              helperText="Enter 16-digit card number"
              aria-label="card number"
              autoComplete="cc-number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Expiry (MM/YY)"
              name="exp"
              fullWidth
              value={card.exp}
              onChange={handleCardChange}
              placeholder="MM/YY"
              inputProps={{ maxLength: 5 }}
              required
              helperText="Enter expiry date (MM/YY)"
              aria-label="card expiry"
              autoComplete="cc-exp"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CVC"
              name="cvc"
              fullWidth
              value={card.cvc}
              onChange={handleCardChange}
              placeholder="123"
              inputProps={{ maxLength: 4 }}
              required
              helperText="Enter 3 or 4-digit CVC"
              aria-label="card cvc"
              autoComplete="cc-csc"
            />
          </Grid>
        </Grid>
      );
    }
    if (paymentMethod === "paypal") {
      return (
        <TextField
          label="PayPal Email"
          name="paypalEmail"
          fullWidth
          value={paypalEmail}
          onChange={(e) => setPaypalEmail(e.target.value)}
          type="email"
          sx={{ mb: 2 }}
          required
          helperText="Enter your PayPal email address"
          aria-label="paypal email"
          autoComplete="email"
        />
      );
    }
    if (paymentMethod === "bank") {
      return (
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Account Holder Name"
              name="accountName"
              fullWidth
              value={bank.accountName}
              onChange={handleBankChange}
              required
              helperText="Enter the name as it appears on your bank account"
              aria-label="account holder name"
              autoComplete="cc-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Account Number"
              name="accountNumber"
              fullWidth
              value={bank.accountNumber}
              onChange={handleBankChange}
              required
              helperText="Enter your bank account number"
              aria-label="account number"
              autoComplete="cc-number"
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Bank Name"
              name="bankName"
              fullWidth
              value={bank.bankName}
              onChange={handleBankChange}
              required
              helperText="Enter the name of your bank"
              aria-label="bank name"
              autoComplete="cc-type"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="IFSC"
              name="ifsc"
              fullWidth
              value={bank.ifsc}
              onChange={handleBankChange}
              required
              helperText="Enter your IFSC code"
              aria-label="ifsc code"
              autoComplete="cc-csc"
            />
          </Grid>
        </Grid>
      );
    }
    if (paymentMethod === "cod") {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          You will pay with cash when your order is delivered.
        </Alert>
      );
    }
    return null;
  };

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

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 5 },
            borderRadius: 4,
            width: "100%",
            maxWidth: 1100,
            background: "rgba(255,255,255,0.97)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, color: "#224562", fontWeight: "bold", textAlign: "center" }}>
            Checkout
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={4}>
            {/* Billing Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Billing Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    value={billing.name}
                    onChange={handleBillingChange}
                    required
                    helperText="Enter your full name"
                    aria-label="full name"
                    autoComplete="name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={billing.email}
                    onChange={handleBillingChange}
                    required
                    type="email"
                    helperText="Enter your email address"
                    aria-label="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    value={billing.address}
                    onChange={handleBillingChange}
                    required
                    helperText="Enter your shipping address"
                    aria-label="shipping address"
                    autoComplete="shipping street-address"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    name="city"
                    fullWidth
                    value={billing.city}
                    onChange={handleBillingChange}
                    required
                    helperText="Enter your city"
                    aria-label="city"
                    autoComplete="address-level2"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="State"
                    name="state"
                    fullWidth
                    value={billing.state}
                    onChange={handleBillingChange}
                    required
                    helperText="Enter your state"
                    aria-label="state"
                    autoComplete="address-level1"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="ZIP"
                    name="zip"
                    fullWidth
                    value={billing.zip}
                    onChange={handleBillingChange}
                    required
                    helperText="Enter your ZIP code"
                    aria-label="zip code"
                    autoComplete="postal-code"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Payment Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Method
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup
                  row
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel value="card" control={<Radio />} label="Card" />
                  <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                  <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                  <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
                </RadioGroup>
              </FormControl>
              {renderPaymentFields()}

              <Box
                sx={{
                  width: "100%",
                  background: "rgba(34, 69, 98, 0.08)",
                  borderRadius: 2,
                  p: 2.5,
                  mb: 2.5,
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#224562",
                    fontWeight: "bold",
                    fontSize: 18,
                    mb: 1,
                  }}
                >
                  Order Summary
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 16, mb: 1 }}>
                  <span>Total Amount</span>
                  <span>Rs. {totalAmount.toFixed(2)}</span>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Payment Successful! Thank you for your order.
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  fontSize: 18,
                  py: 1.5,
                  background: "#FFD600",
                  color: "#224562",
                  "&:hover": { background: "#ffe066" },
                }}
                onClick={handlePayment}
                disabled={loading}
                aria-label="pay now button"
              >
                {loading ? (
                  <CircularProgress size={24} color="primary" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default PaymentPage;
