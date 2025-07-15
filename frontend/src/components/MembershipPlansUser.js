import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar button config (copied from your theme)
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const MembershipPlansUser = ({ userId: propUserId }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(propUserId);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sidebar content
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

  // If userId is not passed as a prop, extract it from the JWT token
  useEffect(() => {
    if (!userId) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          setUserId(id);
        } catch (error) {
          setMessage("Failed to retrieve user information. Please log in again.");
        }
      } else {
        setMessage("No authentication token found. Please log in.");
      }
    }
  }, [userId]);

  // Fetch plans and user data
  useEffect(() => {
    const fetchAll = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const plansRes = await axios.get("http://localhost:5000/api/membership-plans");
        setPlans(plansRes.data);
        const userRes = await axios.get(`http://localhost:5000/user/${userId}`);
        setSelectedPlanId(userRes.data.selectedPlan || null);
        setLoading(false);
      } catch (err) {
        setMessage(`Failed to load plans or user info. Error: ${err.message}`);
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  // Handle plan selection
  const handleChoosePlan = async (planId, planName) => {
    if (!userId) {
      setMessage("No user ID available. Please log in.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/user/${userId}/select-plan`, { planId, planName });
      setSelectedPlanId(planId);
      setMessage("Plan selected!");
    } catch (err) {
      // ...error handling as before
    }
  };
  

  if (loading)
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
        <CircularProgress />
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
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Membership Plans
          </Typography>
          {message && (
            <Typography
              sx={{ mb: 2 }}
              color={message.includes("Failed") ? "error" : "success.main"}
            >
              {message}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {plans.map((plan) => (
              <Paper
                key={plan._id}
                elevation={5}
                sx={{
                  background: "rgba(34,69,98,0.90)",
                  color: "#fff",
                  borderRadius: 4,
                  p: 3,
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                  boxShadow: "0 2px 12px 0 rgba(34,69,98,0.12)",
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {plan.planName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: "#FFD600" }}>
                    Rs. {plan.price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e0e0e0", ml: 1 }}>
                    / {plan.duration}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {Array.isArray(plan.features) &&
                      plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 15,
                            marginBottom: 6,
                          }}
                        >
                          <Icon icon="mdi:check-circle" color="#00e676" width={18} style={{ marginRight: 6 }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                  </ul>
                </Box>
                <Button
  fullWidth
  variant="contained"
  color="primary"
  // ...other props
  onClick={() => handleChoosePlan(plan._id, plan.planName)}
  disabled={selectedPlanId === plan._id}
>
  {selectedPlanId === plan._id ? "Chosen" : "Buy Plan"}
</Button>

              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MembershipPlansUser;
