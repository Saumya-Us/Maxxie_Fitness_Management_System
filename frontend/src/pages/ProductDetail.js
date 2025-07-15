import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  CircularProgress,
  Paper,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar buttons, matching UserStore
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const ProductDetail = ({ addToCart, cartItems }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/supplements/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    if (!product) return;
    setQuantity((prev) => {
      const newQty = Math.max(1, Math.min(prev + change, product.stock));
      return newQty;
    });
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setQuantity(1);
  };

  const getCartItemCount = () => {
    return cartItems?.find((item) => item._id === id)?.quantity || 0;
  };

  // Sidebar content, matching UserStore
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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            bgcolor: "rgba(255,255,255,0.85)",
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>Loading product details...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            bgcolor: "rgba(255,255,255,0.9)",
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="error" sx={{ mb: 2 }}>
            Product not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/user-store")}
            sx={{ borderRadius: 2, fontWeight: "bold", mt: 1 }}
          >
            Back to Store
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        m: 0,
        p: 0,
        display: "flex",
        flexDirection: "row",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Sidebar: Drawer for mobile, fixed for desktop */}
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
              "&:hover": {
                bgcolor: "rgba(34,69,98,1)",
              },
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
          alignItems: "flex-start",
          justifyContent: "center",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: "100%",
            
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 5 },
            mt: { xs: 2, sm: 0 },
          }}
        >
          {/* Header actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
              onClick={() => navigate("/user-store")}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                px: 2,
                bgcolor: "rgba(34,69,98,0.08)",
                "&:hover": { bgcolor: "rgba(34,69,98,0.18)" },
              }}
            >
              Back to Store
            </Button>
            <Tooltip title="View Cart">
              <IconButton
                onClick={() => navigate("/cart")}
                sx={{
                  ml: 2,
                  bgcolor: "rgba(34,69,98,0.92)",
                  color: "#fff",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "rgba(34,69,98,1)" },
                }}
              >
                <Badge badgeContent={cartItems?.length || 0} color="primary">
                  <ShoppingCartIcon fontSize="large" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 5,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {/* Product Image Section */}
            <Box
              sx={{
                flex: "1 1 340px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: { xs: 2, md: 0 },
              }}
            >
              <Box
                sx={{
                  width: 300,
                  height: 260,
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "#e5eaf2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: 3,
                  mb: 2,
                  cursor: "pointer",
                }}
              >
                <img
                  src={product.image ? `http://localhost:5000${product.image}` : "/placeholder.jpg"}
                  alt={product.name}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "#224562",
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: 15,
                    fontWeight: "bold",
                    opacity: 0.9,
                    textTransform: "capitalize",
                  }}
                >
                  {product.category}
                </Box>
                {getCartItemCount() > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "#FFD600",
                      color: "#224562",
                      px: 1,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    In Cart: {getCartItemCount()}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Product Info Section */}
            <Box sx={{ flex: "2 1 500px", width: "100%" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: "#224562",
                  mb: 1,
                  letterSpacing: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                {product.name}
              </Typography>
              <Typography sx={{ fontSize: 18, color: "text.secondary", mb: 2 }}>
                {product.brand || "Generic Brand"}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22, color: "#224562" }}>
                  Rs. {product.price}
                </Typography>
                {product.stock <= 5 && product.stock > 0 && (
                  <Typography sx={{ color: "error.main", fontSize: 15 }}>
                    Only {product.stock} left!
                  </Typography>
                )}
                {product.stock === 0 && (
                  <Typography sx={{ color: "error.main", fontSize: 15 }}>
                    Out of Stock
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Description
                </Typography>
                <Typography sx={{ color: "#333", fontSize: 16 }}>
                  {product.description || "No description available."}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Product Details
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#333", fontSize: 16 }}>
                  <li>
                    <strong>Category:</strong> {product.category}
                  </li>
                  <li>
                    <strong>Brand:</strong> {product.brand || "Generic Brand"}
                  </li>
                  {product.weight && (
                    <li>
                      <strong>Weight:</strong> {product.weight}
                    </li>
                  )}
                  {product.servings && (
                    <li>
                      <strong>Servings:</strong> {product.servings}
                    </li>
                  )}
                </Box>
              </Box>

              {/* Purchase Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#f5f8ff",
                    borderRadius: 2,
                    p: 1,
                    boxShadow: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      minWidth: 32,
                      borderRadius: 2,
                      fontWeight: "bold",
                    }}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Typography sx={{ fontSize: 18, minWidth: 32, textAlign: "center" }}>
                    {quantity}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      minWidth: 32,
                      borderRadius: 2,
                      fontWeight: "bold",
                    }}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 4,
                    boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                  }}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductDetail;
