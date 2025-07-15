import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  CircularProgress,
  Paper,
  InputBase,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";
import { Icon } from "@iconify/react";
import { getSupplementImageUrl } from '../utils/helpers';

const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const categories = [
  "all",
  "protein",
  "pre-workout",
  "post-workout",
  "vitamins"
];

function UserStore({ addToCart, cartItems }) {
  const [supplements, setSupplements] = useState([]);
  const [filteredSupplements, setFilteredSupplements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchSupplements();
  }, []);

  useEffect(() => {
    const initialQuantities = {};
    supplements.forEach(supp => {
      initialQuantities[supp._id] = 1;
    });
    setQuantities(initialQuantities);
  }, [supplements]);

  const fetchSupplements = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/supplements");
      const data = await response.json();
      if (Array.isArray(data)) {
        setSupplements(data);
        setFilteredSupplements(data);
      } else {
        setSupplements([]);
        setFilteredSupplements([]);
      }
    } catch (error) {
      setSupplements([]);
      setFilteredSupplements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = supplements;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        supp => supp.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(supp =>
        supp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supp.brand && supp.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredSupplements(filtered);
  }, [supplements, selectedCategory, searchTerm]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const navigateToProduct = (productId) => navigate(`/product/${productId}`);

  const handleQuantityChange = (suppId, change) => {
    setQuantities(prev => {
      const currentQty = prev[suppId] || 1;
      const newQty = Math.max(1, Math.min(currentQty + change,
        supplements.find(s => s._id === suppId)?.stock || 1));
      return { ...prev, [suppId]: newQty };
    });
  };

  const handleAddToCart = (supp) => {
    addToCart({ ...supp, quantity: quantities[supp._id] });
    setQuantities(prev => ({ ...prev, [supp._id]: 1 }));
  };

  const getCartItemCount = (suppId) =>
    cartItems?.find(item => item._id === suppId)?.quantity || 0;

  // Sidebar content styled like WorkoutPlanUser
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
                color: "#ffff",
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
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            overflowX: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              Supplement Store
            </Typography>
            <Tooltip title="View Cart">
              <IconButton onClick={() => navigate('/cart')} sx={{ ml: 2 }}>
                <Badge badgeContent={cartItems?.length || 0} color="primary">
                  <ShoppingCartIcon fontSize="large" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
            <Paper
              component="form"
              sx={{
                p: '2px 8px',
                display: 'flex',
                alignItems: 'center',
                width: 320,
                borderRadius: 3,
                boxShadow: 2,
                background: "#f5f8ff",
              }}
              onSubmit={e => e.preventDefault()}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 16 }}
                placeholder="Search supplements..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <CloseIcon
                sx={{
                  cursor: "pointer",
                  color: "#888",
                  fontSize: 20,
                  display: searchTerm ? "block" : "none"
                }}
                onClick={() => setSearchTerm("")}
              />
            </Paper>
            <Box sx={{ display: "flex", gap: 1 }}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "contained" : "outlined"}
                  color={selectedCategory === category ? "primary" : "inherit"}
                  sx={{
                    borderRadius: 3,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: 15,
                    px: 2,
                    boxShadow: selectedCategory === category ? 3 : 0,
                  }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading supplements...</Typography>
            </Box>
          ) : filteredSupplements.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography>
                {searchTerm || selectedCategory !== "all"
                  ? "No matching supplements found"
                  : "No supplements available"}
              </Typography>
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 2, fontWeight: "bold" }}
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setFilteredSupplements(supplements);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          ) : (
            <>
              <Typography sx={{ mb: 2, fontSize: 15, color: "text.secondary" }}>
                Showing {filteredSupplements.length} of {supplements.length} items
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                  gap: 3,
                }}
              >
                {filteredSupplements.map((supp) => (
                  <Paper
                    key={supp._id}
                    elevation={5}
                    sx={{
                      borderRadius: 4,
                      p: 2,
                      bgcolor: "rgba(245,248,255,0.90)",
                      boxShadow: "0 2px 12px 0 rgba(34,69,98,0.09)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      minHeight: 340,
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 4px 24px 0 rgba(34,69,98,0.16)" },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: 140,
                        mb: 1,
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "#e5eaf2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => navigateToProduct(supp._id)}
                    >
                      <img
                        src={getSupplementImageUrl(supp.image)}
                        alt={supp.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          left: 6,
                          bgcolor: "#224562",
                          color: "#fff",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: 13,
                          fontWeight: "bold",
                          opacity: 0.9,
                        }}
                      >
                        {supp.category}
                      </Box>
                      {getCartItemCount(supp._id) > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            bgcolor: "#FFD600",
                            color: "#224562",
                            px: 1,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          In Cart: {getCartItemCount(supp._id)}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ width: "100%", textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ cursor: "pointer", mb: 0.5 }}
                        onClick={() => navigateToProduct(supp._id)}
                      >
                        {supp.name}
                      </Typography>
                      <Typography sx={{ fontSize: 15, color: "text.secondary", mb: 1 }}>
                        {supp.brand || 'Generic Brand'}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center", mb: 1 }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: 17, color: "#224562" }}>
                          Rs. {supp.price}
                        </Typography>
                        {supp.stock <= 5 && (
                          <Typography sx={{ color: "error.main", fontSize: 13 }}>
                            Only {supp.stock} left!
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ minWidth: 32, borderRadius: 2, fontWeight: "bold" }}
                          onClick={() => handleQuantityChange(supp._id, -1)}
                          disabled={quantities[supp._id] <= 1}
                        >
                          -
                        </Button>
                        <Typography sx={{ fontSize: 16, minWidth: 24, textAlign: "center" }}>
                          {quantities[supp._id] || 1}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ minWidth: 32, borderRadius: 2, fontWeight: "bold" }}
                          onClick={() => handleQuantityChange(supp._id, 1)}
                          disabled={quantities[supp._id] >= supp.stock}
                        >
                          +
                        </Button>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                          fontWeight: "bold",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                          mt: 1,
                        }}
                        onClick={() => handleAddToCart(supp)}
                        disabled={supp.stock <= 0}
                      >
                        {supp.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default UserStore;
